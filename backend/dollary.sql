\echo 'Delete and recreate Dollary db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE dollary;
CREATE DATABASE dollary;
\connect dollary

\i dollary-schema.sql
\i dollary-seed.sql

\echo 'Delete and recreate dollary_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE dollary_test;
CREATE DATABASE dollary_test;
\connect dollary_test

\i dollary-schema.sql
