import type { Feature } from "geojson";
import { bbox } from "@turf/turf";

export function boundingBox(features: Feature[]): [number, number, number, number] {
  return bbox({
    type: "FeatureCollection",
    features,
  }) as [number, number, number, number];
}
