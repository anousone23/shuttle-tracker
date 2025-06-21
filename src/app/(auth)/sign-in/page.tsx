import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  return (
    <div className="w-full h-screen p-4 flex items-center justify-center">
      <form
        action={loginAction}
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
          <Button className="w-full">Sign In</Button>
        </div>
      </form>
    </div>
  );
}
