
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PrinterIcon, RefreshCw, Save } from "lucide-react";

interface Seat {
  id: number;
  status: "empty" | "occupied" | "proctor";
  studentId?: string;
  studentName?: string;
}

interface RoomVisualizerProps {
  rows?: number;
  cols?: number;
}

const RoomVisualizer = ({ rows = 6, cols = 8 }: RoomVisualizerProps) => {
  const [seats, setSeats] = useState<Seat[]>(() => {
    // Generate initial seats
    const initialSeats: Seat[] = [];
    const totalSeats = rows * cols;
    
    for (let i = 0; i < totalSeats; i++) {
      // Make some seats occupied for demonstration
      const randomStatus = Math.random() > 0.7 ? "occupied" : "empty";
      
      initialSeats.push({
        id: i,
        status: randomStatus,
        ...(randomStatus === "occupied" 
          ? { 
              studentId: `ST${1000 + i}`,
              studentName: `طالب ${i + 1}`
            } 
          : {})
      });
    }
    
    // Add proctors at strategic positions
    const proctorPositions = [0, cols - 1, totalSeats - cols, totalSeats - 1];
    proctorPositions.forEach(pos => {
      if (initialSeats[pos]) {
        initialSeats[pos].status = "proctor";
        initialSeats[pos].studentId = undefined;
        initialSeats[pos].studentName = "مراقب";
      }
    });
    
    return initialSeats;
  });

  const handleSeatClick = (seatId: number) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { 
              ...seat, 
              status: seat.status === "empty" 
                ? "occupied" 
                : seat.status === "occupied" 
                  ? "proctor" 
                  : "empty" 
            } 
          : seat
      )
    );
  };

  const autoAssign = () => {
    // Simple auto-assignment algorithm
    setSeats(prevSeats => {
      // Reset all seats
      const newSeats = prevSeats.map(seat => ({
        ...seat,
        status: "empty",
        studentId: undefined,
        studentName: undefined
      }));
      
      // Place proctors at corners
      const proctorPositions = [0, cols - 1, (rows - 1) * cols, rows * cols - 1];
      proctorPositions.forEach(pos => {
        if (newSeats[pos]) {
          newSeats[pos].status = "proctor";
          newSeats[pos].studentName = "مراقب";
        }
      });
      
      // Place students with spacing (checkerboard pattern)
      let studentCount = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const index = r * cols + c;
          // Skip if already a proctor
          if (newSeats[index].status === "proctor") continue;
          
          // Create a checkerboard pattern (skip every other seat)
          if ((r + c) % 2 === 0) {
            newSeats[index].status = "occupied";
            newSeats[index].studentId = `ST${1000 + studentCount}`;
            newSeats[index].studentName = `طالب ${studentCount}`;
            studentCount++;
          }
        }
      }
      
      return newSeats;
    });
  };

  return (
    <div className="rounded-lg border shadow-sm bg-white p-6">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-xl font-semibold">خريطة القاعة</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={autoAssign}>
            <RefreshCw className="h-4 w-4 mr-2" />
            توزيع تلقائي
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            حفظ التوزيع
          </Button>
          <Button variant="outline" size="sm">
            <PrinterIcon className="h-4 w-4 mr-2" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border mb-4 overflow-x-auto">
        <div className="w-full text-center mb-4 p-2 bg-gray-200 rounded">منصة المعلم</div>
        
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
          justifyItems: 'center'
        }}>
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`grid-seat ${seat.status}`}
              onClick={() => handleSeatClick(seat.id)}
              title={seat.studentName}
            >
              {seat.status === "empty" ? "" : seat.studentId || "M"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="grid-seat empty w-6 h-6 mr-2"></div>
          <span>مقعد فارغ</span>
        </div>
        <div className="flex items-center">
          <div className="grid-seat occupied w-6 h-6 mr-2"></div>
          <span>مقعد طالب</span>
        </div>
        <div className="flex items-center">
          <div className="grid-seat proctor w-6 h-6 mr-2"></div>
          <span>مراقب</span>
        </div>
      </div>
    </div>
  );
};

export default RoomVisualizer;
