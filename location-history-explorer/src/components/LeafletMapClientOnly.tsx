import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import * as geojson from "geojson";

import styles from "./LeafletMapClientOnly.module.css"
import { createEffect, createSignal, onMount } from 'solid-js';

export default function LeafletMap(props: { geoJsons: geojson.GeometryObject[] }) {
    let mapRef;
    let [layerGroup, setLayerGroup] = createSignal<L.LayerGroup>();

    createEffect(() => {
        if (!layerGroup() || !props.geoJsons) return;
        layerGroup()!.clearLayers();

        L.geoJSON(props.geoJsons, {
            style: {
                "color": "#ff7800",
                "weight": 5,
                "opacity": 0.65
            }
        }).addTo(layerGroup()!);
    });
    
    onMount(() => {
        const map = L.map(mapRef!).setView([52.546549,13.3528732], 10);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        setLayerGroup(L.layerGroup().addTo(map));
    });

    return (
        <div ref={mapRef} class={styles.map}></div>
    );
}