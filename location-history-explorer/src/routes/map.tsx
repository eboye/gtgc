import { cache, createAsync } from "@solidjs/router";
import { Col, Form, Row } from "solid-bootstrap";
import { createSignal } from "solid-js";
import LeafletMap from "~/components/LeafletMap";
import { duckdb } from "~/duckdb";

const getData = cache(async (date: string) => {
    "use server";

    console.log('date: ', date);

    const semanticResults = await duckdb.getMany(`
        SELECT CAST({
            type: 'Feature', 
            geometry: ST_AsGeoJSON(geom), 
            properties: {
                activityType: activityType,
                startTimestamp: startTimestamp,
                endTimestamp: endTimestamp,
            } 
        } AS JSON) AS geojson
        FROM semantic_history
        WHERE date_trunc('day', startTimestamp) == ?;
    `, date);

    const locationResults = await duckdb.getMany(`
        SELECT CAST({
            type: 'Feature', 
            geometry: ST_AsGeoJSON(geom), 
            properties: {
                accuracy: accuracy,
                timestamp: timestamp,
            } 
        } AS JSON) AS geojson
        FROM location_records
        WHERE date_trunc('day', timestamp) == ?;
    `, date);

    const semanticData = semanticResults.map((result) => JSON.parse(result.geojson));
    const locationData = locationResults.map((result) => JSON.parse(result.geojson));
    return [...semanticData, ...locationData];

}, "Map_data");

export default function Map() {
    const [selectedDate, setSelectedDate] = createSignal(getCurrentDateString());
    const data = createAsync(() => getData(selectedDate()));

    return (
        <main>
            <Row xs={1} md={1} class="g-4">
                <Col>
                   <Form.Control type="date" value={selectedDate()} onInput={(e) => setSelectedDate(e.target.value)} />
                </Col>
            </Row>
            <Row xs={1} md={1} class="g-4">
                <Col>
                    <LeafletMap geoJsons={data() || []} />
                </Col>
            </Row>
        </main>
    );
}

function getCurrentDateString() {
    let month: string = '' + (new Date().getMonth() + 1);
    if (month.length === 1) {
        month = "0" + month;
    }
    let day: string = '' + (new Date().getDate());
    if (day.length === 1) {
        day = "0" + day;
    }

    return new Date().getFullYear() + "-" + month + "-" + day;
}