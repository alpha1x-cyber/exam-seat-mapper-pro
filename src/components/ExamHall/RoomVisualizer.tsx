
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin, User, Ban, Save, Printer } from "lucide-react";

interface RoomVisualizerProps {
  rows: number;
  cols: number;
  hallName?: string;
}

// Types for seat status
type SeatStatus = "available" | "occupied" | "disabled";

interface Seat {
  id: string;
  status: SeatStatus;
  studentId?: string;
  studentName?: string;
}

const RoomVisualizer = ({ rows = 6, cols = 8, hallName = "القاعة" }: RoomVisualizerProps) => {
  // Create initial seats grid
  const initialSeats: Seat[][] = Array(rows)
    .fill(null)
    .map((_, rowIndex) =>
      Array(cols)
        .fill(null)
        .map((_, colIndex) => ({
          id: `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`,
          status: "available",
        }))
    );

  const [seats, setSeats] = useState<Seat[][]>(initialSeats);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Count of seats by status
  const availableSeats = seats.flat().filter(seat => seat.status === "available").length;
  const occupiedSeats = seats.flat().filter(seat => seat.status === "occupied").length;
  const disabledSeats = seats.flat().filter(seat => seat.status === "disabled").length;

  const handleSeatClick = (seat: Seat, rowIndex: number, colIndex: number) => {
    // Make a copy of the seat so we can edit it in the dialog
    setSelectedSeat({ ...seat, rowIndex, colIndex });
    setSeatDialogOpen(true);
  };

  const handleUpdateSeat = () => {
    if (!selectedSeat) return;
    
    const { rowIndex, colIndex, ...seatData } = selectedSeat as Seat & { rowIndex: number; colIndex: number };
    
    // Create a deep copy of the seats array
    const updatedSeats = [...seats];
    updatedSeats[rowIndex] = [...seats[rowIndex]];
    updatedSeats[rowIndex][colIndex] = seatData;
    
    setSeats(updatedSeats);
    setSeatDialogOpen(false);
    
    toast({
      title: "تم تحديث المقعد",
      description: `تم تحديث حالة المقعد ${seatData.id} بنجاح`,
    });
  };
  
  const handleUpdateSeatStatus = (status: SeatStatus) => {
    if (!selectedSeat) return;
    
    // If changing to available, remove student info
    if (status === "available") {
      setSelectedSeat({
        ...selectedSeat,
        status,
        studentId: undefined,
        studentName: undefined,
      });
    } else {
      setSelectedSeat({
        ...selectedSeat,
        status,
      });
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const getSeatColor = (status: SeatStatus) => {
    switch (status) {
      case "available":
        return "bg-green-100 hover:bg-green-200 border-green-300";
      case "occupied":
        return "bg-blue-100 hover:bg-blue-200 border-blue-300";
      case "disabled":
        return "bg-gray-100 hover:bg-gray-200 border-gray-300";
      default:
        return "bg-white";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <CardTitle>{hallName}</CardTitle>
            <Button variant="outline" onClick={handlePrint} className="print-hidden">
              <Printer className="ml-2 h-4 w-4" />
              طباعة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded border border-green-200 text-center">
              <div className="text-lg font-medium">{availableSeats}</div>
              <div className="text-sm text-muted-foreground">مقعد متاح</div>
            </div>
            <div className="bg-blue-50 p-3 rounded border border-blue-200 text-center">
              <div className="text-lg font-medium">{occupiedSeats}</div>
              <div className="text-sm text-muted-foreground">مقعد محجوز</div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
              <div className="text-lg font-medium">{disabledSeats}</div>
              <div className="text-sm text-muted-foreground">مقعد معطل</div>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200 text-center">
              <div className="text-lg font-medium">{rows * cols}</div>
              <div className="text-sm text-muted-foreground">إجمالي المقاعد</div>
            </div>
          </div>
          
          <div className="flex justify-center pb-4">
            <div className="border border-dashed border-gray-300 p-4 rounded-lg text-center w-full md:w-2/3 mx-auto">
              <div className="font-medium mb-2">مقدمة القاعة</div>
              
              <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: '0.5rem' }}>
                {seats.map((row, rowIndex) =>
                  row.map((seat, colIndex) => (
                    <TooltipProvider key={`${rowIndex}-${colIndex}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`seat-button aspect-square p-1 sm:p-2 border rounded-md flex items-center justify-center ${getSeatColor(
                              seat.status
                            )}`}
                            onClick={() => handleSeatClick(seat, rowIndex, colIndex)}
                          >
                            <span className="text-xs sm:text-sm font-medium">{seat.id}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div className="text-center">
                            <div className="font-bold">{seat.id}</div>
                            {seat.status === "occupied" && seat.studentName && (
                              <div className="text-xs">{seat.studentName}</div>
                            )}
                            <div className="text-xs">
                              {seat.status === "available"
                                ? "متاح"
                                : seat.status === "occupied"
                                ? "محجوز"
                                : "معطل"}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
              
              <div className="font-medium mt-4">مؤخرة القاعة</div>
            </div>
          </div>
          
          <div className="flex justify-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm ml-1"></div>
              <span>متاح</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm ml-1"></div>
              <span>محجوز</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm ml-1"></div>
              <span>معطل</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={seatDialogOpen} onOpenChange={setSeatDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات المقعد {selectedSeat?.id}</DialogTitle>
          </DialogHeader>
          {selectedSeat && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedSeat.status === "available" ? "default" : "outline"}
                  className="flex flex-col items-center py-3"
                  onClick={() => handleUpdateSeatStatus("available")}
                >
                  <MapPin className="h-5 w-5 mb-1" />
                  <span className="text-xs">متاح</span>
                </Button>
                <Button
                  variant={selectedSeat.status === "occupied" ? "default" : "outline"}
                  className="flex flex-col items-center py-3"
                  onClick={() => handleUpdateSeatStatus("occupied")}
                >
                  <User className="h-5 w-5 mb-1" />
                  <span className="text-xs">محجوز</span>
                </Button>
                <Button
                  variant={selectedSeat.status === "disabled" ? "default" : "outline"}
                  className="flex flex-col items-center py-3"
                  onClick={() => handleUpdateSeatStatus("disabled")}
                >
                  <Ban className="h-5 w-5 mb-1" />
                  <span className="text-xs">معطل</span>
                </Button>
              </div>
              
              {selectedSeat.status === "occupied" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="student-id">رقم الطالب</Label>
                    <Input
                      id="student-id"
                      value={selectedSeat.studentId || ""}
                      onChange={(e) =>
                        setSelectedSeat({
                          ...selectedSeat,
                          studentId: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="student-name">اسم الطالب</Label>
                    <Input
                      id="student-name"
                      value={selectedSeat.studentName || ""}
                      onChange={(e) =>
                        setSelectedSeat({
                          ...selectedSeat,
                          studentName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              
              <Button
                className="w-full"
                onClick={handleUpdateSeat}
              >
                <Save className="ml-2 h-4 w-4" />
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>
        {`
        @media print {
          .print-hidden {
            display: none !important;
          }
        }
        `}
      </style>
    </div>
  );
};

export default RoomVisualizer;
