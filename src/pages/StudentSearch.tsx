
import PageLayout from "@/components/Layout/PageLayout";
import StudentFinder from "@/components/ExamHall/StudentFinder";

const StudentSearch = () => {
  return (
    <PageLayout title="البحث عن مكان جلوس الطالب">
      <div className="max-w-3xl mx-auto">
        <StudentFinder />
      </div>
    </PageLayout>
  );
};

export default StudentSearch;
