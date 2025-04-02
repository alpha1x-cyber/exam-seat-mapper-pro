
import { useState } from "react";
import PageLayout from "@/components/Layout/PageLayout";
import AttendanceSheet from "@/components/ExamHall/AttendanceSheet";
import ExamSchedule from "@/components/ExamHall/ExamSchedule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Download } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const ExamAttendance = () => {
  const [activeTab, setActiveTab] = useState("attendance");
  const [printMode, setPrintMode] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  const handleExport = () => {
    // In a real app, this would export data to a file
    alert("سيتم تنزيل البيانات كملف Excel");
  };

  return (
    <PageLayout title="إدارة الامتحانات">
      <div className={printMode ? "print-mode" : ""}>
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">إدارة الامتحانات</h2>
            <p className="text-muted-foreground">إدارة جداول وحضور الامتحانات</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="print-button">
              <Printer className="ml-2 h-4 w-4" />
              طباعة
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="ml-2 h-4 w-4" />
              تصدير
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="attendance">كشوف الحضور</TabsTrigger>
            <TabsTrigger value="schedule">جدول الامتحانات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="space-y-6">
            <Card className="print-card">
              <CardHeader className="print-header">
                <CardTitle>كشوف حضور الامتحانات</CardTitle>
                <p className="text-muted-foreground print-date">
                  تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
                </p>
              </CardHeader>
              <CardContent>
                <AttendanceSheet />
              </CardContent>
              <CardFooter className="print-footer">
                <div className="w-full flex justify-between items-center">
                  <div>
                    <p className="text-muted-foreground">اسم المراقب: {user.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">التوقيع: ________________</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule">
            <Card className="print-card">
              <CardHeader className="print-header">
                <CardTitle>جدول الامتحانات</CardTitle>
                <p className="text-muted-foreground print-date">
                  تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}
                </p>
              </CardHeader>
              <CardContent>
                <ExamSchedule />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Print styles - added to provide better print capability */}
      <style jsx global>{`
        @media print {
          .print-mode nav,
          .print-mode header,
          .print-mode button:not(.print-button),
          .print-mode [role="tablist"] {
            display: none !important;
          }
          
          .print-mode main {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-mode .print-card {
            box-shadow: none !important;
            border: 1px solid #eee !important;
          }
          
          .print-header {
            text-align: center !important;
            border-bottom: 1px solid #eee !important;
            margin-bottom: 1rem !important;
          }
          
          .print-date {
            text-align: left !important;
            margin-top: 0.5rem !important;
          }
          
          .print-footer {
            border-top: 1px solid #eee !important;
            margin-top: 1rem !important;
            padding-top: 1rem !important;
          }
        }
      `}</style>
    </PageLayout>
  );
};

export default ExamAttendance;
