import { getIncomeByMonth } from "@/api/server/sale";
import { CustomCalendar } from "@/components/CustomCalendar";
import Header from "@/components/Header";

export default async function Home() {
  const monthlyIncome = await getIncomeByMonth(new Date());

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      {/* header */}
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center gap-y-8">
        {/* calendar */}
        <div className="flex-1 flex items-center justify-center w-full h-80 max-w-[520px]">
          <CustomCalendar />
        </div>

        {/* total income */}
        <div className="mb-20 font-bold text-sm">
          Expected income:{" "}
          <span className="text-emerald-500">{monthlyIncome} Baht</span>
        </div>
      </div>
    </div>
  );
}
