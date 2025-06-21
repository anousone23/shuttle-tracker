"use client";

import { useActionState, useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addCustomerAction } from "@/actions/customer";

export default function AddNewCustomerPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<string[]>([]);
  const [name, setName] = useState("");

  const [state, action, pending] = useActionState(addCustomerAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Customer created successfully");
      setCustomers([]);
      setName("");

      router.push("/customers");
    }
  }, [state, router]);

  function handleAddCustomer() {
    if (!name) return;

    if (customers.includes(name)) return toast.error("Name already included");

    setCustomers((prev) => [...prev, name]);
    setName("");
  }

  function handleRemoveCustomer(name: string) {
    setCustomers((prev) => prev.filter((c) => c !== name));
  }

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      <Header>
        <p className="font-bold">Add new customer</p>
      </Header>

      <div className="flex-1 flex items-center justify-center">
        <form action={action} className="flex flex-col gap-y-8">
          {/* input */}
          <div className="w-full flex items-center gap-x-4">
            <div className="flex-1">
              <Input
                placeholder="Customer name..."
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
              />
            </div>

            <Input hidden name="customers" defaultValue={customers} />

            <Button
              type="button"
              className="font-medium px-8"
              onClick={handleAddCustomer}
            >
              Add
            </Button>
          </div>

          {/* added customers */}
          {customers.length > 0 && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {customers.map((c) => (
                <div key={c} className="bg-white rounded-sm px-4 py-2 relative">
                  <p className="text-black">{c}</p>
                  <RxCross2
                    className="text-white bg-black absolute rounded-full p-1 -top-2 -right-2 shadow-sm"
                    size={24}
                    onClick={() => handleRemoveCustomer(c)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* button */}
          <Button>{pending ? <ClipLoader size={20} /> : "Confirm"}</Button>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
