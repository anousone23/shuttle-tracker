import { createClient } from "@/lib/supabse/server";
import { endOfMonth, startOfMonth } from "date-fns";

interface IShuttlecock {
  id: string;
  number: string;
  price: number;
  shuttlecock_tubes?: IShuttlecockTube;
}

interface IShuttlecockTube {
  id: string;
  name: string;
  price: number;
  shuttlecocks: IShuttlecock[];
}

export type GroupSale = {
  saleId: string;
  customerId: string;
  customerName: string;
  shuttlecockTubes: IShuttlecockTube[];
  isPaid: boolean;
  sellerId: string;
  priceToPay?: number;
};

export async function getGroupSalesByDate(dateParam: string) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const decoded = decodeURIComponent(dateParam);
  const baseDate = new Date(decoded);

  const startOfDay = new Date(baseDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(baseDate);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      customers!inner(
        id,
        name
      ),
      shuttlecocks!inner(
        id,
        number,
        price,
        shuttlecock_tubes!inner(
          id,
          name,
          price
        )
      )
    `
    )
    .eq("seller_id", userId)
    .gte("created_at", startOfDay.toISOString())
    .lte("created_at", endOfDay.toISOString())
    .order("is_paid", { ascending: true });

  if (error) throw new Error(error.message);

  // Group sales by customer using for...of loop for async support
  const groupedSales: GroupSale[] = [];

  if (!data) return groupedSales;

  // First, count how many customers bought each shuttlecock
  const shuttlecockCustomerCount = new Map<string, Set<string>>();

  for (const sale of data) {
    const shuttlecockId = sale.shuttlecocks.id;
    const customerId = sale.customers.id;

    if (!shuttlecockCustomerCount.has(shuttlecockId)) {
      shuttlecockCustomerCount.set(shuttlecockId, new Set());
    }

    shuttlecockCustomerCount.get(shuttlecockId)!.add(customerId);
  }

  console.log(shuttlecockCustomerCount);

  for (const sale of data) {
    const customerId = sale.customers.id;
    const customerName = sale.customers.name;

    // Find existing customer in accumulator
    let existingCustomer = groupedSales.find(
      (s) => s.customerId === customerId
    );

    if (!existingCustomer) {
      // Create new customer entry
      existingCustomer = {
        sellerId: sale.seller_id,
        saleId: sale.id,
        customerId: customerId,
        customerName: customerName,
        shuttlecockTubes: [],
        isPaid: sale.is_paid,
        priceToPay: 0, // Initialize priceToPay
      };
      groupedSales.push(existingCustomer);
    }

    // Check if shuttlecock tube already exists for this customer
    const tubeId = sale.shuttlecocks.shuttlecock_tubes!.id;
    const tubeName = sale.shuttlecocks.shuttlecock_tubes!.name;
    const tubePrice = sale.shuttlecocks.shuttlecock_tubes!.price;

    let existingTube = existingCustomer.shuttlecockTubes.find(
      (tube: IShuttlecockTube) => tube.id === tubeId
    );

    if (!existingTube) {
      // Create new tube entry
      existingTube = {
        id: tubeId,
        name: tubeName,
        price: tubePrice,
        shuttlecocks: [],
      };
      existingCustomer.shuttlecockTubes.push(existingTube);
    }

    // Calculate price to pay for this shuttlecock
    const shuttlecockId = sale.shuttlecocks.id;
    const shuttlecockPrice = sale.shuttlecocks.price;
    const customerCount =
      shuttlecockCustomerCount.get(shuttlecockId)?.size || 1;
    const pricePerCustomer = shuttlecockPrice / customerCount;

    // Add to customer's total price to pay
    existingCustomer.priceToPay! += pricePerCustomer;

    // Add shuttlecock to the tube
    existingTube.shuttlecocks.push({
      id: sale.shuttlecocks.id,
      number: sale.shuttlecocks.number,
      price: sale.shuttlecocks.price,
    });
  }

  return groupedSales;
}

export async function getIncomeByMonth(month: Date) {
  const supabase = await createClient();
  const userId = (await supabase.auth.getUser()).data.user?.id;

  const startDateOfMonth = startOfMonth(new Date(month));
  const endDateOfMonth = endOfMonth(new Date(month));
  const today = new Date();

  const endDate = endDateOfMonth < today ? endDateOfMonth : today;

  const { data, error } = await supabase
    .from("sales")
    .select(
      `
      *,
      shuttlecocks!inner (
        id,
        price
      )
      `
    )
    .eq("seller_id", userId)
    .eq("is_paid", true)
    .gte("created_at", startDateOfMonth.toISOString())
    .lte("created_at", endDate.toISOString());

  if (error) throw new Error(error.message);

  // count how many customers bought each shuttlecock
  const shuttlecockCustomerCount = new Map<string, Set<string>>();

  for (const sale of data) {
    const shuttlecockId = sale.shuttlecock_id;
    const customerId = sale.customer_id;

    if (!shuttlecockCustomerCount.has(shuttlecockId)) {
      shuttlecockCustomerCount.set(shuttlecockId, new Set());
    }
    shuttlecockCustomerCount.get(shuttlecockId)!.add(customerId);
  }

  const income = data.reduce((acc, sale) => {
    const customerCount =
      shuttlecockCustomerCount.get(sale.shuttlecock_id)?.size || 1;
    const priceToPay = sale.shuttlecocks.price / customerCount;

    return acc + priceToPay;
  }, 0);

  return income;
}
