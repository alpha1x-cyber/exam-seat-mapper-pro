
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HallManagement from "./pages/HallManagement";
import ExamAttendance from "./pages/ExamAttendance";
import StudentSearch from "./pages/StudentSearch";
import StudentProfile from "./pages/StudentProfile";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AttendanceManagement from "./pages/AttendanceManagement";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./lib/auth";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [] 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) => {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => {
  // Set the direction for RTL support
  document.documentElement.dir = "rtl";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/halls" element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "proctor"]}>
                <HallManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/exams" element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "proctor"]}>
                <ExamAttendance />
              </ProtectedRoute>
            } />
            
            <Route path="/students" element={
              <ProtectedRoute>
                <StudentSearch />
              </ProtectedRoute>
            } />
            
            <Route path="/student-profile" element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/attendance" element={
              <ProtectedRoute allowedRoles={["admin", "teacher", "proctor"]}>
                <AttendanceManagement />
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
