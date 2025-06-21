import { createClient } from "@/lib/supabse/server";

export async function getRemainingShuttlecocks(tubeId: string) {
  const supabase = await createClient();

  //   get all shuttle cocks from tube id
  const { data: shuttlecocks, error: shuttlecocksError } = await supabase
    .from("shuttlecocks")
    .select("id")
    .eq("shuttlecock_tube_id", tubeId);

  if (shuttlecocksError) throw new Error(shuttlecocksError.message);

  const shuttlecockIds = shuttlecocks?.map((s) => s.id) ?? [];

  // get all sold shuttle cock
  const { data: soldShuttlecocks, error: salesError } = await supabase
    .from("sales")
    .select("shuttlecock_id")
    .in("shuttlecock_id", shuttlecockIds);

  if (salesError) throw new Error(salesError.message);

  //   filter only not sold shuttle cocks
  const soldShuttlecockIds = new Set(
    soldShuttlecocks?.map((s) => s.shuttlecock_id) ?? []
  );
  const remaining = shuttlecockIds.filter(
    (id) => !soldShuttlecockIds.has(id)
  ).length;

  return remaining;
}
