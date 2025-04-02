
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw } from "lucide-react";

interface Proctor {
  id: string;
  name: string;
  department: string;
  assigned: boolean;
  hallId?: string;
  hallName?: string;
}

interface Hall {
  id: string;
  name: string;
  capacity: number;
  examDate: string;
  examTime: string;
  proctorsNeeded: number;
  proctorsAssigned: number;
}

// Demo data
const demoProctors: Proctor[] = [
  { id: "P001", name: "أ. محمد أحمد", department: "اللغة العربية", assigned: false },
  { id: "P002", name: "أ. خالد عبدالله", department: "الرياضيات", assigned: true, hallId: "H101", hallName: "قاعة 101" },
  { id: "P003", name: "أ. عمر علي", department: "العلوم", assigned: false },
  { id: "P004", name: "د. سارة محمد", department: "اللغة الإنجليزية", assigned: false },
  { id: "P005", name: "أ. هدى أحمد", department: "الدراسات الاجتماعية", assigned: true, hallId: "H102", hallName: "قاعة 102" },
  { id: "P006", name: "أ. نورة خالد", department: "التربية البدنية", assigned: false },
];

const demoHalls: Hall[] = [
  { id: "H101", name: "قاعة 101", capacity: 30, examDate: "2023-12-15", examTime: "09:00 ص", proctorsNeeded: 2, proctorsAssigned: 1 },
  { id: "H102", name: "قاعة 102", capacity: 25, examDate: "2023-12-15", examTime: "09:00 ص", proctorsNeeded: 2, proctorsAssigned: 1 },
  { id: "H103", name: "قاعة 103", capacity: 40, examDate: "2023-12-15", examTime: "11:00 ص", proctorsNeeded: 3, proctorsAssigned: 0 },
];

const ProctorAssignment = () => {
  const [proctors, setProctors] = useState<Proctor[]>(demoProctors);
  const [halls, setHalls] = useState<Hall[]>(demoHalls);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>("balanced");

  const autoAssign = () => {
    // Reset all assignments
    const updatedProctors = proctors.map(p => ({
      ...p,
      assigned: false,
      hallId: undefined,
      hallName: undefined
    }));
    
    const updatedHalls = halls.map(h => ({
      ...h,
      proctorsAssigned: 0
    }));
    
    // Sort halls by proctor needs
    const sortedHalls = [...updatedHalls].sort((a, b) => b.proctorsNeeded - a.proctorsNeeded);
    
    // Balanced algorithm (distribute evenly across departments)
    if (selectedAlgorithm === "balanced") {
      // Group proctors by department
      const deptProctors: Record<string, Proctor[]> = {};
      updatedProctors.forEach(p => {
        if (!deptProctors[p.department]) {
          deptProctors[p.department] = [];
        }
        deptProctors[p.department].push(p);
      });
      
      const departments = Object.keys(deptProctors);
      let deptIndex = 0;
      
      // Assign proctors from different departments to each hall
      for (const hall of sortedHalls) {
        for (let i = 0; i < hall.proctorsNeeded; i++) {
          // Try to find an unassigned proctor from current department
          let foundProctor = false;
          const startDeptIndex = deptIndex;
          
          do {
            const dept = departments[deptIndex];
            const availableProctors = deptProctors[dept]?.filter(p => !p.assigned) || [];
            
            if (availableProctors.length > 0) {
              const proctor = availableProctors[0];
              const proctorIndex = updatedProctors.findIndex(p => p.id === proctor.id);
              
              if (proctorIndex !== -1) {
                updatedProctors[proctorIndex].assigned = true;
                updatedProctors[proctorIndex].hallId = hall.id;
                updatedProctors[proctorIndex].hallName = hall.name;
                
                // Remove the assigned proctor from the department list
                deptProctors[dept] = deptProctors[dept].filter(p => p.id !== proctor.id);
                
                // Increment hall's assigned count
                const hallIndex = updatedHalls.findIndex(h => h.id === hall.id);
                if (hallIndex !== -1) {
                  updatedHalls[hallIndex].proctorsAssigned++;
                }
                
                foundProctor = true;
                break;
              }
            }
            
            // Move to next department
            deptIndex = (deptIndex + 1) % departments.length;
          } while (deptIndex !== startDeptIndex && !foundProctor);
          
          // If no proctor found, break out of the inner loop
          if (!foundProctor) {
            break;
          }
        }
      }
    } 
    // Random assignment algorithm
    else if (selectedAlgorithm === "random") {
      const availableProctors = [...updatedProctors].sort(() => Math.random() - 0.5);
      let proctorIndex = 0;
      
      for (const hall of sortedHalls) {
        for (let i = 0; i < hall.proctorsNeeded; i++) {
          if (proctorIndex < availableProctors.length) {
            const proctor = availableProctors[proctorIndex];
            const indexInMain = updatedProctors.findIndex(p => p.id === proctor.id);
            
            if (indexInMain !== -1) {
              updatedProctors[indexInMain].assigned = true;
              updatedProctors[indexInMain].hallId = hall.id;
              updatedProctors[indexInMain].hallName = hall.name;
              
              // Increment hall's assigned count
              const hallIndex = updatedHalls.findIndex(h => h.id === hall.id);
              if (hallIndex !== -1) {
                updatedHalls[hallIndex].proctorsAssigned++;
              }
              
              proctorIndex++;
            }
          } else {
            break;
          }
        }
      }
    }
    
    setProctors(updatedProctors);
    setHalls(updatedHalls);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">توزيع المراقبين</h3>
        <div className="flex items-center gap-2">
          <Select 
            value={selectedAlgorithm} 
            onValueChange={setSelectedAlgorithm}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="اختر الخوارزمية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="balanced">توزيع متوازن</SelectItem>
              <SelectItem value="random">توزيع عشوائي</SelectItem>
              <SelectItem value="experience">حسب الخبرة</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={autoAssign}>
            <RefreshCw className="h-4 w-4 mr-2" />
            توزيع تلقائي
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border bg-white shadow-sm p-4">
          <h4 className="text-sm font-medium mb-3">القاعات الامتحانية</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">رقم القاعة</TableHead>
                <TableHead>اسم القاعة</TableHead>
                <TableHead className="text-center">السعة</TableHead>
                <TableHead className="text-center">المراقبين المطلوبين</TableHead>
                <TableHead className="text-center">المراقبين المعينين</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {halls.map((hall) => (
                <TableRow key={hall.id}>
                  <TableCell className="font-medium">{hall.id}</TableCell>
                  <TableCell>{hall.name}</TableCell>
                  <TableCell className="text-center">{hall.capacity}</TableCell>
                  <TableCell className="text-center">{hall.proctorsNeeded}</TableCell>
                  <TableCell className="text-center">
                    <span className={hall.proctorsAssigned < hall.proctorsNeeded ? "text-red-500" : "text-green-600"}>
                      {hall.proctorsAssigned}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border bg-white shadow-sm p-4">
          <h4 className="text-sm font-medium mb-3">المراقبين</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">رقم المراقب</TableHead>
                <TableHead>الاسم</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>القاعة المعينة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proctors.map((proctor) => (
                <TableRow key={proctor.id}>
                  <TableCell className="font-medium">{proctor.id}</TableCell>
                  <TableCell>{proctor.name}</TableCell>
                  <TableCell>{proctor.department}</TableCell>
                  <TableCell>
                    {proctor.assigned ? (
                      <span className="text-green-600">{proctor.hallName}</span>
                    ) : (
                      <span className="text-gray-400">غير معين</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProctorAssignment;
