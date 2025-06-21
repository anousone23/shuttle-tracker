import { createClient } from "@/lib/supabse/server";
import { ICustomer } from "@/types";

export async function getAllCustomers() {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("seller_id", userId)
    .order("name");

  if (error) throw new Error(error.message);

  return data as ICustomer[];
}
