"use client";

import { IoIosMore } from "react-icons/io";
import { MdDelete, MdEditSquare } from "react-icons/md";
import { useActionState, useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ICustomer } from "@/types";
import { deleteCustomerAction, renameCustomerAction } from "@/actions/customer";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

export default function CustomerItem({ customer }: { customer: ICustomer }) {
  const [mode, setMode] = useState<"rename" | "delete" | null>(null);

  const [renameState, renameAction, renamePending] = useActionState(
    renameCustomerAction,
    {
      success: false,
      error: null,
    }
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteCustomerAction,
    {
      success: false,
      error: null,
    }
  );

  useEffect(() => {
    if (renameState?.success) {
      toast.success("Customer renamed successfully");
      setMode(null);
    }

    if (deleteState?.success) {
      toast.success("Customer deleted successfully");
      setMode(null);
    }
  }, [renameState, deleteState]);

  return (
    <div className="bg-secondary-bg border border-border rounded-sm flex items-center justify-between px-4 py-4">
      {mode === "rename" ? (
        <form
          action={renameAction}
          className="flex items-center justify-between gap-x-4 w-full"
        >
          <div className="flex flex-col gap-y-2">
            <Input
              name="name"
              defaultValue={customer.name}
              className="flex-1 bg-secondary-bg border border-zinc-700"
            />

            {renameState.error && (
              <p className="text-sm text-red-500">{renameState.error}</p>
            )}
          </div>
          <Input hidden name="customerId" defaultValue={customer.id} />

          <div className="flex items-center gap-x-4">
            <Button
              type="submit"
              className="bg-primary-bg text-white hover:bg-zinc-900"
            >
              {renamePending ? (
                <ClipLoader color="#fafafa" size={18} />
              ) : (
                "Confirm"
              )}
            </Button>
            <Button
              type="button"
              className="bg-secondary-bg text-white border border-border hover:bg-primary-bg"
              onClick={() => setMode(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="font-medium">{customer.name}</p>
      )}

      {mode === "delete" && (
        <form action={deleteAction} className="flex items-center gap-x-4">
          <Input hidden name="customerId" defaultValue={customer.id} />
          <Button
            type="submit"
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            {deletePending ? (
              <ClipLoader color="#fafafa" size={18} />
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            type="button"
            className="bg-secondary-bg text-white border border-border hover:bg-primary-bg"
            onClick={() => setMode(null)}
          >
            Cancel
          </Button>
        </form>
      )}

      {!mode && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <IoIosMore size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setMode("rename")}>
              <MdEditSquare color="#fafafa" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("delete")}>
              <MdDelete color="#fafafa" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
