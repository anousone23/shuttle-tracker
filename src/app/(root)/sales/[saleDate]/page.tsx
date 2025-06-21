import { getGroupSalesByDate } from "@/api/server/sale";
import Header from "@/components/Header";
import SaleItem from "@/components/SaleItem";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

export default async function SaleDetailsPage({
  params,
}: {
  params: Promise<{ saleDate: string }>;
}) {
  const { saleDate } = await params;
  const decoded = decodeURIComponent(saleDate);
  const date = format(new Date(decoded), "dd / MM / yyy");

  const sales = await getGroupSalesByDate(saleDate);

  const totalAmount = sales.reduce((acc, sale) => {
    let price = 0;

    price += sale.priceToPay || 0;

    return acc + price;
  }, 0);

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      <Header />

      {/* summary */}
      <div className="flex flex-col gap-y-4">
        <p className="font-medium">
          Date:
          <span className="text-emerald-500 font-bold"> {date}</span>
        </p>
        <p className="font-medium">
          Buyers:{" "}
          <span className="text-emerald-500 font-bold">{sales.length}</span>
        </p>
        <p className="font-medium">
          Income:{" "}
          <span className="text-emerald-500 font-bold">{totalAmount} Baht</span>
        </p>
      </div>

      {/* sale list */}
      <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
        {sales.length > 0 ? (
          sales.map((sale) => <SaleItem key={sale.saleId} sale={sale} />)
        ) : (
          <div className="flex-1 flex items-center justify-center">
            No sales today
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <Button asChild>
          <Link href="/sales/add">Sell</Link>
        </Button>
      </div>
    </div>
  );
}
