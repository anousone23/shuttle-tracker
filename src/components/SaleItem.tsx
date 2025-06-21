import { GroupSale } from "@/api/server/sale";
import MarkAsPaidButton from "./MarkAsPaidButton";

export default function SaleItem({ sale }: { sale: GroupSale }) {
  return (
    <div className="bg-secondary-bg border border-border rounded-sm shadow-sm px-4 py-4 flex flex-col justify-between gap-y-2">
      {/* name & price */}
      <div className="flex items-center justify-between">
        <p className="font-medium">{sale.customerName.toUpperCase()}</p>
        <p className="font-medium text-emerald-500">{sale.priceToPay} Baht</p>
      </div>

      {/* saled shuttle cocks */}
      <div className="flex">
        <div className="flex-1 flex flex-col gap-y-2">
          {sale.shuttlecockTubes.map((tube) => (
            <div key={tube.id} className="flex flex-col gap-y-2">
              <p className="font-medium text-sm">{tube.name}</p>

              <div className="flex items-center gap-x-4">
                {tube.shuttlecocks.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white text-black text-sm p-2 rounded-sm w-6 h-6 flex items-center justify-center font-medium"
                  >
                    <p>{s.number}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <MarkAsPaidButton sale={sale} />
      </div>
    </div>
  );
}
