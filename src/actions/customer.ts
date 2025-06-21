"use server";

import { createClient } from "@/lib/supabse/server";
import { PrevStateType } from "@/types";
import { revalidatePath } from "next/cache";

export async function addCustomerAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const customerData = formData.get("customers") as string;

  if (!customerData) {
    return {
      success: false,
      error: "Customer name is required",
    };
  }

  const customerArray = customerData
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized: no user found",
    };
  }

  // Check which customer names already exist for the current user
  const { data: existingCustomers, error: fetchError } = await supabase
    .from("customers")
    .select("name")
    .eq("seller_id", userId)
    .in("name", customerArray);

  if (fetchError) {
    return {
      success: false,
      error: "Failed to check existing customers",
    };
  }

  const existingNames = existingCustomers?.map((c) => c.name) || [];

  if (existingNames.length > 0) {
    return {
      success: false,
      error: `The following customer(s) already exist: ${existingNames.join(
        ", "
      )}`,
    };
  }

  // All names are new, so insert them
  const newCustomers = customerArray.map((name) => ({
    name,
    seller_id: userId,
  }));

  const { error: insertError } = await supabase
    .from("customers")
    .insert(newCustomers);

  if (insertError) {
    return {
      success: false,
      error: insertError.message,
    };
  }

  revalidatePath("/customers");

  return {
    success: true,
    error: null,
  };
}

export async function renameCustomerAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const name = formData.get("name") as string;
  const customerId = formData.get("customerId") as string;

  if (!name)
    return {
      success: false,
      error: "Name is required",
    };

  const supabase = await createClient();

  // get customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("name", name)
    .maybeSingle();

  if (customerError)
    return {
      success: false,
      error: customerError.message,
    };

  if (customer)
    return {
      success: false,
      error: `Customer with this name: '${name}' is already existed`,
    };

  // update customer name
  const { error: updateError } = await supabase
    .from("customers")
    .update({ name })
    .eq("id", customerId);

  if (updateError)
    return {
      success: false,
      error: updateError.message,
    };

  revalidatePath("/customers");

  return {
    success: true,
    error: null,
  };
}

export async function deleteCustomerAction(
  prevState: PrevStateType,
  formData: FormData
) {
  const customerId = formData.get("customerId") as string;

  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  // get customer
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .single();

  if (customerError)
    return {
      success: false,
      error: customerError.message,
    };

  // check if customer belong to this user
  if (customer.seller_id !== userId)
    return {
      success: false,
      error: "Don't have permission",
    };

  // delete customer
  const { error: deleteError } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId);

  if (deleteError)
    return {
      success: false,
      error: deleteError.message,
    };

  revalidatePath("/customers");

  return {
    success: true,
    error: null,
  };
}
