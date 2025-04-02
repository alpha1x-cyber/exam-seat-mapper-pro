
import PageLayout from "@/components/Layout/PageLayout";
import RoomVisualizer from "@/components/ExamHall/RoomVisualizer";
import ProctorAssignment from "@/components/ExamHall/ProctorAssignment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HallManagement = () => {
  return (
    <PageLayout title="إدارة القاعات">
      <Tabs defaultValue="seat-map" className="space-y-6">
        <TabsList>
          <TabsTrigger value="seat-map">خريطة المقاعد</TabsTrigger>
          <TabsTrigger value="proctors">توزيع المراقبين</TabsTrigger>
        </TabsList>
        
        <TabsContent value="seat-map" className="space-y-6">
          <RoomVisualizer rows={6} cols={8} />
        </TabsContent>
        
        <TabsContent value="proctors">
          <ProctorAssignment />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default HallManagement;
