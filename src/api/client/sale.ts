import { createClient } from "@/lib/supabse/client";
import { endOfMonth, set, startOfMonth, subDays } from "date-fns";

type Sale = {
  created_at: string;
  is_paid: boolean;
};

export async function getFullyPaidDates({
  month,
}: {
  month: Date;
}): Promise<Date[]> {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const startDateOfMonth = startOfMonth(new Date(month));
  const endDateOfMonth = endOfMonth(new Date(month));
  const yesterday = set(subDays(new Date(), 1), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });

  // Use the earlier date between end of month and yesterday
  const endDate = endDateOfMonth < yesterday ? endDateOfMonth : yesterday;

  // Get all sales from start of month to end date
  const { data, error } = await supabase
    .from("sales")
    .select("created_at, is_paid")
    .eq("seller_id", userId)
    .gte("created_at", startDateOfMonth.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) throw new Error(error.message);

  // Group sales by date and filter for dates where all sales are paid
  const salesByDate: Record<string, Sale[]> = {};

  data.forEach((sale: Sale) => {
    const date = new Date(sale.created_at).toDateString();
    if (!salesByDate[date]) {
      salesByDate[date] = [];
    }
    salesByDate[date].push(sale);
  });

  // Filter for dates where all sales are paid
  const fullyPaidDates = Object.entries(salesByDate)
    .filter(([, sales]) => sales.every((sale: Sale) => sale.is_paid))
    .map(([, sales]) => new Date(sales[0].created_at));

  return fullyPaidDates;
}

export async function getPartiallyPaidSaleDates({
  month,
}: {
  month: Date;
}): Promise<Date[]> {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const startDateOfMonth = startOfMonth(new Date(month));
  const endDateOfMonth = endOfMonth(new Date(month));
  const yesterday = set(subDays(new Date(), 1), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });

  // Use the earlier date between end of month and yesterday
  const endDate = endDateOfMonth < yesterday ? endDateOfMonth : yesterday;

  // Get all sales from start of month to end date
  const { data, error } = await supabase
    .from("sales")
    .select("created_at, is_paid")
    .eq("seller_id", userId)
    .gte("created_at", startDateOfMonth.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) throw new Error(error.message);

  // Group sales by date
  const salesByDate: Record<string, Sale[]> = {};

  data.forEach((sale: Sale) => {
    const date = new Date(sale.created_at).toDateString();
    if (!salesByDate[date]) {
      salesByDate[date] = [];
    }
    salesByDate[date].push(sale);
  });

  // Filter for dates where some sales are paid AND some are unpaid (partially paid)
  const partiallyPaidDates = Object.entries(salesByDate)
    .filter(([, sales]) => {
      const hasPaidSales = sales.some((sale: Sale) => sale.is_paid);
      const hasUnpaidSales = sales.some((sale: Sale) => !sale.is_paid);
      // Return true only if both conditions are met (partially paid)
      return hasPaidSales && hasUnpaidSales;
    })
    .map(([, sales]) => new Date(sales[0].created_at));

  return partiallyPaidDates;
}

export async function getUnpaidDates({
  month,
}: {
  month: Date;
}): Promise<Date[]> {
  const supabase = createClient();
  const userId = (await supabase.auth.getSession()).data.session?.user.id;

  const startDateOfMonth = startOfMonth(new Date(month));
  const endDateOfMonth = endOfMonth(new Date(month));
  const yesterday = set(subDays(new Date(), 1), {
    hours: 23,
    minutes: 59,
    seconds: 59,
    milliseconds: 999,
  });

  // Use the earlier date between end of month and yesterday
  const endDate = endDateOfMonth < yesterday ? endDateOfMonth : yesterday;

  // Get all sales from start of month to end date
  const { data, error } = await supabase
    .from("sales")
    .select("created_at, is_paid")
    .eq("seller_id", userId)
    .gte("created_at", startDateOfMonth.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) throw new Error(error.message);

  // Group sales by date and filter for dates where all sales are unpaid
  const salesByDate: Record<string, Sale[]> = {};

  data.forEach((sale: Sale) => {
    const date = new Date(sale.created_at).toDateString();
    if (!salesByDate[date]) {
      salesByDate[date] = [];
    }
    salesByDate[date].push(sale);
  });

  // Filter for dates where all sales are paid
  const unpaidDates = Object.entries(salesByDate)
    .filter(([, sales]) => sales.every((sale: Sale) => !sale.is_paid))
    .map(([, sales]) => new Date(sales[0].created_at));

  return unpaidDates;
}
