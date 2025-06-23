"use client";

import { GroupSale } from "@/api/server/sale";
import { Button } from "./ui/button";
import { useActionState, useEffect } from "react";
import { markSaleAsPaidAction } from "@/actions/sale";
import { ClipLoader } from "react-spinners";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function MarkAsPaidButton({ sale }: { sale: GroupSale }) {
  const [state, action, pending] = useActionState(markSaleAsPaidAction, {
    success: false,
    error: null,
  });

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

      <Input hidden name="saleId" defaultValue={sale.saleId} />
    </form>
  );
}
