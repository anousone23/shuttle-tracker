import { createClient } from "@/lib/supabse/client";
import { ICustomer } from "@/types";

export async function getAllCustomersClient() {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("seller_id", userId)
    .order("name");

  if (error) throw new Error(error.message);

  return data as ICustomer[];
}
