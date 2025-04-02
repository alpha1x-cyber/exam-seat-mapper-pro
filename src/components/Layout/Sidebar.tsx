
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isRTL = document.documentElement.dir === "rtl";
  
  const menuItems = [
    { name: "الرئيسية", icon: <HomeIcon size={20} />, path: "/" },
    { name: "الطلاب", icon: <Users size={20} />, path: "/students" },
    { name: "القاعات", icon: <MapPin size={20} />, path: "/halls" },
    { name: "الامتحانات", icon: <CalendarDays size={20} />, path: "/exams" },
    { name: "المراقبين", icon: <ClipboardList size={20} />, path: "/proctors" },
    { name: "الإعدادات", icon: <Settings size={20} />, path: "/settings" },
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
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <Link to="/logout" className="sidebar-item">
          <LogOut size={20} />
          {!collapsed && <span>تسجيل الخروج</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
