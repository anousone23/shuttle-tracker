"use client";

import { useActionState, useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import { createSaleAction } from "@/actions/sale";
import { getAllCustomersClient } from "@/api/client/customer";
import { getAllAvailableShuttlecockTubesWithRemaining } from "@/api/client/shuttlecockTube";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICustomer, IShuttlecockTube } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

export default function AddNewSalePage() {
  const [selectedCustomers, setSelectedCustomers] = useState<ICustomer[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [shuttlecockTubes, setShuttlecockTubes] = useState<IShuttlecockTube[]>(
    []
  );
  const [shuttlecockCount, setShuttlecockCount] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [search, setSearch] = useState("");

  const [state, action, pending] = useActionState(createSaleAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    async function fetchCustomersAndShuttlecockTubes() {
      const customers = await getAllCustomersClient();
      const shuttlecockTubes =
        await getAllAvailableShuttlecockTubesWithRemaining();

      setCustomers(customers);
      setShuttlecockTubes(shuttlecockTubes);
    }

    fetchCustomersAndShuttlecockTubes();
  }, [shuttlecockTubes]);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sale added successfully");
      setSelectedCustomers([]);
      setSelectedBrand("");
      setShuttlecockCount(1);
    }
  }, [state]);

  // function
  function handleIncreaseCount() {
    setShuttlecockCount((prev) => prev + 1);
  }

  function handleDecreaseCount() {
    if (shuttlecockCount === 1) return;

    setShuttlecockCount((prev) => prev - 1);
  }

  function handleRemoveSelectedCustomer(id: string) {
    setSelectedCustomers((prev) =>
      prev.filter((customer) => customer.id !== id)
    );
  }

  function handleCheckedChange(checked: CheckedState, customer: ICustomer) {
    if (checked) {
      if (selectedCustomers.length === 4)
        return alert("Cannot select more than 4 person");
      setSelectedCustomers((prev) => [...prev, customer]);
    } else {
      setSelectedCustomers((prev) => prev.filter((c) => c.id !== customer.id));
    }
  }

  //   filter customers
  let displayCustomers = customers.filter(
    (c) => !selectedCustomers.some((selectedC) => selectedC.id === c.id)
  );

  displayCustomers = search
    ? displayCustomers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
      )
    : displayCustomers;

  return (
    <div className="w-full h-screen flex flex-col">
      {/* header */}
      <div className="p-4">
        <Header>
          <p className="font-bold">Add new sale</p>
        </Header>
      </div>

      {/* selected customer */}
      {selectedCustomers.length > 0 && (
        <div className="px-4 py-8 flex flex-col border-b border-b-secondary-bg gap-y-4">
          <p className="font-medium">
            Selected customers: {selectedCustomers.length}
          </p>

          <div className=" flex items-center justify-start gap-x-8">
            {selectedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-sm px-4 py-2 relative"
              >
                <p className="text-black font-medium">{customer.name}</p>
                <div
                  className="absolute p-1 bg-black rounded-full shadow-md -top-2 -right-2 cursor-pointer"
                  onClick={() => handleRemoveSelectedCustomer(customer.id)}
                >
                  <RxCross2 color="#fafafa" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* search input */}
      <div className="p-4 flex flex-col gap-y-2">
        <p className="font-medium">Customers: {customers.length}</p>

        <Input
          placeholder="Search..."
          className="text-sm w-[50%]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* customer list */}
      <div className="flex-1 p-4 flex flex-col gap-y-4 overflow-y-auto">
        <div className="flex flex-col gap-y-8 justify-center">
          {displayCustomers.map((customer) => {
            const isChecked = selectedCustomers.some(
              (c) => c.id === customer.id
            );

            return (
              <div key={customer.id} className="flex items-center gap-x-4">
                <Checkbox
                  className="size-8"
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleCheckedChange(checked, customer)
                  }
                />
                <p className="font-medium text-lg">{customer.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* action button */}
      <form
        action={action}
        className="px-4 py-8 flex flex-col items-center gap-y-8 border-t border-t-secondary-bg"
      >
        {/* shuttle cock tube selector */}
        <div className="flex flex-col gap-y-4 items-center justify-center">
          <Select
            name="shuttlecockTubeId"
            value={selectedBrand}
            onValueChange={(value) => setSelectedBrand(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              {shuttlecockTubes.map((tube) => {
                if (tube.remaining === 0) return null;

                return (
                  <SelectItem key={tube.id} value={tube.id}>
                    {tube.name} (remaining: {tube.remaining})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* number selector */}
          <div className="flex items-center gap-x-4">
            {/* prev */}
            <div
              className="bg-white rounded-full p-1 cursor-pointer"
              onClick={handleDecreaseCount}
            >
              <FaMinus color="#09090b" size={18} />
            </div>

            <div className="bg-white w-12 h-12 flex items-center justify-center rounded-md">
              <p className="text-black font-bold text-xl">{shuttlecockCount}</p>
              <Input
                hidden
                name="shuttlecockCount"
                value={shuttlecockCount}
                readOnly
              />
            </div>

            {/* next */}
            <div
              className="bg-white rounded-full p-1 cursor-pointer"
              onClick={handleIncreaseCount}
            >
              <FaPlus color="#09090b" size={18} />
            </div>
          </div>
        </div>

        {/* button */}
        <div className="flex flex-col gap-y-4">
          <Button type="submit" className="px-12">
            {pending ? <ClipLoader size={18} /> : "Create"}
          </Button>

          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>

        <Input
          hidden
          name="selectedCustomers"
          value={selectedCustomers.map((c) => c.id).join(",")}
          readOnly
        />
      </form>
    </div>
  );
}
