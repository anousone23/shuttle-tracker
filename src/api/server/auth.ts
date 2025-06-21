import { createClient } from "@/lib/supabse/server";
import { IUser } from "@/types";

export async function getAuthUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const { data: user } = await supabase
    .from("sellers")
    .select("*")
    .eq("id", data.user?.id)
    .maybeSingle();

  return user as IUser;
}
