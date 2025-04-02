
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
import { PlusCircle, Pencil, Trash2, Search, UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  name: string;
  grade: string;
  section: string;
  hallId?: string;
  seatNumber?: string;
}

// Demo data for students
const initialStudents: Student[] = [
  { id: "ST1001", name: "أحمد محمد", grade: "الثالث", section: "أ" },
  { id: "ST1002", name: "فاطمة عبدالله", grade: "الثالث", section: "ب" },
  { id: "ST1003", name: "محمد علي", grade: "الثاني", section: "أ" },
  { id: "ST1004", name: "نور حسين", grade: "الأول", section: "ج" },
  { id: "ST1005", name: "عمر خالد", grade: "الثالث", section: "أ" },
];

const StudentManagement = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Omit<Student, "id">>({
    name: "",
    grade: "",
    section: "",
  });
  
  const { toast } = useToast();

  const handleSearch = () => {
    const filtered = students.filter(
      (student) =>
        student.name.includes(searchTerm) ||
        student.id.includes(searchTerm)
    );
    setFilteredStudents(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredStudents(students);
  };

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.grade || !newStudent.section) {
      toast({
        title: "خطأ",
        description: "الرجاء تعبئة جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const newId = `ST${1000 + students.length + 1}`;
    const studentToAdd = { id: newId, ...newStudent };
    
    setStudents([...students, studentToAdd]);
    setFilteredStudents([...students, studentToAdd]);
    
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة الطالب ${newStudent.name} بنجاح`,
    });
    
    setNewStudent({ name: "", grade: "", section: "" });
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = () => {
    if (!currentStudent) return;
    
    const updatedStudents = students.map((student) =>
      student.id === currentStudent.id ? currentStudent : student
    );
    
    setStudents(updatedStudents);
    setFilteredStudents(
      filteredStudents.map((student) =>
        student.id === currentStudent.id ? currentStudent : student
      )
    );
    
    toast({
      title: "تم التعديل بنجاح",
      description: `تم تعديل بيانات الطالب ${currentStudent.name} بنجاح`,
    });
    
    setCurrentStudent(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الطالب؟")) {
      const studentToDelete = students.find((s) => s.id === id);
      const updatedStudents = students.filter((student) => student.id !== id);
      setStudents(updatedStudents);
      setFilteredStudents(filteredStudents.filter((student) => student.id !== id));
      
      toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف الطالب ${studentToDelete?.name} بنجاح`,
      });
    }
  };

  const handleAssignBulkStudents = () => {
    toast({
      title: "تنبيه",
      description: "هذه الميزة ستكون متاحة قريباً",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلاب</h2>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة طالب
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طالب جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name">اسم الطالب</label>
                  <Input
                    id="name"
                    value={newStudent.name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="grade">الصف</label>
                  <Select
                    onValueChange={(value) =>
                      setNewStudent({ ...newStudent, grade: value })
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
                  <label htmlFor="section">الشعبة</label>
                  <Select
                    onValueChange={(value) =>
                      setNewStudent({ ...newStudent, section: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الشعبة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="أ">أ</SelectItem>
                      <SelectItem value="ب">ب</SelectItem>
                      <SelectItem value="ج">ج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddStudent} className="w-full mt-4">
                  إضافة
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleAssignBulkStudents}>
            <UserPlus className="ml-2 h-4 w-4" />
            توزيع دفعة طلاب
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pr-10"
            placeholder="البحث بالاسم أو رقم الطالب"
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
              <TableHead>رقم الطالب</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الصف</TableHead>
              <TableHead>الشعبة</TableHead>
              <TableHead>القاعة</TableHead>
              <TableHead>رقم المقعد</TableHead>
              <TableHead>الإجراءات</TableHead>
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
                  <TableCell>{student.hallId || "غير محدد"}</TableCell>
                  <TableCell>{student.seatNumber || "غير محدد"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog
                        open={isEditDialogOpen && currentStudent?.id === student.id}
                        onOpenChange={(open) => {
                          setIsEditDialogOpen(open);
                          if (open) setCurrentStudent(student);
                          else setCurrentStudent(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>تعديل بيانات الطالب</DialogTitle>
                          </DialogHeader>
                          {currentStudent && (
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label htmlFor="edit-name">اسم الطالب</label>
                                <Input
                                  id="edit-name"
                                  value={currentStudent.name}
                                  onChange={(e) =>
                                    setCurrentStudent({
                                      ...currentStudent,
                                      name: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-grade">الصف</label>
                                <Select
                                  defaultValue={currentStudent.grade}
                                  onValueChange={(value) =>
                                    setCurrentStudent({
                                      ...currentStudent,
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
                                <label htmlFor="edit-section">الشعبة</label>
                                <Select
                                  defaultValue={currentStudent.section}
                                  onValueChange={(value) =>
                                    setCurrentStudent({
                                      ...currentStudent,
                                      section: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="اختر الشعبة" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="أ">أ</SelectItem>
                                    <SelectItem value="ب">ب</SelectItem>
                                    <SelectItem value="ج">ج</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={handleEditStudent}
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
                        onClick={() => handleDeleteStudent(student.id)}
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

export default StudentManagement;
