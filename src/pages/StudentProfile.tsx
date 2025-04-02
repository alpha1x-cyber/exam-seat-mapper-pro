
import { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, User } from "@/lib/auth";
import { Navigate, Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Book } from "lucide-react";

// Mock data
const mockAttendanceData = [
  { id: 1, date: "2023-12-01", status: "حاضر", subject: "الرياضيات" },
  { id: 2, date: "2023-12-03", status: "غائب", subject: "العلوم" },
  { id: 3, date: "2023-12-05", status: "حاضر", subject: "اللغة العربية" },
  { id: 4, date: "2023-12-07", status: "حاضر", subject: "اللغة الإنجليزية" },
  { id: 5, date: "2023-12-09", status: "غائب", subject: "الفيزياء" },
];

// Mock grades data
const mockGradesData = [
  { id: 1, subject: "الرياضيات", grade: 85, maxGrade: 100 },
  { id: 2, subject: "العلوم", grade: 70, maxGrade: 100 },
  { id: 3, subject: "اللغة العربية", grade: 90, maxGrade: 100 },
  { id: 4, subject: "اللغة الإنجليزية", grade: 75, maxGrade: 100 },
  { id: 5, subject: "الفيزياء", grade: 65, maxGrade: 100 },
];

// Mock exam hall data
const mockExamHallData = [
  { id: 1, subject: "الرياضيات", hall: "قاعة 101", seat: "A3", date: "2023-12-15", time: "09:00", duration: "ساعتان" },
  { id: 2, subject: "العلوم", hall: "قاعة 102", seat: "B2", date: "2023-12-18", time: "10:30", duration: "ساعة ونصف" },
  { id: 3, subject: "اللغة العربية", hall: "قاعة 101", seat: "A5", date: "2023-12-20", time: "09:00", duration: "ساعتان" },
  { id: 4, subject: "اللغة الإنجليزية", hall: "قاعة 103", seat: "C1", date: "2023-12-22", time: "11:00", duration: "ساعتان" },
  { id: 5, subject: "الفيزياء", hall: "قاعة 102", seat: "B4", date: "2023-12-25", time: "09:30", duration: "ساعتان" },
];

const StudentProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [gradesData, setGradesData] = useState(mockGradesData);
  const [examHallData, setExamHallData] = useState(mockExamHallData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
    
    // In a real app, we would fetch the student's data here
    // For now, we'll use mock data
  }, []);

  if (loading) {
    return (
      <PageLayout title="ملف الطالب">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (!user || user.role !== "student") {
    return <Navigate to="/login" />;
  }

  // Calculate attendance statistics
  const totalClasses = attendanceData.length;
  const attendedClasses = attendanceData.filter(a => a.status === "حاضر").length;
  const absentClasses = attendanceData.filter(a => a.status === "غائب").length;
  const attendancePercentage = Math.round((attendedClasses / totalClasses) * 100);

  // Calculate grade statistics
  const totalGradePoints = gradesData.reduce((sum, item) => sum + item.grade, 0);
  const totalMaxPoints = gradesData.reduce((sum, item) => sum + item.maxGrade, 0);
  const gradePercentage = Math.round((totalGradePoints / totalMaxPoints) * 100);

  // Get present and absent subjects
  const presentSubjects = attendanceData.filter(a => a.status === "حاضر").map(a => a.subject);
  const absentSubjects = attendanceData.filter(a => a.status === "غائب").map(a => a.subject);

  return (
    <PageLayout title="ملف الطالب">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>معلومات الطالب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">الاسم</h3>
                <p className="text-lg font-medium">{user.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">رقم الطالب</h3>
                <p className="text-lg font-medium">{user.id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">اسم المستخدم</h3>
                <p className="text-lg font-medium">{user.username}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الحضور</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">مجموع المواد</span>
                <span className="font-medium">{totalClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المواد المحضورة</span>
                <span className="font-medium text-green-600">{attendedClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المواد المتغيب عنها</span>
                <span className="font-medium text-red-600">{absentClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">نسبة الحضور</span>
                <Badge variant={attendancePercentage >= 75 ? "default" : "destructive"}>
                  {attendancePercentage}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الدرجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">عدد المواد</span>
                <span className="font-medium">{gradesData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">مجموع الدرجات</span>
                <span className="font-medium">{totalGradePoints}/{totalMaxPoints}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">النسبة المئوية</span>
                <Badge variant={gradePercentage >= 60 ? "default" : "destructive"}>
                  {gradePercentage}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next row with detailed attendance and grade information */}
      <div className="grid gap-6 mt-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>المواد المحضورة والمتغيب عنها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-2">المواد المحضورة ({presentSubjects.length})</h3>
                <ul className="space-y-2">
                  {presentSubjects.map((subject, index) => (
                    <li key={index} className="flex items-center gap-2 bg-green-50 p-2 rounded-md">
                      <Book className="h-4 w-4 text-green-600" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-red-600 mb-2">المواد المتغيب عنها ({absentSubjects.length})</h3>
                <ul className="space-y-2">
                  {absentSubjects.map((subject, index) => (
                    <li key={index} className="flex items-center gap-2 bg-red-50 p-2 rounded-md">
                      <Book className="h-4 w-4 text-red-600" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam Hall Information */}
      <div className="grid gap-6 mt-6 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>معلومات الامتحانات والقاعات</CardTitle>
            <Link to="/exams">
              <Button variant="outline" size="sm">
                جدول الامتحانات الكامل
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المادة</TableHead>
                    <TableHead>القاعة</TableHead>
                    <TableHead>المقعد</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>المدة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {examHallData.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.subject}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{exam.hall}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{exam.seat}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{exam.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{exam.time}</span>
                        </div>
                      </TableCell>
                      <TableCell>{exam.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>سجل الحضور</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>المادة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.subject}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "حاضر" ? "outline" : "destructive"}>
                          {record.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الدرجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المادة</TableHead>
                    <TableHead>الدرجة</TableHead>
                    <TableHead>النسبة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradesData.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell>{grade.grade}/{grade.maxGrade}</TableCell>
                      <TableCell>
                        <Badge variant={grade.grade / grade.maxGrade >= 0.6 ? "outline" : "destructive"}>
                          {Math.round((grade.grade / grade.maxGrade) * 100)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default StudentProfile;
