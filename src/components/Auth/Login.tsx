
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Lock, User } from "lucide-react";
import { loginUser, UserRole } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onSuccess?: () => void;
  allowedRoles?: UserRole[];
}

const Login = ({ onSuccess, allowedRoles }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const user = loginUser(username, password);
      
      if (user) {
        // If there are allowed roles and the user doesn't have one of them
        if (allowedRoles && !allowedRoles.includes(user.role)) {
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحية للوصول إلى هذه الصفحة",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً بك ${user.name}`,
        });

        // Set admin status if the user is an admin
        if (user.role === "admin") {
          localStorage.setItem("isAdmin", "true");
        }

        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect based on role
          switch (user.role) {
            case "admin":
              navigate("/admin");
              break;
            case "teacher":
            case "proctor":
              navigate("/exams");
              break;
            case "student":
              navigate("/students");
              break;
            default:
              navigate("/");
          }
        }
      } else {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم أو كلمة المرور غير صحيحة",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pr-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              required
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              className="pr-10"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>
        
        <div className="text-sm text-center text-gray-500 mt-4">
          <p>اسم المستخدم للطالب: student1, للمعلم: teacher, للمراقب: proctor, للمدير: admin</p>
          <p>كلمة المرور: أي كلمة مرور (للتجربة فقط)</p>
        </div>
      </form>
    </div>
  );
};

export default Login;
