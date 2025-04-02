
import { redirect } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Redirect to the dashboard
    window.location.href = "/";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">جاري التحميل...</h1>
        <p className="text-xl text-gray-600">سيتم توجيهك إلى لوحة التحكم</p>
      </div>
    </div>
  );
};

export default Index;
