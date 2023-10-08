import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function daysOfWeekToDecimalSum(daysOfWeek: string[]): number {
  const daysMap: { [key: string]: number } = {
    Sunday: 1,
    Monday: 2,
    Tuesday: 4,
    Wednesday: 8,
    Thursday: 16,
    Friday: 32,
    Saturday: 64,
  };

  let decimalSum = 0;

  for (const day of daysOfWeek) {
    const decimalValue = daysMap[day];
    if (decimalValue) {
      // Add the decimal representation of the day to the sum
      decimalSum += decimalValue;
    } else {
      throw new Error('Invalid day of the week');
    }
  }

  return decimalSum;
}

export function decimalSumToDaysOfWeek(decimalSum: number): string[] {
  const daysMap: { [key: number]: string } = {
    1: 'Sunday',
    2: 'Monday',
    4: 'Tuesday',
    8: 'Wednesday',
    16: 'Thursday',
    32: 'Friday',
    64: 'Saturday',
  };

  const daysOfWeek: string[] = [];

  for (const decimalValue in daysMap) {
    if (decimalSum & Number(decimalValue)) {
      daysOfWeek.push(daysMap[Number(decimalValue)]);
    }
  }

  if (daysOfWeek.length > 0) {
    return daysOfWeek;
  } else {
    throw new Error('Invalid decimal sum');
  }
}