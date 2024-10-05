# google-timeline-geojson-converter

JQ Filter to transform Google Takeout Timeline Json files to GeoJSON

## Requirements

* unzip
* jq
* duckdb
* bun

## Usage

After cloning this repo, just run:

```
./takeout-to-duckdb.sh <Path-to-Takeout-Archive> duck.db
cd location-history-explorer
bun install
bun dev
```

Open http://localhost:5173/ and checkout your Location Timeline data!
