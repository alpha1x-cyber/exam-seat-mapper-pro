
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import RoomVisualizer from "@/components/ExamHall/RoomVisualizer";
import ProctorAssignment from "@/components/ExamHall/ProctorAssignment";
import StudentFinder from "@/components/ExamHall/StudentFinder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HallManagement = () => {
  const [activeTab, setActiveTab] = useState("seat-map");

  return (
    <PageLayout title="إدارة القاعات">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="seat-map">خريطة المقاعد</TabsTrigger>
          <TabsTrigger value="proctors">توزيع المراقبين</TabsTrigger>
          <TabsTrigger value="student-finder">البحث عن طالب</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seat-map" className="space-y-6">
          <RoomVisualizer rows={6} cols={8} />
        </TabsContent>
        
        <TabsContent value="proctors">
          <ProctorAssignment />
        </TabsContent>
        
        <TabsContent value="student-finder">
          <StudentFinder />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default HallManagement;
