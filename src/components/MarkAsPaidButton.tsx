"use client";

import { markSaleAsPaidAction } from "@/actions/sale";
import { GroupSale } from "@/api/server/sale";
import { useActionState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function MarkAsPaidButton({ sale }: { sale: GroupSale }) {
  const [state, action, pending] = useActionState(markSaleAsPaidAction, {
    success: false,
    error: null,
  });

  const shuttlecockIds = sale.shuttlecockTubes
    .map((tube) => tube.shuttlecocks.map((shuttlecock) => shuttlecock.id))
    .flat();

  useEffect(() => {
    if (state.success) {
      toast.success("Sale status updated successfully");
    }

    if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={action} className="flex flex-col gap-y-2 self-end">
      {sale.isPaid ? (
        <Button className="self-end text-xs bg-emerald-500 text-white" disabled>
          PAID
        </Button>
      ) : (
        <Button className="self-end text-xs">
          {pending ? <ClipLoader size={12} /> : "Mark as paid"}
        </Button>
      )}

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}

      <Input
        hidden
        name="shuttlecockIds"
        value={shuttlecockIds.join(",")}
        readOnly
      />

      <Input hidden name="customerId" value={sale.customerId} readOnly />
    </form>
  );
}
