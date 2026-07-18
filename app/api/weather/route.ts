import { NextResponse } from "next/server";
import { VANCOUVER } from "@/lib/arjun-os/constants";

export const runtime = "nodejs";
export const revalidate = 1800;

type WeatherPayload = {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  label: string;
  source: string;
  fetchedAt: string;
};

function weatherLabel(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "Clear" : "Clear night";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunderstorm";
  return "Vancouver weather";
}

export async function GET() {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(VANCOUVER.latitude));
    url.searchParams.set("longitude", String(VANCOUVER.longitude));
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day");
    url.searchParams.set("timezone", VANCOUVER.timezone);

    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: true, fallback: `${VANCOUVER.label} • Pacific Time` },
        { status: 502 },
      );
    }

    const data = await response.json();
    const current = data.current;
    const payload: WeatherPayload = {
      temperature: current.temperature_2m,
      weatherCode: current.weather_code,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      isDay: Boolean(current.is_day),
      label: weatherLabel(current.weather_code, Boolean(current.is_day)),
      source: "https://open-meteo.com/",
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=900",
      },
    });
  } catch {
    return NextResponse.json(
      { error: true, fallback: `${VANCOUVER.label} • Pacific Time` },
      { status: 502 },
    );
  }
}
