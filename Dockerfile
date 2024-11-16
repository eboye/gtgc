FROM ubuntu:22.04
LABEL authors="eboye"

WORKDIR /app

RUN curl -fsSL https://bun.sh/install | bash

RUN apt-get update && apt-get install -y \
    wget jq unzip \
    && rm -rf /var/lib/apt/lists/*

RUN wget https://github.com/duckdb/duckdb/releases/download/v0.10.3/duckdb_cli-linux-amd64.zip \
    && unzip duckdb_cli-linux-amd64.zip -d /usr/local/bin \
    && rm duckdb_cli-linux-amd64.zip

RUN chmod +x /usr/local/bin/duckdb

CMD [ "duckdb", "--version"]
