
import { Users, School, Calendar, ClipboardCheck, MapPin } from "lucide-react";
import PageLayout from "@/components/Layout/PageLayout";
import StatCard from "@/components/Dashboard/StatCard";
import RoomVisualizer from "@/components/ExamHall/RoomVisualizer";
import StudentFinder from "@/components/ExamHall/StudentFinder";

const Dashboard = () => {
  return (
    <PageLayout title="لوحة التحكم">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="إجمالي الطلاب"
          value="1,250"
          icon={<Users size={24} />}
          trend={5}
        />
        <StatCard
          title="إجمالي القاعات"
          value="15"
          icon={<School size={24} />}
          trend={0}
        />
        <StatCard
          title="الامتحانات النشطة"
          value="3"
          icon={<Calendar size={24} />}
          trend={10}
        />
        <StatCard
          title="المراقبين"
          value="22"
          icon={<ClipboardCheck size={24} />}
          trend={-2}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2">
          <RoomVisualizer rows={5} cols={6} />
        </div>
        <div>
          <StudentFinder />
        </div>
      </div>

      <div className="mb-6">
        <div className="rounded-lg border bg-white shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">الامتحانات القادمة</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">المادة</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">التاريخ</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الوقت</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">القاعات</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">عدد الطلاب</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">اللغة العربية</td>
                  <td className="px-4 py-3 text-sm">15 ديسمبر 2023</td>
                  <td className="px-4 py-3 text-sm">09:00 ص</td>
                  <td className="px-4 py-3 text-sm">4 قاعات</td>
                  <td className="px-4 py-3 text-sm">120 طالب</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">قيد التجهيز</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">الرياضيات</td>
                  <td className="px-4 py-3 text-sm">16 ديسمبر 2023</td>
                  <td className="px-4 py-3 text-sm">11:00 ص</td>
                  <td className="px-4 py-3 text-sm">5 قاعات</td>
                  <td className="px-4 py-3 text-sm">150 طالب</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">جاهز</span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">العلوم</td>
                  <td className="px-4 py-3 text-sm">17 ديسمبر 2023</td>
                  <td className="px-4 py-3 text-sm">09:00 ص</td>
                  <td className="px-4 py-3 text-sm">3 قاعات</td>
                  <td className="px-4 py-3 text-sm">90 طالب</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">قيد الإعداد</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
