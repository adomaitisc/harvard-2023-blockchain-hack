"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { daysOfWeekToDecimalSum, decimalSumToDaysOfWeek } from "@/lib/utils";
import { useEffect, useState } from "react";

export function CreateTrips() {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
  });
  const [isOneTimeTrip, setIsOneTimeTrip] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isDriver, setIsDriver] = useState(false);
  const [driverData, setDriverData] = useState({
    seats: 0,
    price: 0,
  });
  const [isSubmissable, setIsSubmissable] = useState(false);

  function handleAddDay(day: string) {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleDriverDataChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDriverData({ ...driverData, [e.target.name]: e.target.value });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = {
      origin: formData.origin,
      destination: formData.destination,
      trip: isOneTimeTrip ? "One-time" : "Regular",
      time,
      datetime: date,
      schedule: daysOfWeekToDecimalSum(selectedDays),
      price: driverData.price,
      seats: driverData.seats,
      driver: isDriver,
    };
    const res = await fetch("/api/trip", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log(res);
  }

  useEffect(() => {
    if (formData.origin.length < 3) {
      setIsSubmissable(false);
      return;
    }
    if (formData.destination.length < 3) {
      setIsSubmissable(false);
      return;
    }
    if (isOneTimeTrip) {
      if (!date || new Date(date).getFullYear() < new Date().getFullYear()) {
        setIsSubmissable(false);
        return;
      }
    } else {
      if (!time) {
        setIsSubmissable(false);
        return;
      }
      if (selectedDays.length === 0) {
        setIsSubmissable(false);
        return;
      }
    }
    if (isDriver) {
      if (driverData.seats === 0) {
        setIsSubmissable(false);
        return;
      }
      if (driverData.price === 0) {
        setIsSubmissable(false);
        return;
      }
    }
    setIsSubmissable(true);
  }, [formData, isOneTimeTrip, time, date, selectedDays, isDriver, driverData]);

  return (
    <>
      <form
        onSubmit={onSubmit}
        className="w-full p-8 flex flex-col max-w-lg mx-auto bg-white border border-zinc-100 shadow-md rounded-t-3xl gap-4"
      >
        <Input
          onChange={handleChange}
          value={formData.origin}
          name="origin"
          placeholder="From ZIP"
        />
        <Input
          onChange={handleChange}
          value={formData.destination}
          name="destination"
          placeholder="To ZIP"
        />
        <div className="flex items-center gap-2 py-2">
          <Switch
            defaultChecked={isOneTimeTrip}
            onCheckedChange={() => setIsOneTimeTrip(!isOneTimeTrip)}
          />
          <Label className="font-normal">Is this a one-time trip?</Label>
        </div>
        {isOneTimeTrip ? (
          <Input onChange={(e) => setDate(e.target.value)} type="date" />
        ) : (
          <>
            <Input onChange={(e) => setTime(e.target.value)} type="time" />
            <div className="flex flex-col gap-2">
              <Label className="font-normal">Select your commuting days</Label>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Sunday")} />{" "}
                <Label className="font-normal">Sunday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Monday")} />{" "}
                <Label className="font-normal">Monday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Tuesday")} />{" "}
                <Label className="font-normal">Tuesday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Wednesday")} />{" "}
                <Label className="font-normal">Wednesday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Thursday")} />{" "}
                <Label className="font-normal">Thursday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Friday")} />{" "}
                <Label className="font-normal">Friday</Label>
              </div>
              <div className="flex gap-2">
                <Checkbox onCheckedChange={() => handleAddDay("Saturday")} />{" "}
                <Label className="font-normal">Saturday</Label>
              </div>
            </div>
          </>
        )}
        <div className="flex items-center gap-2 py-2">
          <Switch
            defaultChecked={isDriver}
            onCheckedChange={() => setIsDriver(!isDriver)}
          />
          <Label className="font-normal">Are you driving?</Label>
        </div>
        {isDriver && (
          <>
            <Input
              onChange={handleDriverDataChange}
              name="seats"
              type="number"
              min={1}
              placeholder="How many seats are available?"
            />
            <Input
              onChange={handleDriverDataChange}
              name="price"
              type="number"
              min={1}
              placeholder="How much VET per seat?"
            />
          </>
        )}
        <Button disabled={!isSubmissable}>Submit</Button>
      </form>
    </>
  );
}
