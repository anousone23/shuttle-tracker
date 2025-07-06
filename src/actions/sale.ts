"use server";

import { createClient } from "@/lib/supabse/server";
import { PrevStateType } from "@/types";
import { revalidatePath } from "next/cache";

export async function createSaleAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const shuttlecockCount = formData.get("shuttlecockCount") as string;
  const shuttlecockTubeId = formData.get("shuttlecockTubeId") as string;
  const selectedCustomersData = formData.get("selectedCustomers") as string;
  const selectedCustomersArray = selectedCustomersData
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id !== "");

  // check input
  if (selectedCustomersArray.length === 0)
    return {
      success: false,
      error: "Customer is required",
    };

  if (!shuttlecockTubeId)
    return {
      success: false,
      error: "Brand is required",
    };

  if (isNaN(+shuttlecockCount))
    return {
      success: false,
      error: "Invalid shuttle cock number",
    };

  const supabase = await createClient();
  const sellerId = (await supabase.auth.getUser()).data.user?.id;

  // get all sold shuttle cocks
  const { data: soldShuttlecocks, error: soldError } = await supabase
    .from("sales")
    .select("shuttlecock_id")
    .eq("seller_id", sellerId);

  if (soldError)
    return {
      success: false,
      error: soldError.message,
    };

  const soldShuttlecockIds =
    soldShuttlecocks?.map((s) => s.shuttlecock_id) ?? [];

  // Get the specific number of shuttlecocks requested
  const { data: shuttlecocks, error: shuttlecocksError } = await supabase
    .from("shuttlecocks")
    .select("*")
    .eq("shuttlecock_tube_id", shuttlecockTubeId)
    .not("id", "in", `(${soldShuttlecockIds.join(",")})`)
    .limit(Number(shuttlecockCount));

  if (shuttlecocksError)
    return {
      success: false,
      error: shuttlecocksError.message,
    };

  if (shuttlecocks.length < Number(shuttlecockCount)) {
    return {
      success: false,
      error: `Not enough shuttle cocks. Need ${shuttlecockCount}, but only ${shuttlecocks.length} available.`,
    };
  }

  // create sales - each shuttlecock goes to all selected customers
  const salesData = [];

  for (let i = 0; i < shuttlecocks.length; i++) {
    for (let j = 0; j < selectedCustomersArray.length; j++) {
      salesData.push({
        seller_id: sellerId,
        shuttlecock_id: shuttlecocks[i].id,
        customer_id: selectedCustomersArray[j],
      });
    }
  }

  const { error: salesError } = await supabase.from("sales").insert(salesData);

  if (salesError)
    return {
      success: false,
      error: salesError.message,
    };

  revalidatePath("/");

  return {
    success: true,
    error: null,
  };
}

export async function markSaleAsPaidAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const shuttlecockIdsData = formData.get("shuttlecockIds") as string;
  const customerId = formData.get("customerId") as string;

  if (!shuttlecockIdsData)
    return {
      success: false,
      error: "Shuttle cock IDs is required",
    };

  if (!customerId)
    return {
      success: false,
      error: "Customer ID is required",
    };

  const shuttlecockIdsArray = shuttlecockIdsData
    .split(",")
    .map((id) => id.trim());

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId)
    return {
      success: false,
      error: "Unauthorized, user is not logged in",
    };

  // // get sale
  const { data: shuttlecocksData, error: shuttlecocksError } = await supabase
    .from("shuttlecocks")
    .select("id")
    .in("id", shuttlecockIdsArray);

  if (shuttlecocksError)
    return { success: false, error: shuttlecocksError.message };

  const shuttlecockIds = shuttlecocksData.map((shuttlecock) => shuttlecock.id);

  // get all shuttle cock sales
  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select("*")
    .eq("customer_id", customerId)
    .in("shuttlecock_id", shuttlecockIds);

  if (salesError)
    return {
      success: false,
      error: salesError.message,
    };

  const isSeller = sales.some((sale) => sale.seller_id === userId);
  const isCustomerOrder = sales.some((sale) => sale.customer_id === customerId);

  if (!isSeller)
    return {
      success: false,
      error: "Don't have permission",
    };

  if (!isCustomerOrder)
    return {
      success: false,
      error: "This sale is not belong to this customer",
    };

  // update sales status
  const saleIds = sales.map((sale) => sale.id);

  const { error: updateError } = await supabase
    .from("sales")
    .update({ is_paid: true })
    .eq("customer_id", customerId)
    .in("id", saleIds);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/");

  return { success: true, error: null };
}
