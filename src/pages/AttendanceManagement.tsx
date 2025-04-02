
import { useState, useEffect } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Check, X, Printer, Calendar } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data - in a real app, this would come from an API
const students = [
  { id: "ST1001", name: "أحمد محمد", grade: "الثالث", section: "أ" },
  { id: "ST1002", name: "فاطمة عبدالله", grade: "الثالث", section: "ب" },
  { id: "ST1003", name: "محمد علي", grade: "الثاني", section: "أ" },
  { id: "ST1004", name: "نور حسين", grade: "الأول", section: "ج" },
  { id: "ST1005", name: "عمر خالد", grade: "الثالث", section: "أ" },
];

const courses = [
  { id: "C001", name: "الرياضيات", grade: "الثالث" },
  { id: "C002", name: "العلوم", grade: "الثالث" },
  { id: "C003", name: "اللغة العربية", grade: "جميع الصفوف" },
  { id: "C004", name: "اللغة الإنجليزية", grade: "جميع الصفوف" },
  { id: "C005", name: "الفيزياء", grade: "الثاني والثالث" },
];

const AttendanceManagement = () => {
  const [currentTab, setCurrentTab] = useState("attendance");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState(students);
  const [attendanceRecords, setAttendanceRecords] = useState<{ [key: string]: boolean }>({});
  const [grades, setGrades] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const [printMode, setPrintMode] = useState(false);
  const user = getCurrentUser();

  // Filter students based on search, class, and section
  useEffect(() => {
    let filtered = [...students];
    
    if (searchTerm) {
      filtered = filtered.filter(
        student => student.name.includes(searchTerm) || student.id.includes(searchTerm)
      );
    }
    
    if (selectedClass) {
      filtered = filtered.filter(student => student.grade === selectedClass);
    }
    
    if (selectedSection) {
      filtered = filtered.filter(student => student.section === selectedSection);
    }
    
    setFilteredStudents(filtered);
  }, [searchTerm, selectedClass, selectedSection]);

  if (!user || (user.role !== "admin" && user.role !== "teacher" && user.role !== "proctor")) {
    return <Navigate to="/login" />;
  }

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    setAttendanceRecords({
      ...attendanceRecords,
      [studentId]: isPresent
    });
  };

  const handleGradeChange = (studentId: string, grade: string) => {
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade) && numericGrade >= 0 && numericGrade <= 100) {
      setGrades({
        ...grades,
        [studentId]: numericGrade
      });
    }
  };

  const saveAttendance = () => {
    // In a real app, this would send data to an API
    toast({
      title: "تم حفظ سجل الحضور",
      description: `تم حفظ سجل الحضور ليوم ${attendanceDate}`,
    });
  };

  const saveGrades = () => {
    // In a real app, this would send data to an API
    toast({
      title: "تم حفظ الدرجات",
      description: `تم حفظ درجات ${Object.keys(grades).length} طالب`,
    });
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  return (
    <PageLayout title={currentTab === "attendance" ? "إدارة الحضور والغياب" : "إدارة الدرجات"}>
      <div className={printMode ? "print-mode" : ""}>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="attendance">سجل الحضور والغياب</TabsTrigger>
            <TabsTrigger value="grades">إدارة الدرجات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pr-10 w-full md:w-auto"
                    placeholder="البحث باسم الطالب أو الرقم"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر الصف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الصفوف</SelectItem>
                    <SelectItem value="الأول">الأول</SelectItem>
                    <SelectItem value="الثاني">الثاني</SelectItem>
                    <SelectItem value="الثالث">الثالث</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر الشعبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الشعب</SelectItem>
                    <SelectItem value="أ">أ</SelectItem>
                    <SelectItem value="ب">ب</SelectItem>
                    <SelectItem value="ج">ج</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">اختر المادة</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Calendar className="h-4 w-4" />
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full md:w-auto"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveAttendance}>حفظ السجل</Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="ml-2 h-4 w-4" />
                  طباعة
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader className="print-header">
                <CardTitle>سجل الحضور والغياب - {attendanceDate}</CardTitle>
                {selectedClass && (
                  <p className="text-muted-foreground">الصف: {selectedClass} {selectedSection && `- الشعبة: ${selectedSection}`}</p>
                )}
                {selectedCourse && (
                  <p className="text-muted-foreground">المادة: {courses.find(c => c.id === selectedCourse)?.name}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">رقم الطالب</TableHead>
                        <TableHead>اسم الطالب</TableHead>
                        <TableHead>الصف</TableHead>
                        <TableHead>الشعبة</TableHead>
                        <TableHead className="text-center">الحضور</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-2">
                                <Button 
                                  variant={attendanceRecords[student.id] === true ? "default" : "outline"} 
                                  size="sm"
                                  className="w-[60px]"
                                  onClick={() => handleAttendanceChange(student.id, true)}
                                >
                                  <Check className={`h-4 w-4 ${attendanceRecords[student.id] === true ? 'text-white' : 'text-green-500'}`} />
                                  <span className="mr-1">حاضر</span>
                                </Button>
                                <Button 
                                  variant={attendanceRecords[student.id] === false ? "destructive" : "outline"} 
                                  size="sm"
                                  className="w-[60px]"
                                  onClick={() => handleAttendanceChange(student.id, false)}
                                >
                                  <X className={`h-4 w-4 ${attendanceRecords[student.id] === false ? 'text-white' : 'text-red-500'}`} />
                                  <span className="mr-1">غائب</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            لا يوجد طلاب
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="grades" className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pr-10 w-full md:w-auto"
                    placeholder="البحث باسم الطالب أو الرقم"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر الصف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الصفوف</SelectItem>
                    <SelectItem value="الأول">الأول</SelectItem>
                    <SelectItem value="الثاني">الثاني</SelectItem>
                    <SelectItem value="الثالث">الثالث</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر الشعبة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الشعب</SelectItem>
                    <SelectItem value="أ">أ</SelectItem>
                    <SelectItem value="ب">ب</SelectItem>
                    <SelectItem value="ج">ج</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">اختر المادة</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={saveGrades}>حفظ الدرجات</Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="ml-2 h-4 w-4" />
                  طباعة
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader className="print-header">
                <CardTitle>سجل الدرجات</CardTitle>
                {selectedClass && (
                  <p className="text-muted-foreground">الصف: {selectedClass} {selectedSection && `- الشعبة: ${selectedSection}`}</p>
                )}
                {selectedCourse && (
                  <p className="text-muted-foreground">المادة: {courses.find(c => c.id === selectedCourse)?.name}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">رقم الطالب</TableHead>
                        <TableHead>اسم الطالب</TableHead>
                        <TableHead>الصف</TableHead>
                        <TableHead>الشعبة</TableHead>
                        <TableHead className="text-center">الدرجة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.grade}</TableCell>
                            <TableCell>{student.section}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  className="w-20 text-center"
                                  value={grades[student.id] || ""}
                                  onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                  placeholder="0-100"
                                />
                                <span className="mr-2 my-auto">/100</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            لا يوجد طلاب
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Print styles - fixed to work with TypeScript */}
      <style>
        {`
        @media print {
          .print-mode nav,
          .print-mode header,
          .print-mode button:not(.print-button),
          .print-mode input[type="search"],
          .print-mode [role="tablist"] {
            display: none !important;
          }
          
          .print-mode main {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-mode .card {
            box-shadow: none !important;
            border: 1px solid #eee !important;
          }
          
          .print-header {
            text-align: center !important;
            border-bottom: 1px solid #eee !important;
            margin-bottom: 1rem !important;
          }
        }
        `}
      </style>
    </PageLayout>
  );
};

export default AttendanceManagement;
