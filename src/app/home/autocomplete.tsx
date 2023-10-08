"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

type Suggestions = {
  formatted: string;
  lat: string;
  lon: string;
};

type Props = {
  placeholder: string;
  data: string;
  setData: (data: string) => void;
  setLatLon: (lat: string, lon: string) => void;
};

export function Autocomplete({ placeholder, data, setData, setLatLon }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions[]>([]);

  async function fetchSuggestions(text: string) {
    const res = await fetch(
      "https://api.geoapify.com/v1/geocode/autocomplete?apiKey=a2ee8056c0234b41a7d8f7cd1f50c7d2" +
        "&text=" +
        encodeURI(text)
    );
    const data = await res.json();
    let places = data.features;
    const suggestions: Suggestions[] = [];

    places.forEach((place: any) => {
      suggestions.push({
        formatted: place.properties.formatted,
        lat: place.properties.lat,
        lon: place.properties.lon,
      });
    });
    return suggestions;
  }

  useEffect(() => {
    if (data.length > 2) {
      fetchSuggestions(data).then((suggestions) => {
        setSuggestions(suggestions);
      });
    }
  }, [data]);

  return (
    <div className="relative">
      <Input
        onFocus={() => setIsOpen(true)}
        onChange={(e) => setData(e.target.value)}
        value={data}
        autoComplete="off"
        placeholder={placeholder}
      />
      {isOpen && (
        <div className="absolute text-sm z-10 top-full left-0 right-0 bg-white border border-zinc-100 rounded-b-xl shadow-md">
          <div className="p-4 flex flex-col gap-2">
            {suggestions.map((suggestion) => (
              <button
                className="py-1 hover:bg-zinc-100"
                onClick={() => {
                  setData(suggestion.formatted);
                  setLatLon(suggestion.lat, suggestion.lon);
                  setIsOpen(false);
                }}
              >
                {suggestion.formatted}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
