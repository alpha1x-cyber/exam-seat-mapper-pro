
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle, Pencil, Trash2, Search, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: string;
  name: string;
  grade: string;
  examDate?: string;
  examTime?: string;
  duration?: number;
}

// Demo data for courses
const initialCourses: Course[] = [
  { id: "C101", name: "الرياضيات", grade: "الثالث", examDate: "2023-12-15", examTime: "09:00", duration: 120 },
  { id: "C102", name: "العلوم", grade: "الثالث", examDate: "2023-12-16", examTime: "09:00", duration: 120 },
  { id: "C103", name: "اللغة العربية", grade: "الثاني", examDate: "2023-12-17", examTime: "09:00", duration: 90 },
  { id: "C104", name: "اللغة الإنجليزية", grade: "الأول", examDate: "2023-12-18", examTime: "09:00", duration: 90 },
  { id: "C105", name: "التاريخ", grade: "الثالث", examDate: "2023-12-19", examTime: "09:00", duration: 60 },
];

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    name: "",
    grade: "",
    examDate: "",
    examTime: "",
    duration: 90,
  });
  
  const { toast } = useToast();

  const handleSearch = () => {
    const filtered = courses.filter(
      (course) =>
        course.name.includes(searchTerm) ||
        course.id.includes(searchTerm)
    );
    setFilteredCourses(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredCourses(courses);
  };

  const handleAddCourse = () => {
    if (!newCourse.name || !newCourse.grade) {
      toast({
        title: "خطأ",
        description: "الرجاء تعبئة اسم المادة والصف الدراسي على الأقل",
        variant: "destructive",
      });
      return;
    }

    const newId = `C${100 + courses.length + 1}`;
    const courseToAdd = { id: newId, ...newCourse };
    
    setCourses([...courses, courseToAdd]);
    setFilteredCourses([...courses, courseToAdd]);
    
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة المادة ${newCourse.name} بنجاح`,
    });
    
    setNewCourse({ name: "", grade: "", examDate: "", examTime: "", duration: 90 });
    setIsAddDialogOpen(false);
  };

  const handleEditCourse = () => {
    if (!currentCourse) return;
    
    const updatedCourses = courses.map((course) =>
      course.id === currentCourse.id ? currentCourse : course
    );
    
    setCourses(updatedCourses);
    setFilteredCourses(
      filteredCourses.map((course) =>
        course.id === currentCourse.id ? currentCourse : course
      )
    );
    
    toast({
      title: "تم التعديل بنجاح",
      description: `تم تعديل بيانات المادة ${currentCourse.name} بنجاح`,
    });
    
    setCurrentCourse(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه المادة؟")) {
      const courseToDelete = courses.find((c) => c.id === id);
      const updatedCourses = courses.filter((course) => course.id !== id);
      setCourses(updatedCourses);
      setFilteredCourses(filteredCourses.filter((course) => course.id !== id));
      
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف المادة ${courseToDelete?.name} بنجاح`,
      });
    }
  };

  const handleGenerateExamSchedule = () => {
    toast({
      title: "تنبيه",
      description: "سيتم قريباً إضافة ميزة تنظيم جدول الامتحانات تلقائياً",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المواد الدراسية</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة مادة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مادة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name">اسم المادة</label>
                  <Input
                    id="name"
                    value={newCourse.name}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="grade">الصف</label>
                  <Select
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, grade: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الأول">الأول</SelectItem>
                      <SelectItem value="الثاني">الثاني</SelectItem>
                      <SelectItem value="الثالث">الثالث</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="examDate">تاريخ الامتحان</label>
                  <Input
                    id="examDate"
                    type="date"
                    value={newCourse.examDate}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, examDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="examTime">وقت الامتحان</label>
                  <Input
                    id="examTime"
                    type="time"
                    value={newCourse.examTime}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, examTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="duration">مدة الامتحان (بالدقائق)</label>
                  <Input
                    id="duration"
                    type="number"
                    min="30"
                    max="180"
                    value={newCourse.duration}
                    onChange={(e) =>
                      setNewCourse({ ...newCourse, duration: parseInt(e.target.value) })
                    }
                  />
                </div>
                <Button onClick={handleAddCourse} className="w-full mt-4">
                  إضافة
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleGenerateExamSchedule}>
            <Calendar className="ml-2 h-4 w-4" />
            جدولة الامتحانات
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pr-10"
            placeholder="البحث باسم المادة أو الرمز"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch}>بحث</Button>
        {searchTerm && (
          <Button variant="outline" onClick={resetSearch}>
            إعادة ضبط
          </Button>
        )}
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>رمز المادة</TableHead>
              <TableHead>اسم المادة</TableHead>
              <TableHead>الصف</TableHead>
              <TableHead>تاريخ الامتحان</TableHead>
              <TableHead>وقت الامتحان</TableHead>
              <TableHead>المدة (دقيقة)</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>{course.grade}</TableCell>
                  <TableCell>{course.examDate || "غير محدد"}</TableCell>
                  <TableCell>{course.examTime || "غير محدد"}</TableCell>
                  <TableCell>{course.duration || "غير محدد"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentCourse?.id === course.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (open) setCurrentCourse(course);
                          else setCurrentCourse(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تعديل بيانات المادة</DialogTitle>
                          </DialogHeader>
                          {currentCourse && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label htmlFor="edit-name">اسم المادة</label>
                                <Input
                                  id="edit-name"
                                  value={currentCourse.name}
                                  onChange={(e) =>
                                    setCurrentCourse({
                                      ...currentCourse,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-grade">الصف</label>
                                <Select
                                  defaultValue={currentCourse.grade}
                                  onValueChange={(value) =>
                                    setCurrentCourse({
                                      ...currentCourse,
                                      grade: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الصف" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="الأول">الأول</SelectItem>
                                    <SelectItem value="الثاني">الثاني</SelectItem>
                                    <SelectItem value="الثالث">الثالث</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-examDate">تاريخ الامتحان</label>
                                <Input
                                  id="edit-examDate"
                                  type="date"
                                  value={currentCourse.examDate}
                                  onChange={(e) =>
                                    setCurrentCourse({
                                      ...currentCourse,
                                      examDate: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-examTime">وقت الامتحان</label>
                                <Input
                                  id="edit-examTime"
                                  type="time"
                                  value={currentCourse.examTime}
                                  onChange={(e) =>
                                    setCurrentCourse({
                                      ...currentCourse,
                                      examTime: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-duration">مدة الامتحان (بالدقائق)</label>
                                <Input
                                  id="edit-duration"
                                  type="number"
                                  min="30"
                                  max="180"
                                  value={currentCourse.duration}
                                  onChange={(e) =>
                                    setCurrentCourse({
                                      ...currentCourse,
                                      duration: parseInt(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <Button
                                onClick={handleEditCourse}
                                className="w-full mt-4"
                              >
                                حفظ التعديلات
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  لا توجد نتائج
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseManagement;
