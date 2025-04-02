
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, PrinterIcon, FileText, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Student {
  id: string;
  name: string;
  seat: string;
  present: boolean;
}

interface HallData {
  id: string;
  name: string;
  date: string;
  time: string;
  proctor: string;
  subject: string;
  students: Student[];
}

// Demo data
const demoHalls: HallData[] = [
  {
    id: "H101",
    name: "قاعة 101",
    date: "15 ديسمبر 2023",
    time: "09:00 ص",
    proctor: "أ. محمد أحمد",
    subject: "اللغة العربية",
    students: [
      { id: "ST1001", name: "أحمد محمد", seat: "A1", present: true },
      { id: "ST1002", name: "محمد أحمد", seat: "A2", present: false },
      { id: "ST1003", name: "سارة علي", seat: "A3", present: true },
      { id: "ST1004", name: "نورة خالد", seat: "B1", present: true },
      { id: "ST1005", name: "خالد عبدالله", seat: "B2", present: true },
      { id: "ST1006", name: "عمر محمد", seat: "B3", present: false },
      { id: "ST1007", name: "هدى أحمد", seat: "C1", present: true },
      { id: "ST1008", name: "فاطمة سعيد", seat: "C2", present: true },
      { id: "ST1009", name: "عبدالله سالم", seat: "C3", present: true },
      { id: "ST1010", name: "مريم علي", seat: "D1", present: false },
    ],
  },
  {
    id: "H102",
    name: "قاعة 102",
    date: "15 ديسمبر 2023",
    time: "09:00 ص",
    proctor: "أ. خالد عبدالله",
    subject: "الرياضيات",
    students: [
      { id: "ST1011", name: "يوسف محمد", seat: "A1", present: true },
      { id: "ST1012", name: "ليلى أحمد", seat: "A2", present: true },
      { id: "ST1013", name: "محمد سعد", seat: "A3", present: false },
      { id: "ST1014", name: "نور محمد", seat: "B1", present: true },
      { id: "ST1015", name: "سعد خالد", seat: "B2", present: true },
    ],
  },
];

const AttendanceSheet = () => {
  const [selectedHall, setSelectedHall] = useState<string>(demoHalls[0].id);
  const [showAddStudentDialog, setShowAddStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState<{ id: string; name: string; seat: string }>({
    id: "",
    name: "",
    seat: ""
  });
  const { toast } = useToast();
  
  const currentHall = demoHalls.find(hall => hall.id === selectedHall) || demoHalls[0];
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>كشف الحضور - ${currentHall.name}</title>
            <style>
              body { font-family: 'Tajawal', Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 20px; }
              .header-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; background: #f9fafb; padding: 15px; border-radius: 8px; }
              .header-item { display: flex; flex-direction: column; }
              .header-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
              .header-value { font-weight: 500; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: right; }
              th { background-color: #f3f4f6; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .present { color: green; }
              .absent { color: red; }
              .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
              .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; text-align: center; }
              .stat-value { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .stat-label { font-size: 12px; color: #6b7280; }
              .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
              .signature-block { display: flex; flex-direction: column; align-items: center; }
              .signature-line { width: 200px; border-bottom: 1px solid black; margin-bottom: 10px; height: 40px; }
              @media print {
                @page { size: portrait; margin: 2cm; }
                body { font-size: 12px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>كشف الحضور والغياب</h1>
            
            <div class="header-info">
              <div class="header-item">
                <span class="header-label">المادة</span>
                <span class="header-value">${currentHall.subject}</span>
              </div>
              <div class="header-item">
                <span class="header-label">القاعة</span>
                <span class="header-value">${currentHall.name}</span>
              </div>
              <div class="header-item">
                <span class="header-label">التاريخ</span>
                <span class="header-value">${currentHall.date}</span>
              </div>
              <div class="header-item">
                <span class="header-label">الوقت</span>
                <span class="header-value">${currentHall.time}</span>
              </div>
              <div class="header-item">
                <span class="header-label">المراقب</span>
                <span class="header-value">${currentHall.proctor}</span>
              </div>
            </div>
            
            <div class="stats">
              <div class="stat-card">
                <div class="stat-value">${currentHall.students.length}</div>
                <div class="stat-label">إجمالي الطلاب</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" style="color: green">${currentHall.students.filter(s => s.present).length}</div>
                <div class="stat-label">الحاضرون</div>
              </div>
              <div class="stat-card">
                <div class="stat-value" style="color: red">${currentHall.students.filter(s => !s.present).length}</div>
                <div class="stat-label">الغائبون</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.round((currentHall.students.filter(s => s.present).length / currentHall.students.length) * 100)}%</div>
                <div class="stat-label">نسبة الحضور</div>
              </div>
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>رقم الطالب</th>
                  <th>الاسم</th>
                  <th>المقعد</th>
                  <th>الحالة</th>
                  <th>التوقيع</th>
                </tr>
              </thead>
              <tbody>
                ${currentHall.students.map(student => `
                  <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.seat}</td>
                    <td class="${student.present ? 'present' : 'absent'}">${student.present ? 'حاضر' : 'غائب'}</td>
                    <td>${student.present ? '<div style="height: 20px;"></div>' : ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="signature-section">
              <div class="signature-block">
                <div class="signature-line"></div>
                <div>توقيع المراقب</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div>توقيع مدير القاعة</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div>توقيع المشرف الأكاديمي</div>
              </div>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')} - الوقت: ${new Date().toLocaleTimeString('ar-SA')}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <button onclick="window.print()">طباعة</button>
              <button onclick="window.close()">إغلاق</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    }
  };
  
  const toggleAttendance = (studentId: string) => {
    const hallIndex = demoHalls.findIndex(hall => hall.id === selectedHall);
    if (hallIndex === -1) return;

    const studentIndex = demoHalls[hallIndex].students.findIndex(student => student.id === studentId);
    if (studentIndex === -1) return;

    // Toggle the attendance status
    demoHalls[hallIndex].students[studentIndex].present = !demoHalls[hallIndex].students[studentIndex].present;
    
    // Force a re-render
    setSelectedHall(selectedHall);
    
    toast({
      title: demoHalls[hallIndex].students[studentIndex].present ? "تم تسجيل الحضور" : "تم تسجيل الغياب",
      description: `تم تحديث حالة الطالب ${demoHalls[hallIndex].students[studentIndex].name}`,
    });
  };
  
  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.seat) {
      toast({
        title: "خطأ",
        description: "الرجاء تعبئة اسم الطالب ورقم المقعد",
        variant: "destructive",
      });
      return;
    }

    const hallIndex = demoHalls.findIndex(hall => hall.id === selectedHall);
    if (hallIndex === -1) return;

    // Generate a student ID if not provided
    const studentId = newStudent.id || `ST${1000 + demoHalls[hallIndex].students.length + 1}`;
    
    // Add the new student to the selected hall
    demoHalls[hallIndex].students.push({
      id: studentId,
      name: newStudent.name,
      seat: newStudent.seat,
      present: true
    });
    
    // Reset the form
    setNewStudent({ id: "", name: "", seat: "" });
    setShowAddStudentDialog(false);
    
    // Force a re-render
    setSelectedHall(selectedHall);
    
    toast({
      title: "تم إضافة الطالب",
      description: `تم إضافة الطالب ${newStudent.name} إلى كشف الحضور`,
    });
  };
  
  // Calculate statistics
  const totalStudents = currentHall.students.length;
  const presentStudents = currentHall.students.filter(s => s.present).length;
  const absentStudents = totalStudents - presentStudents;
  const attendancePercentage = Math.round((presentStudents / totalStudents) * 100);

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">كشف الحضور والغياب</h3>
        <div className="flex items-center gap-2">
          <Select value={selectedHall} onValueChange={setSelectedHall}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر القاعة" />
            </SelectTrigger>
            <SelectContent>
              {demoHalls.map(hall => (
                <SelectItem key={hall.id} value={hall.id}>
                  {hall.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={showAddStudentDialog} onOpenChange={setShowAddStudentDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="h-4 w-4 ml-2" />
                إضافة طالب
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
                <DialogDescription>أدخل بيانات الطالب لإضافته إلى كشف الحضور</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="studentId">رقم الطالب (اختياري):</label>
                  <Input
                    id="studentId"
                    value={newStudent.id}
                    onChange={(e) => setNewStudent({...newStudent, id: e.target.value})}
                    placeholder="أدخل رقم الطالب"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="studentName">اسم الطالب:</label>
                  <Input
                    id="studentName"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="أدخل اسم الطالب"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="studentSeat">رقم المقعد:</label>
                  <Input
                    id="studentSeat"
                    value={newStudent.seat}
                    onChange={(e) => setNewStudent({...newStudent, seat: e.target.value})}
                    placeholder="مثال: A1"
                  />
                </div>
                <Button onClick={handleAddStudent} className="w-full">
                  إضافة الطالب
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4 ml-2" />
            طباعة
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded-md bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">المادة</p>
            <p className="font-medium">{currentHall.subject}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">القاعة</p>
            <p className="font-medium">{currentHall.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">التاريخ</p>
              <p className="font-medium">{currentHall.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">الوقت</p>
              <p className="font-medium">{currentHall.time}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="stat-card flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">إجمالي الطلاب</p>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="stat-card flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">الحاضرون</p>
          <p className="text-2xl font-bold text-green-600">{presentStudents}</p>
        </div>
        <div className="stat-card flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">الغائبون</p>
          <p className="text-2xl font-bold text-red-600">{absentStudents}</p>
        </div>
        <div className="stat-card flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">نسبة الحضور</p>
          <p className="text-2xl font-bold">{attendancePercentage}%</p>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">رقم الطالب</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الاسم</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">المقعد</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الحالة</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">التوقيع</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentHall.students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{student.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                <td className="px-4 py-3 text-sm">{student.seat}</td>
                <td className="px-4 py-3 text-sm">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs cursor-pointer ${
                      student.present 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}
                    onClick={() => toggleAttendance(student.id)}
                  >
                    {student.present ? "حاضر" : "غائب"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {student.present && (
                    <div className="w-24 h-6 border-b border-gray-300"></div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 border rounded-md bg-gray-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">المراقب</p>
            <p className="font-medium">{currentHall.proctor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">توقيع المراقب</p>
            <div className="w-32 h-6 border-b border-gray-300 mt-1"></div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-amber-600" />
            <h4 className="font-medium text-amber-700">تعليمات للمراقبين</h4>
          </div>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>التأكد من هوية الطلاب قبل تسجيل الحضور</li>
            <li>توقيع الطالب بجانب اسمه إلزامي</li>
            <li>تسليم كشف الحضور والغياب بعد انتهاء الاختبار مباشرة</li>
            <li>الإبلاغ عن أي مخالفات أو حالات غش فوراً</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSheet;
