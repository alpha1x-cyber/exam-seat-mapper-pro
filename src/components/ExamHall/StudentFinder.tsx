
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Search, MapPin, Clock, Calendar } from "lucide-react";

interface Student {
  id: string;
  name: string;
  hallId: string;
  hallName: string;
  seat: string;
  examDate: string;
  examTime: string;
  duration: string;
  subject: string;
}

// Demo data
const demoStudents: Student[] = [
  { 
    id: "ST1001", 
    name: "أحمد محمد", 
    hallId: "H101", 
    hallName: "قاعة رقم 101", 
    seat: "A3",
    examDate: "2023-12-15",
    examTime: "09:00 ص",
    duration: "ساعتان",
    subject: "الرياضيات"
  },
  { 
    id: "ST1002", 
    name: "سارة أحمد", 
    hallId: "H102", 
    hallName: "قاعة رقم 102", 
    seat: "B5",
    examDate: "2023-12-15",
    examTime: "09:00 ص",
    duration: "ساعتان",
    subject: "اللغة العربية"
  },
  { 
    id: "ST1003", 
    name: "محمد علي", 
    hallId: "H101", 
    hallName: "قاعة رقم 101", 
    seat: "C2",
    examDate: "2023-12-15",
    examTime: "09:00 ص",
    duration: "ساعتان",
    subject: "العلوم"
  },
  { 
    id: "ST1004", 
    name: "فاطمة خالد", 
    hallId: "H103", 
    hallName: "قاعة رقم 103", 
    seat: "A1",
    examDate: "2023-12-16",
    examTime: "10:00 ص",
    duration: "ساعة ونصف",
    subject: "اللغة الإنجليزية"
  },
  { 
    id: "ST1005", 
    name: "عمر محمود", 
    hallId: "H102", 
    hallName: "قاعة رقم 102", 
    seat: "D4",
    examDate: "2023-12-16",
    examTime: "10:00 ص",
    duration: "ساعة ونصف",
    subject: "الفيزياء"
  },
];

const StudentFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = demoStudents.filter(
      student => 
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setHasSearched(true);
    
    if (results.length === 1) {
      setSelectedStudent(results[0]);
    } else {
      setSelectedStudent(null);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>البحث عن مكان الجلوس</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pr-10"
                  placeholder="أدخل اسم الطالب أو رقم الجلوس"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 ml-2" />
                بحث
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {hasSearched && searchResults.length > 0 && (
        <div className="col-span-1 md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>نتائج البحث</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {searchResults.map((student) => (
                  <div
                    key={student.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted border"
                    }`}
                    onClick={() => handleSelectStudent(student)}
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm opacity-80">{student.id}</div>
                    <div className="text-sm mt-1">
                      <Badge variant="outline">{student.subject}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedStudent && (
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>معلومات جلوس الطالب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground mb-4">رقم الطالب: {selectedStudent.id}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 ml-2 text-primary" />
                      <div>
                        <div className="font-medium">القاعة: {selectedStudent.hallName}</div>
                        <div className="text-sm text-muted-foreground">رقم المقعد: {selectedStudent.seat}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 ml-2 text-primary" />
                      <div>
                        <div className="font-medium">تاريخ الامتحان: {selectedStudent.examDate}</div>
                        <div className="text-sm text-muted-foreground">المادة: {selectedStudent.subject}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 ml-2 text-primary" />
                      <div>
                        <div className="font-medium">وقت الامتحان: {selectedStudent.examTime}</div>
                        <div className="text-sm text-muted-foreground">المدة: {selectedStudent.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="text-center mb-3 font-semibold">خريطة المقعد</div>
                  <AspectRatio ratio={4/3}>
                    <div className="bg-muted h-full w-full rounded-md flex items-center justify-center relative">
                      <div className="grid grid-cols-5 grid-rows-4 gap-2 p-4 w-full h-full">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const row = Math.floor(i / 5);
                          const col = i % 5;
                          const seatCode = `${String.fromCharCode(65 + row)}${col + 1}`;
                          const isSelected = seatCode === selectedStudent.seat;
                          
                          return (
                            <div 
                              key={i} 
                              className={`rounded-sm flex items-center justify-center text-xs ${
                                isSelected 
                                  ? 'bg-primary text-primary-foreground font-bold scale-110' 
                                  : 'bg-background border'
                              }`}
                            >
                              {seatCode}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </AspectRatio>
                  <div className="mt-3 text-sm text-center text-muted-foreground">
                    * هذه خريطة توضيحية فقط وقد لا تعكس الترتيب الفعلي للقاعة
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {hasSearched && searchResults.length === 0 && (
        <div className="col-span-1 md:col-span-3">
          <div className="text-center py-12 border rounded-md">
            <p className="text-gray-500">لم يتم العثور على نتائج للبحث</p>
            <p className="text-sm text-muted-foreground mt-2">يرجى التحقق من الاسم أو رقم الطالب والمحاولة مرة أخرى</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFinder;
