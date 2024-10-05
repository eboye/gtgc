#!/bin/sh

set -e

# Assert two parameters are given
if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <path to takeout-file> <path to duckdb database>"
    exit 1
fi

TAKEOUT_PATH=$1
DUCKDB_PATH=$2
TEMP_DIR=`mktemp -d`
TEMP_SEMANTIC_LOCATIONS_PATH="$TEMP_DIR/semantic.jsons"
TEMP_LOCATION_RECORDS_PATH="$TEMP_DIR/location.jsons"

FILES_IN_TAKEOUT=`unzip -Z1 "$TAKEOUT_PATH"`
echo "Found $(echo "$FILES_IN_TAKEOUT" | wc -l) files in takeout archive"

echo -n "Extracting semantic locations..."
echo "$FILES_IN_TAKEOUT" | while read -r FILE_IN_TAKEOUT; do
    if [[ $FILE_IN_TAKEOUT =~ [0-9]{4}/[0-9]{4}_[A-Z]+\.json ]]; then
        unzip -p "$TAKEOUT_PATH" "$FILE_IN_TAKEOUT" | jq -f ./jq-filter/semantic-location-history --compact-output >> "$TEMP_SEMANTIC_LOCATIONS_PATH"
    fi
done
echo " Found $(cat $TEMP_SEMANTIC_LOCATIONS_PATH | wc -l)"

echo -n "Extracting location records..."
# Find the path in the archive for the "Records.json" file
RECORDS_FILE=$(echo "$FILES_IN_TAKEOUT" | grep -E 'Records\.json$')
if [ -z "$RECORDS_FILE" ]; then
    echo "Error: Could not find Records.json file in takeout archive"
    exit 1
fi
unzip -p "$TAKEOUT_PATH" "$RECORDS_FILE" | jq -f ./jq-filter/location-records --compact-output > "$TEMP_LOCATION_RECORDS_PATH"
echo " Found $(cat "$TEMP_LOCATION_RECORDS_PATH" | wc -l)"

echo -n "Creating DuckDB database..."
duckdb $DUCKDB_PATH -c "INSTALL spatial;"
duckdb $DUCKDB_PATH -c "LOAD spatial; CREATE TABLE semantic_history AS SELECT * FROM ST_Read('$TEMP_SEMANTIC_LOCATIONS_PATH');"
duckdb $DUCKDB_PATH -c "LOAD spatial; CREATE TABLE location_records AS SELECT * FROM ST_Read('$TEMP_LOCATION_RECORDS_PATH');"
echo " Done"

echo -n "Optimizing DuckDB database..."
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Unknown' WHERE activityType IN ('UNKNOWN_ACTIVITY_TYPE', 'OTHER') OR activityType IS NULL;"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Public Transport' WHERE activityType IN ('IN_TRAIN', 'IN_BUS', 'IN_SUBWAY', 'IN_TRAM', 'IN_FERRY');"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Car' WHERE activityType IN ('IN_PASSENGER_VEHICLE', 'IN_TAXI', 'MOTORCYCLING');"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Flying' WHERE activityType = 'FLYING';"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Cycling' WHERE activityType = 'CYCLING';"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Walking' WHERE activityType = 'WALKING' OR activityType = 'RUNNING';"
duckdb $DUCKDB_PATH -c "UPDATE semantic_history SET activityType = 'Boating' WHERE activityType = 'BOATING' OR activityType = 'ROWING';"
duckdb $DUCKDB_PATH -c "VACUUM;"
echo " Done"

echo -n "Cleaning up..."
rm -rf $TEMP_DIR
echo " Done"

echo "Database size: $(du -h $DUCKDB_PATH)"
