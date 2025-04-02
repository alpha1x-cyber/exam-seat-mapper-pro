
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import PageLayout from "@/components/Layout/PageLayout";
import AdminLogin from "@/components/Admin/AdminLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentManagement from "@/components/Admin/StudentManagement";
import CourseManagement from "@/components/Admin/CourseManagement";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if admin is logged in
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك من لوحة التحكم بنجاح",
    });
  };

  if (isLoading) {
    return (
      <PageLayout title="لوحة تحكم المدير">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="لوحة تحكم المدير">
      {isAdmin ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">مرحباً بك في لوحة تحكم المدير</h1>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="ml-2 h-4 w-4" />
              تسجيل الخروج
            </Button>
          </div>
          
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">إدارة الطلاب</TabsTrigger>
              <TabsTrigger value="courses">إدارة المواد</TabsTrigger>
            </TabsList>
            
            <TabsContent value="students">
              <StudentManagement />
            </TabsContent>
            
            <TabsContent value="courses">
              <CourseManagement />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </PageLayout>
  );
};

export default AdminPanel;
