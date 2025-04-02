
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, PrinterIcon } from "lucide-react";

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
  const currentHall = demoHalls.find(hall => hall.id === selectedHall) || demoHalls[0];
  
  const handlePrint = () => {
    window.print();
  };
  
  const toggleAttendance = (studentId: string) => {
    // In a real app, this would update the state
    console.log(`Toggled attendance for student ${studentId}`);
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
          <Button onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4 mr-2" />
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
                    className={`px-2 py-1 rounded-full text-xs ${
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
    </div>
  );
};

export default AttendanceSheet;
