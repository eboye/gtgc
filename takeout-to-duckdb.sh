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

FILES_IN_TAKEOUT=`unzip -Z1 "$TAKEOUT_PATH"`
echo "Found $(echo "$FILES_IN_TAKEOUT" | wc -l) files in takeout archive..."

echo "$FILES_IN_TAKEOUT" | while read -r FILE_IN_TAKEOUT; do
    if [[ $FILE_IN_TAKEOUT =~ [0-9]{4}/[0-9]{4}_[A-Z]+\.json ]]; then
        unzip -p "$TAKEOUT_PATH" "$FILE_IN_TAKEOUT" | jq -f ./jq-filter/semantic-location-history --compact-output >> "$TEMP_SEMANTIC_LOCATIONS_PATH"
    fi
done
echo "Extracted $(cat $TEMP_SEMANTIC_LOCATIONS_PATH | wc -l) semantic locations from takeout archive..."

echo "Creating DuckDB database..."
duckdb $DUCKDB_PATH -c "INSTALL spatial;"
duckdb $DUCKDB_PATH -c "LOAD spatial; CREATE TABLE semantic_history AS SELECT * FROM ST_Read('$TEMP_SEMANTIC_LOCATIONS_PATH');"

echo "Cleaning up..."
rm -rf $TEMP_DIR

du -h $DUCKDB_PATH
echo "Done!"