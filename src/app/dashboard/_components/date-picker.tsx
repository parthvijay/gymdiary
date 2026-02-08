"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DashboardDatePicker({ date }: { date: Date }) {
  const router = useRouter();

  function handleDateSelect(day: Date | undefined) {
    if (!day) return;
    router.push(`/dashboard?date=${format(day, "yyyy-MM-dd")}`);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[240px] justify-start text-left font-normal")}
          aria-label="Pick a date"
        >
          <CalendarIcon aria-hidden="true" />
          {format(date, "PPP")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
