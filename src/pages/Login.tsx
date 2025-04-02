
import Login from "@/components/Auth/Login";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";

const LoginPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const user = getCurrentUser();
    setIsAuthenticated(!!user);
  }, []);
  
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center min-h-screen">جاري التحميل...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">نظام إدارة الامتحانات</h1>
          <p className="text-muted-foreground">سجل دخولك للاستمرار</p>
        </div>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
