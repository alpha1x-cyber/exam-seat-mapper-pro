
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PrinterIcon, Plus, FileText } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  hall: string;
  supervisor: string;
  duration: string;
}

const ExamSchedule = () => {
  const [showAddExam, setShowAddExam] = useState(false);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: "EX001",
      subject: "اللغة العربية",
      date: "2023-12-15",
      time: "09:00",
      hall: "قاعة 101",
      supervisor: "أ. محمد أحمد",
      duration: "ساعتان"
    },
    {
      id: "EX002",
      subject: "الرياضيات",
      date: "2023-12-16",
      time: "10:00",
      hall: "قاعة 102",
      supervisor: "أ. خالد عبدالله",
      duration: "ساعتان"
    },
    {
      id: "EX003",
      subject: "العلوم",
      date: "2023-12-17",
      time: "09:30",
      hall: "قاعة 103",
      supervisor: "أ. فاطمة محمد",
      duration: "ساعة ونصف"
    },
    {
      id: "EX004",
      subject: "الدراسات الاجتماعية",
      date: "2023-12-18",
      time: "11:00",
      hall: "قاعة 101",
      supervisor: "أ. علي أحمد",
      duration: "ساعة"
    }
  ]);
  
  const [newExam, setNewExam] = useState<Partial<Exam>>({
    subject: "",
    date: "",
    time: "",
    hall: "",
    supervisor: "",
    duration: "ساعتان"
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExam(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewExam(prev => ({ ...prev, [name]: value }));
  };

  const addExam = () => {
    if (!newExam.subject || !newExam.date || !newExam.time || !newExam.hall || !newExam.supervisor) {
      toast({
        title: "خطأ",
        description: "الرجاء تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const examId = `EX${String(exams.length + 1).padStart(3, "0")}`;
    const examToAdd = { ...newExam, id: examId } as Exam;
    
    setExams(prev => [...prev, examToAdd]);
    setNewExam({
      subject: "",
      date: "",
      time: "",
      hall: "",
      supervisor: "",
      duration: "ساعتان"
    });
    
    setShowAddExam(false);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: `تم إضافة امتحان ${examToAdd.subject} إلى الجدول`,
    });
  };

  const printSchedule = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html dir="rtl">
          <head>
            <title>جدول الامتحانات</title>
            <style>
              body { font-family: 'Tajawal', Arial, sans-serif; margin: 20px; }
              h1 { text-align: center; margin-bottom: 30px; }
              .date { text-align: center; margin-bottom: 20px; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: right; }
              th { background-color: #f3f4f6; font-weight: bold; }
              tr:nth-child(even) { background-color: #f9fafb; }
              .print-info { display: flex; justify-content: space-between; margin-top: 40px; font-size: 14px; }
              .print-date { font-style: italic; }
              @media print {
                @page { size: portrait; margin: 1.5cm; }
                body { font-size: 12px; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>جدول الامتحانات</h1>
            <div class="date">العام الدراسي ${new Date().getFullYear()}</div>
            
            <table>
              <thead>
                <tr>
                  <th>المادة</th>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                  <th>القاعة</th>
                  <th>المراقب</th>
                  <th>المدة</th>
                </tr>
              </thead>
              <tbody>
                ${exams.map(exam => `
                  <tr>
                    <td>${exam.subject}</td>
                    <td>${new Date(exam.date).toLocaleDateString('ar-SA')}</td>
                    <td>${exam.time}</td>
                    <td>${exam.hall}</td>
                    <td>${exam.supervisor}</td>
                    <td>${exam.duration}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="print-info">
              <div>إدارة المدرسة</div>
              <div class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</div>
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

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">جدول الامتحانات</h3>
        <div className="flex gap-2">
          <Dialog open={showAddExam} onOpenChange={setShowAddExam}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                إضافة امتحان
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة امتحان جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات الامتحان لإضافته إلى الجدول
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="subject">المادة:</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={newExam.subject}
                    onChange={handleInputChange}
                    placeholder="اسم المادة"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="date">التاريخ:</label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={newExam.date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="time">الوقت:</label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={newExam.time}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="hall">القاعة:</label>
                  <Input
                    id="hall"
                    name="hall"
                    value={newExam.hall}
                    onChange={handleInputChange}
                    placeholder="رقم القاعة"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="supervisor">المراقب:</label>
                  <Input
                    id="supervisor"
                    name="supervisor"
                    value={newExam.supervisor}
                    onChange={handleInputChange}
                    placeholder="اسم المراقب"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration">المدة:</label>
                  <Select 
                    value={newExam.duration} 
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المدة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ساعة">ساعة</SelectItem>
                      <SelectItem value="ساعة ونصف">ساعة ونصف</SelectItem>
                      <SelectItem value="ساعتان">ساعتان</SelectItem>
                      <SelectItem value="ثلاث ساعات">ثلاث ساعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addExam} className="w-full mt-4">
                  إضافة الامتحان
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={printSchedule}>
            <PrinterIcon className="h-4 w-4 ml-2" />
            طباعة الجدول
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المادة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الوقت</TableHead>
              <TableHead className="text-right">القاعة</TableHead>
              <TableHead className="text-right">المراقب</TableHead>
              <TableHead className="text-right">المدة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell className="font-medium">{exam.subject}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{new Date(exam.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{exam.time}</span>
                  </div>
                </TableCell>
                <TableCell>{exam.hall}</TableCell>
                <TableCell>{exam.supervisor}</TableCell>
                <TableCell>{exam.duration}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-700">ملاحظات هامة</h4>
          </div>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>يبدأ الامتحان في الوقت المحدد تماماً</li>
            <li>على الطلاب الحضور قبل 15 دقيقة من موعد الامتحان</li>
            <li>يمنع استخدام الهواتف المحمولة داخل قاعة الامتحان</li>
            <li>يرجى إحضار البطاقة الشخصية أو بطاقة الطالب</li>
          </ul>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-amber-600" />
            <h4 className="font-medium text-amber-700">تعليمات للمراقبين</h4>
          </div>
          <ul className="space-y-1 text-sm text-amber-800">
            <li>الحضور قبل 30 دقيقة من بدء الامتحان</li>
            <li>التأكد من هوية الطلاب ومطابقتها بكشف الحضور</li>
            <li>توزيع أوراق الإجابة قبل 5 دقائق من بدء الامتحان</li>
            <li>إبلاغ المشرف عن أي حالات غش أو مخالفات</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExamSchedule;
