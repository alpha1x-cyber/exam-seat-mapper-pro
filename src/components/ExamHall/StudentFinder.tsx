
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Student {
  id: string;
  name: string;
  hallId: string;
  hallName: string;
  seat: string;
  examDate: string;
  examTime: string;
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
    examTime: "09:00 ص"
  },
  { 
    id: "ST1002", 
    name: "سارة أحمد", 
    hallId: "H102", 
    hallName: "قاعة رقم 102", 
    seat: "B5",
    examDate: "2023-12-15",
    examTime: "09:00 ص"
  },
  { 
    id: "ST1003", 
    name: "محمد علي", 
    hallId: "H101", 
    hallName: "قاعة رقم 101", 
    seat: "C2",
    examDate: "2023-12-15",
    examTime: "09:00 ص"
  },
];

const StudentFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = demoStudents.filter(
      student => 
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4">البحث عن مكان الجلوس</h3>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="أدخل اسم الطالب أو رقم الجلوس"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          بحث
        </Button>
      </div>
      
      {hasSearched && (
        <div>
          {searchResults.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">رقم الطالب</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الاسم</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">القاعة</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">المقعد</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">التاريخ</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الوقت</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {searchResults.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{student.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{student.name}</td>
                      <td className="px-4 py-3 text-sm">{student.hallName}</td>
                      <td className="px-4 py-3 text-sm">{student.seat}</td>
                      <td className="px-4 py-3 text-sm">{student.examDate}</td>
                      <td className="px-4 py-3 text-sm">{student.examTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md">
              <p className="text-gray-500">لم يتم العثور على نتائج للبحث</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentFinder;
