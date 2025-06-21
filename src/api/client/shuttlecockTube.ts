import { createClient } from "@/lib/supabse/client";
import { getRemainingShuttlecocksClient } from "./shuttlecock";

export async function getAllAvailableShuttlecockTubesWithRemaining() {
  const supabase = createClient();
  const sellerId = (await supabase.auth.getSession()).data.session?.user.id;

  // Get all tubes belonging to the seller
  const { data: tubes, error: tubeError } = await supabase
    .from("shuttlecock_tubes")
    .select("*")
    .eq("seller_id", sellerId);

  if (tubeError) throw new Error(tubeError.message);

  // For each tube, get remaining shuttlecocks
  const tubesWithRemaining = await Promise.all(
    (tubes ?? []).map(async (tube) => {
      const remaining = await getRemainingShuttlecocksClient(tube.id);
      return {
        ...tube,
        remaining,
      };
    })
  );

  return tubesWithRemaining;
}
