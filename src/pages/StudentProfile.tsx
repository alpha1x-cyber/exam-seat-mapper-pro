
import { useEffect, useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, User } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

const StudentProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [attendanceData, setAttendanceData] = useState(mockAttendanceData);
  const [gradesData, setGradesData] = useState(mockGradesData);
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
  const attendancePercentage = Math.round((attendedClasses / totalClasses) * 100);

  // Calculate grade statistics
  const totalGradePoints = gradesData.reduce((sum, item) => sum + item.grade, 0);
  const totalMaxPoints = gradesData.reduce((sum, item) => sum + item.maxGrade, 0);
  const gradePercentage = Math.round((totalGradePoints / totalMaxPoints) * 100);

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
                <span className="text-muted-foreground">مجموع الأيام</span>
                <span className="font-medium">{totalClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">أيام الحضور</span>
                <span className="font-medium text-green-600">{attendedClasses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">أيام الغياب</span>
                <span className="font-medium text-red-600">{totalClasses - attendedClasses}</span>
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
