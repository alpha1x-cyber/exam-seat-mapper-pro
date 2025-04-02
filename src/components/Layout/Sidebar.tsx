
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  Users,
  MapPin,
  CalendarDays,
  Settings,
  ClipboardList,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasRole, getCurrentUser, logoutUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isRTL = document.documentElement.dir === "rtl";
  const { toast } = useToast();
  const user = getCurrentUser();
  
  useEffect(() => {
    // Check if admin is logged in
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, [location.pathname]); // Re-check when route changes
  
  const handleLogout = () => {
    logoutUser();
    toast({
      title: "تم تسجيل الخروج",
      description: "تم تسجيل خروجك بنجاح",
    });
    navigate("/login");
  };
  
  const menuItems = [
    { name: "الرئيسية", icon: <HomeIcon size={20} />, path: "/", roles: ["admin", "teacher", "proctor", "student"] },
    { name: "بيانات الطلاب", icon: <Users size={20} />, path: "/students", roles: ["admin", "teacher", "proctor", "student"] },
    { name: "القاعات", icon: <MapPin size={20} />, path: "/halls", roles: ["admin", "teacher", "proctor"] },
    { name: "الامتحانات", icon: <CalendarDays size={20} />, path: "/exams", roles: ["admin", "teacher", "proctor"] },
    { name: "المراقبين", icon: <ClipboardList size={20} />, path: "/proctors", roles: ["admin"] },
    { name: "إدارة الدرجات", icon: <GraduationCap size={20} />, path: "/grades", roles: ["admin", "teacher"] },
    { name: "الحضور والغياب", icon: <UserCheck size={20} />, path: "/attendance", roles: ["admin", "teacher", "proctor"] },
    { name: "لوحة المدير", icon: <ShieldCheck size={20} />, path: "/admin", roles: ["admin"] },
    { name: "الإعدادات", icon: <Settings size={20} />, path: "/settings", roles: ["admin", "teacher"] },
  ];

  return (
    <aside
      className={`h-screen bg-sidebar fixed top-0 ${isRTL ? 'right-0' : 'left-0'} transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } flex flex-col shadow-lg z-10`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-sidebar-foreground font-bold text-xl">خرائط الامتحانات</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />
          ) : (
            <Menu size={20} />
          )}
        </Button>
      </div>

      <nav className="flex-1 mt-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {user && (
            <li className="mb-4">
              <div className={`text-sidebar-foreground ${collapsed ? 'text-center' : 'px-3'}`}>
                {collapsed ? (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold">{user.name}</div>
                    <div className="text-xs opacity-70">
                      {user.role === "admin" 
                        ? "مدير"
                        : user.role === "teacher" 
                          ? "معلم" 
                          : user.role === "proctor" 
                            ? "مراقب" 
                            : "طالب"}
                    </div>
                  </>
                )}
              </div>
            </li>
          )}
          
          {menuItems.map((item) => {
            // Skip items that the current user doesn't have access to
            if (user && !item.roles.includes(user.role)) return null;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${
                    location.pathname === item.path ? "active" : ""
                  } flex items-center py-2 px-3 rounded-md hover:bg-sidebar-item-hover text-sidebar-foreground transition-colors`}
                >
                  {item.icon}
                  {!collapsed && <span className="mr-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          className="sidebar-item flex items-center w-full py-2 px-3 rounded-md hover:bg-sidebar-item-hover text-sidebar-foreground transition-colors"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="mr-3">تسجيل الخروج</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
