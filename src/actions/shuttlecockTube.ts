"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabse/server";
import { PrevStateType } from "@/types";

export async function createShuttlecockTubeAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const supabase = await createClient();
  const sellerId = (await supabase.auth.getUser()).data.user?.id;

  //   check inputs
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;

  if (!name || !price)
    return { success: false, error: "All inputs are required" };

  if (isNaN(+price))
    return {
      success: false,
      error: "Price must be a number",
    };

  if (+price < 0)
    return {
      success: false,
      error: "Price must be greater than 0",
    };

  // create shuttle cock tube
  const { data: tubeData, error: tubeError } = await supabase
    .from("shuttlecock_tubes")
    .insert({
      name,
      price: Number(price),
      seller_id: sellerId,
    })
    .select("id, price")
    .single();

  if (tubeError)
    return {
      success: false,
      error: tubeError.message,
    };

  // create shuttle cocks
  const shuttlecocks = Array.from({ length: 12 }, (_, i) => {
    const pricePerUnit = tubeData.price / 12;

    return {
      shuttlecock_tube_id: tubeData.id,
      number: i + 1,
      seller_id: sellerId,
      price: pricePerUnit,
    };
  });

  const { error: shuttlecockError } = await supabase
    .from("shuttlecocks")
    .insert(shuttlecocks);

  if (shuttlecockError) {
    return {
      success: false,
      error: shuttlecockError.message,
    };
  }

  //   if success
  return {
    success: true,
    error: null,
  };
}

export async function renameShuttlecockTubeAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const shuttlecockTubeId = formData.get("shuttlecockTubeId") as string;
  const name = formData.get("name") as string;

  // check input
  if (!name)
    return {
      success: false,
      error: "Name is required",
    };

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // get shuttle cock tube
  const { data: shuttlecockTube, error: shuttlecockTubeError } = await supabase
    .from("shuttlecock_tubes")
    .select("*")
    .eq("id", shuttlecockTubeId)
    .single();

  if (shuttlecockTubeError)
    return {
      success: false,
      error: shuttlecockTubeError.message,
    };

  // check if current user is the seller
  if (shuttlecockTube.seller_id !== userId)
    return {
      success: false,
      error: "Don't have permission",
    };

  const { error: updateError } = await supabase
    .from("shuttlecock_tubes")
    .update({ name })
    .eq("id", shuttlecockTube.id);

  if (updateError)
    return {
      success: false,
      error: updateError.message,
    };

  revalidatePath("/inventory");

  return {
    success: true,
    error: null,
  };
}

export async function deleteShuttlecockTubeAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const shuttlecockTubeId = formData.get("shuttlecockTubeId") as string;

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // get shuttle cock tube
  const { data: shuttlecockTube, error: shuttlecockTubeError } = await supabase
    .from("shuttlecock_tubes")
    .select("*")
    .eq("id", shuttlecockTubeId)
    .single();

  if (shuttlecockTubeError)
    return {
      success: false,
      error: shuttlecockTubeError.message,
    };

  // check if current user is the seller
  if (shuttlecockTube.seller_id !== userId)
    return {
      success: false,
      error: "Don't have permission",
    };

  const { error: deleteError } = await supabase
    .from("shuttlecock_tubes")
    .delete()
    .eq("id", shuttlecockTubeId);

  if (deleteError)
    return {
      success: false,
      error: deleteError.message,
    };

  revalidatePath("/inventory");

  return {
    success: true,
    error: null,
  };
}
