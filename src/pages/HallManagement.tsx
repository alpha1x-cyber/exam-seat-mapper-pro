
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import RoomVisualizer from "@/components/ExamHall/RoomVisualizer";
import ProctorAssignment from "@/components/ExamHall/ProctorAssignment";
import StudentFinder from "@/components/ExamHall/StudentFinder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Save, RefreshCw } from "lucide-react";

// Demo data for halls
const initialHalls = [
  { id: "H101", name: "قاعة 101", capacity: 48, rows: 6, cols: 8 },
  { id: "H102", name: "قاعة 102", capacity: 36, rows: 6, cols: 6 },
  { id: "H103", name: "قاعة 103", capacity: 24, rows: 4, cols: 6 },
  { id: "H104", name: "قاعة 104", capacity: 32, rows: 4, cols: 8 },
];

const HallManagement = () => {
  const [activeTab, setActiveTab] = useState("seat-map");
  const [halls, setHalls] = useState(initialHalls);
  const [selectedHall, setSelectedHall] = useState(halls[0]);
  const [newHall, setNewHall] = useState({ name: "", rows: 6, cols: 8 });
  const [showAddHall, setShowAddHall] = useState(false);
  const { toast } = useToast();

  const handleHallSelect = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    if (hall) {
      setSelectedHall(hall);
    }
  };

  const handleAddHall = () => {
    if (!newHall.name) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم القاعة",
        variant: "destructive"
      });
      return;
    }

    const newId = `H${100 + halls.length + 1}`;
    const hallToAdd = {
      id: newId,
      name: newHall.name,
      capacity: newHall.rows * newHall.cols,
      rows: newHall.rows,
      cols: newHall.cols
    };

    setHalls([...halls, hallToAdd]);
    setNewHall({ name: "", rows: 6, cols: 8 });
    setShowAddHall(false);
    
    toast({
      title: "تمت الإضافة",
      description: `تمت إضافة القاعة ${newHall.name} بنجاح`
    });
  };

  const handleUpdateHall = () => {
    const updatedHalls = halls.map(hall => 
      hall.id === selectedHall.id ? selectedHall : hall
    );
    
    setHalls(updatedHalls);
    
    toast({
      title: "تم التحديث",
      description: `تم تحديث بيانات القاعة ${selectedHall.name} بنجاح`
    });
  };

  return (
    <PageLayout title="إدارة القاعات">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="seat-map">خريطة المقاعد</TabsTrigger>
          <TabsTrigger value="proctors">توزيع المراقبين</TabsTrigger>
          <TabsTrigger value="student-finder">البحث عن طالب</TabsTrigger>
          <TabsTrigger value="hall-management">إدارة القاعات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seat-map" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-64">
              <Label htmlFor="hall-select">اختر القاعة</Label>
              <Select 
                value={selectedHall.id} 
                onValueChange={handleHallSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر القاعة" />
                </SelectTrigger>
                <SelectContent>
                  {halls.map(hall => (
                    <SelectItem key={hall.id} value={hall.id}>
                      {hall.name} (السعة: {hall.capacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto md:self-end">
              <Button variant="outline" onClick={() => setShowAddHall(!showAddHall)}>
                <Plus className="ml-2 h-4 w-4" />
                {showAddHall ? "إلغاء" : "إضافة قاعة جديدة"}
              </Button>
            </div>
          </div>
          
          {showAddHall && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>إضافة قاعة جديدة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hall-name">اسم القاعة</Label>
                    <Input
                      id="hall-name"
                      value={newHall.name}
                      onChange={e => setNewHall({...newHall, name: e.target.value})}
                      placeholder="مثال: قاعة 105"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hall-rows">عدد الصفوف</Label>
                    <Input
                      id="hall-rows"
                      type="number"
                      min={1}
                      max={10}
                      value={newHall.rows}
                      onChange={e => setNewHall({...newHall, rows: parseInt(e.target.value) || 1})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hall-cols">عدد الأعمدة</Label>
                    <Input
                      id="hall-cols"
                      type="number"
                      min={1}
                      max={12}
                      value={newHall.cols}
                      onChange={e => setNewHall({...newHall, cols: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
                <Button className="mt-4" onClick={handleAddHall}>
                  إضافة القاعة
                </Button>
              </CardContent>
            </Card>
          )}
          
          <RoomVisualizer 
            rows={selectedHall?.rows || 6} 
            cols={selectedHall?.cols || 8} 
            hallName={selectedHall?.name || "القاعة"} 
          />
        </TabsContent>
        
        <TabsContent value="proctors">
          <ProctorAssignment />
        </TabsContent>
        
        <TabsContent value="student-finder">
          <StudentFinder />
        </TabsContent>
        
        <TabsContent value="hall-management">
          <Card>
            <CardHeader>
              <CardTitle>إدارة القاعات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {halls.map(hall => (
                    <Card key={hall.id} className={`${selectedHall?.id === hall.id ? 'border-primary' : ''}`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{hall.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label className="text-muted-foreground">رقم القاعة:</Label>
                            <div>{hall.id}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">السعة:</Label>
                            <div>{hall.capacity} مقعد</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">عدد الصفوف:</Label>
                            <div>{hall.rows}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">عدد الأعمدة:</Label>
                            <div>{hall.cols}</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedHall(hall);
                            setActiveTab("seat-map");
                          }}
                        >
                          عرض خريطة المقاعد
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default HallManagement;
