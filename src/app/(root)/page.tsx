import { getIncomeByMonth } from "@/api/server/sale";
import { CustomCalendar } from "@/components/CustomCalendar";
import Header from "@/components/Header";

export default async function Home() {
  const monthlyIncome = await getIncomeByMonth(new Date());

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      {/* header */}
      <Header />

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* calendar */}
        <div className="flex-1 flex items-center justify-center w-[80%]">
          <CustomCalendar />
        </div>

        {/* total income */}
        <div className="mb-20 font-bold text-lg">
          Expected income:{" "}
          <span className="text-emerald-500">{monthlyIncome} Baht</span>
        </div>
      </div>
    </div>
  );
}
