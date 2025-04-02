
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PrinterIcon,
  RefreshCw,
  Save,
  Settings,
  Plus,
  Minus,
  Users,
  UserPlus
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

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

const RoomVisualizer = ({ rows: initialRows = 6, cols: initialCols = 8 }: RoomVisualizerProps) => {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [showSettings, setShowSettings] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const { toast } = useToast();

  const [seats, setSeats] = useState<Seat[]>(() => {
    // Generate initial seats
    const initialSeats: Seat[] = [];
    const totalSeats = rows * cols;
    
    for (let i = 0; i < totalSeats; i++) {
      // Make some seats occupied for demonstration
      const randomStatus = Math.random() > 0.7 ? "occupied" as const : "empty" as const;
      
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
        initialSeats[pos].status = "proctor" as const;
        initialSeats[pos].studentId = undefined;
        initialSeats[pos].studentName = "مراقب";
      }
    });
    
    return initialSeats;
  });

  const handleSeatClick = (seatId: number) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return;

    if (seat.status === "empty") {
      setSelectedSeat(seat);
      setStudentName("");
      setStudentId("");
      setShowStudentDialog(true);
    } else {
      setSeats(prevSeats => 
        prevSeats.map(seat => 
          seat.id === seatId 
            ? { 
                ...seat, 
                status: seat.status === "empty" 
                  ? "occupied" as const
                  : seat.status === "occupied" 
                    ? "proctor" as const
                    : "empty" as const,
                studentId: seat.status === "empty" ? undefined : seat.studentId,
                studentName: seat.status === "empty" ? undefined : seat.studentName
              } 
            : seat
        )
      );
    }
  };

  const handleAddStudent = () => {
    if (!selectedSeat) return;
    
    if (!studentName.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الطالب",
        variant: "destructive",
      });
      return;
    }
    
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === selectedSeat.id 
          ? { 
              ...seat, 
              status: "occupied" as const,
              studentId: studentId || `ST${1000 + seat.id}`,
              studentName: studentName
            } 
          : seat
      )
    );
    
    setShowStudentDialog(false);
    setSelectedSeat(null);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: `تم تعيين ${studentName} إلى المقعد رقم ${selectedSeat.id + 1}`,
    });
  };

  const autoAssign = () => {
    // Simple auto-assignment algorithm
    setSeats(prevSeats => {
      // Reset all seats
      const newSeats = prevSeats.map(seat => ({
        ...seat,
        status: "empty" as const,
        studentId: undefined,
        studentName: undefined
      }));
      
      // Place proctors at corners
      const proctorPositions = [0, cols - 1, (rows - 1) * cols, rows * cols - 1];
      proctorPositions.forEach(pos => {
        if (newSeats[pos]) {
          newSeats[pos].status = "proctor" as const;
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
            newSeats[index].status = "occupied" as const;
            newSeats[index].studentId = `ST${1000 + studentCount}`;
            newSeats[index].studentName = `طالب ${studentCount}`;
            studentCount++;
          }
        }
      }

      toast({
        title: "تم التوزيع بنجاح",
        description: `تم توزيع ${studentCount - 1} طالب في القاعة`,
      });
      
      return newSeats;
    });
  };

  const optimizeDistribution = () => {
    // More advanced algorithm with social distancing
    setSeats(prevSeats => {
      // Reset all seats
      const newSeats = prevSeats.map(seat => ({
        ...seat,
        status: "empty" as const,
        studentId: undefined,
        studentName: undefined
      }));
      
      // Place proctors at strategic positions
      const proctorPositions = [0, cols - 1, (rows - 1) * cols, rows * cols - 1];
      proctorPositions.forEach(pos => {
        if (newSeats[pos]) {
          newSeats[pos].status = "proctor" as const;
          newSeats[pos].studentName = "مراقب";
        }
      });
      
      // Place students with maximum spacing
      let studentCount = 1;
      // First row, then skipping 1
      for (let r = 1; r < rows; r += 2) {
        for (let c = 1; c < cols; c += 2) {
          const index = r * cols + c;
          if (index < newSeats.length) {
            newSeats[index].status = "occupied" as const;
            newSeats[index].studentId = `ST${1000 + studentCount}`;
            newSeats[index].studentName = `طالب ${studentCount}`;
            studentCount++;
          }
        }
      }
      
      // Second pass to add more students if needed
      for (let r = 0; r < rows; r += 2) {
        for (let c = 0; c < cols; c += 2) {
          const index = r * cols + c;
          if (index < newSeats.length && !proctorPositions.includes(index) && newSeats[index].status === "empty") {
            newSeats[index].status = "occupied" as const;
            newSeats[index].studentId = `ST${1000 + studentCount}`;
            newSeats[index].studentName = `طالب ${studentCount}`;
            studentCount++;
          }
        }
      }

      toast({
        title: "تم التوزيع الأمثل",
        description: `تم توزيع ${studentCount - 1} طالب بالتباعد الأمثل`,
      });
      
      return newSeats;
    });
  };

  const handleRoomSizeUpdate = () => {
    if (rows < 2 || cols < 2) {
      toast({
        title: "خطأ",
        description: "يجب أن يكون عدد الصفوف والأعمدة 2 على الأقل",
        variant: "destructive",
      });
      return;
    }
    
    // Generate new seats with the updated dimensions
    const newSeats: Seat[] = [];
    const totalSeats = rows * cols;
    
    for (let i = 0; i < totalSeats; i++) {
      newSeats.push({
        id: i,
        status: "empty" as const
      });
    }
    
    // Add proctors at corners
    const proctorPositions = [0, cols - 1, (rows - 1) * cols, rows * cols - 1];
    proctorPositions.forEach(pos => {
      if (newSeats[pos]) {
        newSeats[pos].status = "proctor" as const;
        newSeats[pos].studentName = "مراقب";
      }
    });
    
    setSeats(newSeats);
    setShowSettings(false);
    
    toast({
      title: "تم تحديث حجم القاعة",
      description: `تم تعديل أبعاد القاعة إلى ${rows} صفوف و ${cols} أعمدة`,
    });
  };

  const incrementRows = () => setRows(prev => Math.min(prev + 1, 12));
  const decrementRows = () => setRows(prev => Math.max(prev - 1, 2));
  const incrementCols = () => setCols(prev => Math.min(prev + 1, 12));
  const decrementCols = () => setCols(prev => Math.max(prev - 1, 2));

  const saveRoomLayout = () => {
    // In a real app, this would save to a database
    toast({
      title: "تم الحفظ",
      description: "تم حفظ تخطيط القاعة بنجاح",
    });
  };

  const printRoomLayout = () => {
    window.print();
  };

  const handleAddProctor = () => {
    const emptySeatIndex = seats.findIndex(seat => seat.status === "empty");
    
    if (emptySeatIndex === -1) {
      toast({
        title: "لا توجد مقاعد فارغة",
        description: "لا يمكن إضافة مراقب جديد لعدم توفر مقاعد فارغة",
        variant: "destructive",
      });
      return;
    }
    
    setSeats(prevSeats =>
      prevSeats.map((seat, index) =>
        index === emptySeatIndex
          ? {
              ...seat,
              status: "proctor" as const,
              studentName: "مراقب",
              studentId: undefined
            }
          : seat
      )
    );
    
    toast({
      title: "تمت الإضافة",
      description: "تم إضافة مراقب جديد إلى القاعة",
    });
  };

  return (
    <div className="rounded-lg border shadow-sm bg-white p-6">
      <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
        <h3 className="text-xl font-semibold">خريطة القاعة</h3>
        <div className="flex gap-2 flex-wrap">
          <TooltipProvider>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 ml-2" />
                      إعدادات القاعة
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>تغيير أبعاد القاعة وإعدادات أخرى</p>
                  </TooltipContent>
                </Tooltip>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إعدادات القاعة</DialogTitle>
                  <DialogDescription>
                    تعديل أبعاد القاعة وإعدادات توزيع المقاعد
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="rows">عدد الصفوف:</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementRows}
                        disabled={rows <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="rows"
                        type="number"
                        min="2"
                        max="12"
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={incrementRows}
                        disabled={rows >= 12}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="cols">عدد الأعمدة:</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={decrementCols}
                        disabled={cols <= 2}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        id="cols"
                        type="number"
                        min="2"
                        max="12"
                        value={cols}
                        onChange={(e) => setCols(parseInt(e.target.value) || 2)}
                        className="w-20 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={incrementCols}
                        disabled={cols >= 12}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handleRoomSizeUpdate} className="w-full">
                    تحديث أبعاد القاعة
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={autoAssign}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  توزيع تلقائي
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>توزيع الطلاب بشكل متساوي في القاعة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={optimizeDistribution}>
                  <Users className="h-4 w-4 ml-2" />
                  توزيع أمثل
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>توزيع الطلاب بالتباعد الأمثل</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleAddProctor}>
                  <UserPlus className="h-4 w-4 ml-2" />
                  إضافة مراقب
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إضافة مراقب إلى مقعد فارغ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={saveRoomLayout}>
                  <Save className="h-4 w-4 ml-2" />
                  حفظ التوزيع
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>حفظ تخطيط القاعة الحالي</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={printRoomLayout}>
                  <PrinterIcon className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>طباعة خريطة القاعة</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Dialog open={showStudentDialog} onOpenChange={setShowStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>إضافة طالب إلى المقعد</DialogTitle>
            <DialogDescription>
              {selectedSeat && `إضافة طالب إلى المقعد رقم ${selectedSeat.id + 1}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="studentName">اسم الطالب:</label>
              <Input
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="أدخل اسم الطالب"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="studentId">رقم الطالب (اختياري):</label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="أدخل رقم الطالب"
              />
            </div>
            <Button onClick={handleAddStudent} className="w-full">
              إضافة الطالب
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="bg-gray-50 p-4 rounded-md border mb-4 overflow-x-auto">
        <div className="w-full text-center mb-4 p-2 bg-gray-200 rounded">منصة المعلم</div>
        
        <div 
          className="grid gap-2" 
          style={{ 
            gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`,
            justifyItems: 'center'
          }}
        >
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={`grid-seat ${seat.status} cursor-pointer flex items-center justify-center border rounded-md w-14 h-14 text-sm text-center`}
              onClick={() => handleSeatClick(seat.id)}
              title={seat.studentName}
              style={{
                backgroundColor: 
                  seat.status === "empty" ? "#f9fafb" : 
                  seat.status === "occupied" ? "#dbeafe" :
                  "#fee2e2",
                borderColor: 
                  seat.status === "empty" ? "#e5e7eb" : 
                  seat.status === "occupied" ? "#93c5fd" :
                  "#fca5a5",
              }}
            >
              {seat.status === "empty" ? "" : seat.studentId || "M"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div 
            className="w-6 h-6 mr-2 rounded border" 
            style={{ backgroundColor: "#f9fafb", borderColor: "#e5e7eb" }}
          ></div>
          <span>مقعد فارغ</span>
        </div>
        <div className="flex items-center">
          <div 
            className="w-6 h-6 mr-2 rounded border" 
            style={{ backgroundColor: "#dbeafe", borderColor: "#93c5fd" }}
          ></div>
          <span>مقعد طالب</span>
        </div>
        <div className="flex items-center">
          <div 
            className="w-6 h-6 mr-2 rounded border" 
            style={{ backgroundColor: "#fee2e2", borderColor: "#fca5a5" }}
          ></div>
          <span>مراقب</span>
        </div>
      </div>
    </div>
  );
};

export default RoomVisualizer;
