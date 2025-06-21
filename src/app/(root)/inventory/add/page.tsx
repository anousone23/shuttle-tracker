"use client";

import { ClipLoader } from "react-spinners";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { createShuttlecockTubeAction } from "@/actions/shuttlecockTube";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AddNewShuttlecockTubePage() {
  const router = useRouter();
  const [state, action, pending] = useActionState(createShuttlecockTubeAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state?.success) {
      toast.success("Shuttle cock tube added successfully");
      router.push("/inventory");
    }
  }, [state, router]);

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-y-8">
      <Header>
        <p className="font-bold">Add new tube</p>
      </Header>

      <div className="flex-1 flex items-center justify-center">
        <form action={action} className="w-full flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-2">
            <p>Name</p>
            <Input name="name" placeholder="Name" />
          </div>

          <div className="flex flex-col gap-y-2">
            <p>Price</p>
            <Input name="price" placeholder="Price" />
          </div>

          <div className="mx-auto">
            <Button className="font-medium">
              {pending ? <ClipLoader size={18} /> : "Add new tube"}
            </Button>
          </div>

          {state.error && (
            <p className="text-center text-red-500">{state.error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
