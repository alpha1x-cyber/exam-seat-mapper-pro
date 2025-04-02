
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import AttendanceSheet from "@/components/ExamHall/AttendanceSheet";
import ExamSchedule from "@/components/ExamHall/ExamSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExamAttendance = () => {
  const [activeTab, setActiveTab] = useState("attendance");

  return (
    <PageLayout title="إدارة الامتحانات">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="attendance">كشوف الحضور</TabsTrigger>
          <TabsTrigger value="schedule">جدول الامتحانات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-6">
          <AttendanceSheet />
        </TabsContent>
        
        <TabsContent value="schedule">
          <ExamSchedule />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ExamAttendance;
