"use client";

import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

export default function SignInPage() {
  const [state, action, pending] = useActionState(loginAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Logged in successfully");
    }
  }, [state]);

  return (
    <div className="w-full h-screen p-4 flex items-center justify-center">
      <form
        action={action}
        className="flex flex-col gap-y-4 border p-8 rounded-sm"
      >
        <div className="flex flex-col gap-y-2">
          <p className="font-medium">Email</p>
          <Input name="email" placeholder="Email" className="text-sm" />
        </div>

        <div className="flex flex-col gap-y-2">
          <p className="font-medium">Password</p>
          <Input
            name="password"
            placeholder="Password"
            type="password"
            className="text-sm"
          />
        </div>

        <div className="w-full flex flex-col gap-y-2">
          <Button className="w-full">
            {pending ? <ClipLoader size={18} /> : "Sign In"}
          </Button>

          {state.error && (
            <p className="text-center text-sm text-red-500">{state.error}</p>
          )}
        </div>
      </form>
    </div>
  );
}
