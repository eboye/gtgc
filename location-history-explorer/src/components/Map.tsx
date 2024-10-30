import {
  Map as MapLibre,
  Layer,
  Source,
  type MapRef,
  NavigationControl,
  type LineLayer,
} from "react-map-gl/maplibre";
import type { Feature, FeatureCollection } from "geojson";
import { useContext, useEffect, useRef, useState } from "react";
import { DateRangeContext } from "../context/DateRangeContext";
import { actions } from "astro:actions";
import { boundingBox } from "../utils/bounding-box";
import { ScaleControl } from "react-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { colorByActivityType } from "../utils/color-palette";

const layerStyle: LineLayer = {
  id: "line",
  type: "line",
  source: "maplibre",
  paint: {
    "line-width": 2,
    "line-color": ["get", "line-color"],
  },
};

export function Map() {
  const dateRange = useContext(DateRangeContext);
  const mapRef = useRef<MapRef>();

  const [geojson, setGeojson] = useState<FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    async function fetchData() {
      const [startDate, endDate] = dateRange;
      let { data } = await actions.querySemanticHisotry({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      if (!data) {
        data = [];
      }

      setLineColors(data);

      setGeojson({
        ...geojson,
        features: data,
      });

      const bounds = boundingBox(data);
      mapRef.current!.fitBounds(bounds, { padding: 20 });
    }
    fetchData();
  }, [mapRef, dateRange]);

  return (
    <MapLibre
      ref={mapRef}
      style={{ height: "100%" }}
      mapStyle="https://tiles.versatiles.org/assets/styles/neutrino.json"
    >
      <NavigationControl />
      <ScaleControl />
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </MapLibre>
  );
}

function setLineColors(features: Feature[]) {
  features.forEach((feature) => {
    feature.properties = {
      ...feature.properties,
      "line-color": colorByActivityType(feature?.properties?.activityType),
    };
  });
}
