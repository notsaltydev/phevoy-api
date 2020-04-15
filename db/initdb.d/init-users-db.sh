#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER phevoy;
    CREATE DATABASE phevoy_db ENCODING UTF8;
    GRANT ALL PRIVILEGES ON DATABASE phevoy_db TO phevoy;

    ALTER USER phevoy WITH PASSWORD 'password123';
    ALTER USER phevoy WITH SUPERUSER;
EOSQL
