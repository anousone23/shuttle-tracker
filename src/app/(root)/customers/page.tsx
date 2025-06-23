import Link from "next/link";

import { getAllCustomers } from "@/api/server/customer";
import CustomerItem from "@/components/CustomerItem";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default async function CustomersPage() {
  const customers = await getAllCustomers();

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      {/* header */}
      <Header>
        <p className="font-bold text-sm">Customers: {customers.length}</p>
      </Header>

      {/* customer list */}
      <div className="flex-1 flex flex-col gap-y-4 overflow-y-auto">
        {customers.map((c) => (
          <CustomerItem key={c.id} customer={c} />
        ))}
      </div>

      <div className="flex items-center justify-center mb-8">
        <Button asChild>
          <Link href="/customers/add" className="text-xs">
            Add new customer
          </Link>
        </Button>
      </div>
    </div>
  );
}
