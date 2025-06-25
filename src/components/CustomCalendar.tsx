"use client";

import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import {
  getFullyPaidDates,
  getPartiallyPaidSaleDates,
  getUnpaidDates,
} from "@/api/client/sale";
import { useRouter } from "next/navigation";

export function CustomCalendar() {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [fullyPaidDates, setFullyPaidDates] = useState<Date[]>([]);
  const [partiallyPaidDates, setPartiallyPaidDates] = useState<Date[]>([]);
  const [unPaidDates, setUnPaidDates] = useState<Date[]>([]);

  const [month, setMonth] = useState<Date>(new Date());

  useEffect(() => {
    async function fetchData() {
      const paidSaleDatesData = await getFullyPaidDates({ month });
      const partiallyPaidDatesData = await getPartiallyPaidSaleDates({ month });
      const unpaidDatesData = await getUnpaidDates({ month });
      setFullyPaidDates(paidSaleDatesData);
      setPartiallyPaidDates(partiallyPaidDatesData);
      setUnPaidDates(unpaidDatesData);
    }

    fetchData();
  }, [month]);

  function handleDayClick(day: Date) {
    router.push(`/sales/${day}`);
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border shadow-sm w-full"
      captionLayout="dropdown"
      onMonthChange={(month) => setMonth(month)}
      onDayClick={handleDayClick}
      modifiers={{
        fullyPaidDates: fullyPaidDates,
        partiallyPaidDates: partiallyPaidDates,
        unPaidDates: unPaidDates,
      }}
      modifiersClassNames={{
        fullyPaidDates: "bg-emerald-500 rounded-md ",
        partiallyPaidDates: "bg-orange-500 rounded-md ",
        unPaidDates: "bg-red-500 rounded-md ",
      }}
    />
  );
}
