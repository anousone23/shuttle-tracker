import { createClient } from "@/lib/supabse/server";
import { IShuttlecockTube } from "@/types";

export async function getAllShuttlecockTubes() {
  const supabase = await createClient();
  const sellerId = (await supabase.auth.getUser()).data.user?.id;

  const { data } = await supabase
    .from("shuttlecock_tubes")
    .select("*")
    .eq("seller_id", sellerId);

  return data as IShuttlecockTube[];
}
