--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS "public";
ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA IF NOT EXISTS "auth";
ALTER SCHEMA "auth" OWNER TO "supabase_admin";

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA IF NOT EXISTS "storage";
ALTER SCHEMA "storage" OWNER TO "supabase_admin";

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA IF NOT EXISTS "extensions";
ALTER SCHEMA "extensions" OWNER TO "postgres";

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA "public";

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "extensions";

--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

--
-- Name: pgtap; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgtap" WITH SCHEMA "extensions";

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "postgis" WITH SCHEMA "extensions";

--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "extensions";

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);
ALTER TYPE "auth"."aal_level" OWNER TO "supabase_admin";

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);
ALTER TYPE "auth"."code_challenge_method" OWNER TO "supabase_admin";

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);
ALTER TYPE "auth"."factor_status" OWNER TO "supabase_admin";

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);
ALTER TYPE "auth"."factor_type" OWNER TO "supabase_admin";

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);
ALTER TYPE "auth"."one_time_token_type" OWNER TO "supabase_admin";

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."user_role" AS ENUM (
    'user',
    'admin'
);
ALTER TYPE "public"."user_role" OWNER TO "postgres";

--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_admin
--

CREATE TYPE "storage"."buckettype" AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);
ALTER TYPE "storage"."buckettype" OWNER TO "supabase_admin";

--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."oauth_registration_type" AS ENUM (
    'dynamic',
    'manual'
);
ALTER TYPE "auth"."oauth_registration_type" OWNER TO "supabase_admin";

--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."oauth_client_type" AS ENUM (
    'public',
    'confidential'
);
ALTER TYPE "auth"."oauth_client_type" OWNER TO "supabase_admin";

--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."oauth_response_type" AS ENUM (
    'code'
);
ALTER TYPE "auth"."oauth_response_type" OWNER TO "supabase_admin";

--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_admin
--

CREATE TYPE "auth"."oauth_authorization_status" AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);
ALTER TYPE "auth"."oauth_authorization_status" OWNER TO "supabase_admin";

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_admin
--

CREATE FUNCTION "auth"."email"() RETURNS text
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;
ALTER FUNCTION "auth"."email"() OWNER TO "supabase_admin";

--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_admin
--

CREATE FUNCTION "auth"."jwt"() RETURNS jsonb
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;
ALTER FUNCTION "auth"."jwt"() OWNER TO "supabase_admin";

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_admin
--

CREATE FUNCTION "auth"."role"() RETURNS text
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;
ALTER FUNCTION "auth"."role"() OWNER TO "supabase_admin";

--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_admin
--

CREATE FUNCTION "auth"."uid"() RETURNS uuid
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;
ALTER FUNCTION "auth"."uid"() OWNER TO "supabase_admin";

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."extension"("name" text) RETURNS text
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END;
$$;
ALTER FUNCTION "storage"."extension"("name" text) OWNER TO "supabase_admin";

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."filename"("name" text) RETURNS text
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END;
$$;
ALTER FUNCTION "storage"."filename"("name" text) OWNER TO "supabase_admin";

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."foldername"("name" text) RETURNS text[]
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;
ALTER FUNCTION "storage"."foldername"("name" text) OWNER TO "supabase_admin";

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" text)
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;
ALTER FUNCTION "storage"."get_size_by_bucket"() OWNER TO "supabase_admin";

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."search"("prefix" text, "bucketname" text, "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" text DEFAULT ''::text, "sortcolumn" text DEFAULT 'name'::text, "sortorder" text DEFAULT 'asc'::text) RETURNS TABLE("name" text, "id" uuid, "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" jsonb)
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := "storage"."get_common_prefix"(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim("storage"."get_common_prefix"(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := "storage"."get_common_prefix"(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$$;
ALTER FUNCTION "storage"."search"("prefix" text, "bucketname" text, "limits" integer, "levels" integer, "offsets" integer, "search" text, "sortcolumn" text, "sortorder" text) OWNER TO "supabase_admin";

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS trigger
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;
ALTER FUNCTION "storage"."update_updated_at_column"() OWNER TO "supabase_admin";

--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."get_common_prefix"("name" text, "prefix" text, "delimiter" text) RETURNS text
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
DECLARE
    v_first_delimiter_pos INT;
BEGIN
    v_first_delimiter_pos := instr("name", "delimiter", length("prefix") + 1);
    IF v_first_delimiter_pos > 0 THEN
        RETURN left("name", v_first_delimiter_pos);
    ELSE
        RETURN NULL;
    END IF;
END;
$$;
ALTER FUNCTION "storage"."get_common_prefix"("name" text, "prefix" text, "delimiter" text) OWNER TO "supabase_admin";

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" text, "prefix_param" text, "delimiter_param" text, "max_keys" integer DEFAULT 100, "start_after" text DEFAULT ''::text, "next_token" text DEFAULT ''::text, "sort_order" text DEFAULT 'asc'::text) RETURNS TABLE("name" text, "id" uuid, "metadata" jsonb, "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := coalesce(delimiter_param, '/');

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(max_keys, 100), 1000);
    v_prefix := coalesce(prefix_param, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initial seek position
    IF next_token <> '' THEN
        v_next_seek := lower(next_token);
        IF NOT v_is_asc THEN
             -- Seek position is the exclusive upper bound for DESC, so no modification needed
        ELSIF v_next_seek = lower(start_after) THEN
             -- If we are at start_after, skip it in ASC
             v_next_seek := v_next_seek || v_delimiter;
        END IF;
    ELSIF start_after <> '' THEN
        v_next_seek := lower(start_after);
        IF v_is_asc THEN
            v_next_seek := v_next_seek || v_delimiter;
        END IF;
    ELSE
        IF v_is_asc THEN
            v_next_seek := v_prefix_lower;
        ELSE
             -- DESC: find the last item in range (static SQL)
             IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
             ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
             END IF;

             IF v_peek_name IS NOT NULL THEN
                v_next_seek := lower(v_peek_name) || v_delimiter;
             ELSE
                RETURN;
             END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = _bucket_id AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check FOLDER or FILE
        v_common_prefix := "storage"."get_common_prefix"(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER
            name := v_common_prefix;
            id := NULL;
            metadata := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch
            FOR v_current IN EXECUTE v_batch_query
                USING _bucket_id, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := "storage"."get_common_prefix"(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                metadata := v_current.metadata;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$$;
ALTER FUNCTION "storage"."list_objects_with_delimiter"("_bucket_id" text, "prefix_param" text, "delimiter_param" text, "max_keys" integer, "start_after" text, "next_token" text, "sort_order" text) OWNER TO "supabase_admin";

--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_admin
--

CREATE FUNCTION "storage"."search_v2"("prefix" text, "bucket_name" text, "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "start_after" text DEFAULT ''::text, "sort_order" text DEFAULT 'asc'::text, "sort_column" text DEFAULT 'name'::text, "sort_column_after" text DEFAULT ''::text) RETURNS TABLE("key" text, "name" text, "id" uuid, "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" jsonb)
    LANGUAGE "plpgsql" STABLE
    AS $$
DECLARE
    v_limit INT;
    v_sort_column TEXT;
    v_sort_order TEXT;
BEGIN
    -- Validation
    v_limit := LEAST(COALESCE(limits, 100), 1000);
    v_sort_column := LOWER(COALESCE(sort_column, 'name'));
    v_sort_order := LOWER(COALESCE(sort_order, 'asc'));

    IF v_sort_column = 'name' THEN
        RETURN QUERY
        SELECT
            "storage"."filename"(s.name) AS key,
            s.name, s.id, s.updated_at, s.created_at, s.last_accessed_at, s.metadata
        FROM "storage"."list_objects_with_delimiter"(bucket_name, prefix, '/', v_limit, start_after, '', v_sort_order) s;
    ELSE
        -- Time-based sorting: less efficient but necessary for some UIs
        RETURN QUERY EXECUTE format(
            $sql$
            WITH all_items AS (
                -- Files
                SELECT
                    "storage"."filename"(o.name) AS key,
                    o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata
                FROM storage.objects o
                WHERE o.bucket_id = $1
                  AND o.name LIKE $2 || '%%'
                  AND array_length(string_to_array(o.name, '/'), 1) = $3

                UNION ALL

                -- Folders (Common Prefixes)
                SELECT
                    DISTINCT ON (folder_path)
                    reverse(split_part(reverse(rtrim(folder_path, '/')), '/', 1)) AS key,
                    folder_path AS name,
                    NULL::uuid AS id,
                    NULL::timestamptz AS updated_at,
                    NULL::timestamptz AS created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM (
                    SELECT
                        substring(o.name from 1 for (instr(o.name, '/', length($2) + 1))) AS folder_path
                    FROM storage.objects o
                    WHERE o.bucket_id = $1
                      AND o.name LIKE $2 || '%%'
                      AND instr(o.name, '/', length($2) + 1) > 0
                ) sub
                WHERE folder_path IS NOT NULL
            )
            SELECT * FROM all_items
            ORDER BY %I %s
            LIMIT $4
            $sql$, v_sort_column, v_sort_order
        ) USING bucket_name, prefix, levels, v_limit;
    END IF;
END;
$$;
ALTER FUNCTION "storage"."search_v2"("prefix" text, "bucket_name" text, "limits" integer, "levels" integer, "start_after" text, "sort_order" text, "sort_column" text, "sort_column_after" text) OWNER TO "supabase_admin";


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."handle_new_user"() RETURNS trigger
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role, plan)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'user'::user_role),
    coalesce(new.raw_user_meta_data->>'plan', 'TIER_0')
  );
  return new;
end;
$$;
ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."update_updated_at_column"() RETURNS trigger
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;
ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

--
-- Name: regexp_split_to_array(citext, citext, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") RETURNS text[]
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $_$ SELECT pg_catalog.regexp_split_to_array($1::pg_catalog.text, $2::pg_catalog.text, $3); $_$;
ALTER FUNCTION "public"."regexp_split_to_array"("public"."citext", "public"."citext", "text") OWNER TO "postgres";

--
-- Name: toggle_user_confirmation(uuid, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION "public"."toggle_user_confirmation"("user_id" uuid, "confirmed" boolean) RETURNS void
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.profiles
  SET email_confirmed = confirmed
  WHERE id = user_id;
END;
$$;
ALTER FUNCTION "public"."toggle_user_confirmation"("user_id" uuid, "confirmed" boolean) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_errors; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."audit_log_errors" (
    "instance_id" uuid,
    "id" uuid NOT NULL,
    "payload" jsonb,
    "created_at" timestamp with time zone,
    CONSTRAINT "audit_log_errors_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."audit_log_errors" OWNER TO "supabase_admin";

--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."flow_state" (
    "id" uuid NOT NULL,
    "instance_id" uuid,
    "entity_id" uuid,
    "auth_code" text NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" text NOT NULL,
    "provider_type" text NOT NULL,
    "provider_access_token" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" text NOT NULL,
    "auth_code_issued_at" timestamp with time zone,
    CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."flow_state" OWNER TO "supabase_admin";

--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."identities" (
    "provider_id" text NOT NULL,
    "user_id" uuid NOT NULL,
    "identity_data" jsonb NOT NULL,
    "provider" text NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" text GENERATED ALWAYS AS (lower(("identity_data" ->> 'email'::text))) STORED,
    "id" uuid DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    CONSTRAINT "identities_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."identities" OWNER TO "supabase_admin";

--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."instances" (
    "id" uuid NOT NULL,
    "uuid" uuid,
    "raw_base_config" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "tertiary_id" uuid,
    CONSTRAINT "instances_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."instances" OWNER TO "supabase_admin";

--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" text NOT NULL,
    "id" uuid NOT NULL,
    CONSTRAINT "mfa_amr_claims_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."mfa_amr_claims" OWNER TO "supabase_admin";

--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" uuid NOT NULL,
    "factor_id" uuid NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" inet NOT NULL,
    "otp_code" text,
    CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."mfa_challenges" OWNER TO "supabase_admin";

--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."mfa_factors" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "friendly_name" text,
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" text,
    "phone" text,
    "last_challenged_at" timestamp with time zone,
    CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."mfa_factors" OWNER TO "supabase_admin";

--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" text NOT NULL,
    "relates_to" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "one_time_tokens_relates_to_check" CHECK (("char_length"("relates_to") > 0)),
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);
ALTER TABLE "auth"."one_time_tokens" OWNER TO "supabase_admin";

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_admin
--

CREATE SEQUENCE IF NOT EXISTS "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE "auth"."refresh_tokens_id_seq" OWNER TO "supabase_admin";

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" uuid,
    "id" bigint DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass") NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" uuid,
    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."refresh_tokens" OWNER TO "supabase_admin";

--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."saml_providers" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "entity_id" text NOT NULL,
    "metadata_xml" text NOT NULL,
    "metadata_url" text,
    "attribute_mapping" jsonb,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" text,
    CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id"),
    CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."saml_providers" OWNER TO "supabase_admin";

--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "request_id" text NOT NULL,
    "for_email" text,
    "redirect_to" text,
    "from_ip_address" inet,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" uuid,
    CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."saml_relay_states" OWNER TO "supabase_admin";

--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."sessions" (
    "id" uuid NOT NULL,
    "user_id" uuid NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" uuid,
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp with time zone,
    "user_agent" text,
    "ip" inet,
    "tag" text,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."sessions" OWNER TO "supabase_admin";

--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."sso_domains" (
    "id" uuid NOT NULL,
    "sso_provider_id" uuid NOT NULL,
    "domain" text NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "sso_domains_domain_check" CHECK (("char_length"("domain") > 0)),
    CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."sso_domains" OWNER TO "supabase_admin";

--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."sso_providers" (
    "id" uuid NOT NULL,
    "resource_id" text,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "sso_providers_resource_id_check" CHECK (("char_length"("resource_id") > 0))
);
ALTER TABLE "auth"."sso_providers" OWNER TO "supabase_admin";

--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_admin
--

CREATE TABLE "auth"."users" (
    "instance_id" uuid,
    "id" uuid NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" jsonb,
    "raw_user_meta_data" jsonb,
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" text DEFAULT NULL::text,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" text DEFAULT ''::text,
    "phone_change_token" text DEFAULT ''::text,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" text DEFAULT ''::text,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" text DEFAULT ''::text,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2))),
    CONSTRAINT "users_email_key" UNIQUE ("email"),
    CONSTRAINT "users_phone_key" UNIQUE ("phone"),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "auth"."users" OWNER TO "supabase_admin";

--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_admin
--

CREATE TABLE "storage"."buckets" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "owner" uuid,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autoprocessing" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" text[],
    "owner_id" text,
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype",
    CONSTRAINT "buckets_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "storage"."buckets" OWNER TO "supabase_admin";

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_admin
--

CREATE TABLE "storage"."objects" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" text,
    "name" text,
    "owner" uuid,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" jsonb,
    "path_tokens" text[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::text)) STORED,
    "version" text,
    "owner_id" text,
    "user_metadata" jsonb,
    CONSTRAINT "objects_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "storage"."objects" OWNER TO "supabase_admin";

--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_admin
--

CREATE TABLE "storage"."buckets_vectors" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "owner" uuid,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autoprocessing" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" text[],
    "owner_id" text,
    "type" "storage"."buckettype" DEFAULT 'STANDARD'::"storage"."buckettype",
    "embedding" "extensions"."vector"(1536),
    CONSTRAINT "buckets_vectors_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "storage"."buckets_vectors" OWNER TO "supabase_admin";

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_admin
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT "CURRENT_TIMESTAMP",
    CONSTRAINT "migrations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "migrations_name_key" UNIQUE ("name")
);
ALTER TABLE "storage"."migrations" OWNER TO "supabase_admin";

--
-- Name: checklist_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."checklist_category" AS ENUM (
    'arrival',
    'departure',
    'maintenance',
    'inventory',
    'cleaning'
);
ALTER TYPE "public"."checklist_category" OWNER TO "postgres";

--
-- Name: checklist_tier; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."checklist_tier" AS ENUM (
    'standard',
    'premium',
    'luxury'
);
ALTER TYPE "public"."checklist_tier" OWNER TO "postgres";

--
-- Name: maintenance_ticket_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."maintenance_ticket_status" AS ENUM (
    'pending',
    'in_progress',
    'resolved',
    'cancelled'
);
ALTER TYPE "public"."maintenance_ticket_status" OWNER TO "postgres";

--
-- Name: maintenance_ticket_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."maintenance_ticket_priority" AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);
ALTER TYPE "public"."maintenance_ticket_priority" OWNER TO "postgres";

--
-- Name: renovation_room_finish_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE "public"."renovation_room_finish_level" AS ENUM (
    'standard',
    'premium',
    'luxury'
);
ALTER TYPE "public"."renovation_room_finish_level" OWNER TO "postgres";

--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."profiles" (
    "id" uuid NOT NULL,
    "email" "public"."citext",
    "full_name" text,
    "avatar_url" text,
    "role" "public"."user_role" DEFAULT 'user'::"public"."user_role",
    "plan" text DEFAULT 'TIER_0'::text,
    "stripe_customer_id" text,
    "subscription_status" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "email_confirmed" boolean DEFAULT false,
    "language" text DEFAULT 'fr'::text,
    CONSTRAINT "profiles_email_key" UNIQUE ("email"),
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."profiles" OWNER TO "postgres";

--
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."properties" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" uuid NOT NULL,
    "name" text NOT NULL,
    "listing_title" text,
    "listing_description" text,
    "cover_image_url" text,
    "address" text,
    "ical_url" text,
    "cleaning_contact_info" text,
    "wifi_code" text,
    "arrival_instructions" text,
    "house_rules_text" text,
    "emergency_contact_info" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."properties" OWNER TO "postgres";

--
-- Name: diagnostic_reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."diagnostic_reports" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "property_id" uuid NOT NULL,
    "report_data" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "diagnostic_reports_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."diagnostic_reports" OWNER TO "postgres";

--
-- Name: onboarding_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."onboarding_answers" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "property_id" uuid NOT NULL,
    "question_id" uuid NOT NULL,
    "answer" boolean NOT NULL,
    "sub_answer" text,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "onboarding_answers_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."onboarding_answers" OWNER TO "postgres";

--
-- Name: dimensions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."dimensions" (
    "id" text NOT NULL,
    "name" text,
    "description" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "dimensions_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."dimensions" OWNER TO "postgres";

--
-- Name: phases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."phases" (
    "id" text NOT NULL,
    "name" text,
    "sort_order" integer,
    "description" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."phases" OWNER TO "postgres";

--
-- Name: onboarding_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."onboarding_questions" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "question_key" text NOT NULL,
    "level" text,
    "order_index" integer,
    "has_sub_question" boolean DEFAULT false,
    "sub_question_config" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "dimension_id" text,
    CONSTRAINT "onboarding_questions_level_check" CHECK (("level" = ANY (ARRAY['Bronze'::text, 'Silver'::text, 'Gold'::text]))),
    CONSTRAINT "onboarding_questions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "onboarding_questions_question_key_key" UNIQUE ("question_key")
);
ALTER TABLE "public"."onboarding_questions" OWNER TO "postgres";

--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."features" (
    "id" text NOT NULL,
    "parent_feature_id" text,
    "dimension_id" text,
    "phase_id" text,
    "name" text,
    "description" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "detailed_description" text,
    "dev_prompt" text,
    "scope" text,
    "behavior_matrix" text,
    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."features" OWNER TO "postgres";

--
-- Name: feature_configurations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."feature_configurations" (
    "config_id" integer NOT NULL,
    "feature_id" text,
    "tier_id" text,
    "country_code" text,
    "config_value" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "feature_configurations_pkey" PRIMARY KEY ("config_id")
);
ALTER TABLE "public"."feature_configurations" OWNER TO "postgres";

--
-- Name: app_tiers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."app_tiers" (
    "tier_id" text NOT NULL,
    "name" text,
    "rank_order" integer,
    "description" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "app_tiers_pkey" PRIMARY KEY ("tier_id")
);
ALTER TABLE "public"."app_tiers" OWNER TO "postgres";

--
-- Name: app_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."app_plans" (
    "plan_id" text NOT NULL,
    "name" text,
    "tier_id" text,
    "price_monthly" numeric,
    "price_yearly" numeric,
    "currency" text DEFAULT 'EUR'::text,
    "stripe_price_id_monthly" text,
    "stripe_price_id_yearly" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "app_plans_pkey" PRIMARY KEY ("plan_id")
);
ALTER TABLE "public"."app_plans" OWNER TO "postgres";

--
-- Name: maintenance_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."maintenance_tickets" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "reporter_id" uuid NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "status" "public"."maintenance_ticket_status" DEFAULT 'pending'::"public"."maintenance_ticket_status",
    "priority" "public"."maintenance_ticket_priority" DEFAULT 'medium'::"public"."maintenance_ticket_priority",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "resolved_at" timestamp with time zone,
    "metadata" jsonb,
    CONSTRAINT "maintenance_tickets_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."maintenance_tickets" OWNER TO "postgres";

--
-- Name: maintenance_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."maintenance_tasks" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "ticket_id" uuid NOT NULL,
    "title" text NOT NULL,
    "description" text,
    "is_completed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "maintenance_tasks_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."maintenance_tasks" OWNER TO "postgres";

--
-- Name: checklists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."checklists" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "category" "public"."checklist_category" NOT NULL,
    "tier" "public"."checklist_tier" DEFAULT 'standard'::"public"."checklist_tier",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."checklists" OWNER TO "postgres";

--
-- Name: property_checklists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."property_checklists" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "checklist_id" uuid NOT NULL,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "property_checklists_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."property_checklists" OWNER TO "postgres";

--
-- Name: checklist_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."checklist_items" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "checklist_id" uuid NOT NULL,
    "task" text NOT NULL,
    "order_index" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "checklist_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."checklist_items" OWNER TO "postgres";

--
-- Name: renovation_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."renovation_rooms" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "name" text NOT NULL,
    "room_type" text NOT NULL,
    "surface_area" numeric,
    "finish_level" "public"."renovation_room_finish_level" DEFAULT 'standard'::"public"."renovation_room_finish_level",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "renovation_rooms_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."renovation_rooms" OWNER TO "postgres";

--
-- Name: room_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."room_materials" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" uuid NOT NULL,
    "material_name" text NOT NULL,
    "quantity" numeric,
    "unit" text,
    "unit_price" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "room_materials_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."room_materials" OWNER TO "postgres";

--
-- Name: material_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."material_categories" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "material_categories_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."material_categories" OWNER TO "postgres";

--
-- Name: material_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."material_options" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "category_id" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "price_per_unit" numeric,
    "unit" text,
    "image_url" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "material_options_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."material_options" OWNER TO "postgres";

--
-- Name: room_item_selections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."room_item_selections" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" uuid NOT NULL,
    "material_option_id" uuid NOT NULL,
    "quantity" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "room_item_selections_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."room_item_selections" OWNER TO "postgres";

--
-- Name: reservation_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."reservation_stats" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "date" date NOT NULL,
    "occupancy_rate" numeric,
    "revpar" numeric,
    "adr" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reservation_stats_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."reservation_stats" OWNER TO "postgres";

--
-- Name: property_inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."property_inventory_items" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "name" text NOT NULL,
    "quantity" integer DEFAULT 1,
    "status" text,
    "last_checked_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "property_inventory_items_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."property_inventory_items" OWNER TO "postgres";

--
-- Name: external_api_configurations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."external_api_configurations" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" uuid NOT NULL,
    "provider_name" text NOT NULL,
    "api_key" text,
    "api_secret" text,
    "metadata" jsonb,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "external_api_configurations_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."external_api_configurations" OWNER TO "postgres";

--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."api_keys" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "key_hash" text NOT NULL,
    "name" text,
    "scopes" text[],
    "expires_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_used_at" timestamp with time zone,
    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."api_keys" OWNER TO "postgres";

--
-- Name: checkout_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."checkout_sessions" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "status" text,
    "stripe_session_id" text,
    "amount_total" integer,
    "currency" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    CONSTRAINT "checkout_sessions_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."checkout_sessions" OWNER TO "postgres";

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."messages" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "content" text NOT NULL,
    "role" text DEFAULT 'user'::text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "room_id" uuid,
    "metadata" jsonb,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."messages" OWNER TO "postgres";

--
-- Name: message_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."message_rooms" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "title" text,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "created_by" uuid,
    "is_active" boolean DEFAULT true,
    CONSTRAINT "message_rooms_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."message_rooms" OWNER TO "postgres";

--
-- Name: user_room_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."user_room_metadata" (
    "user_id" uuid NOT NULL,
    "room_id" uuid NOT NULL,
    "last_read_at" timestamp with time zone DEFAULT "now"(),
    "is_muted" boolean DEFAULT false,
    CONSTRAINT "user_room_metadata_pkey" PRIMARY KEY ("user_id", "room_id")
);
ALTER TABLE "public"."user_room_metadata" OWNER TO "postgres";

--
-- Name: feedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."feedback" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid,
    "type" text NOT NULL,
    "content" text NOT NULL,
    "rating" integer,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."feedback" OWNER TO "postgres";

--
-- Name: activity_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."activity_log" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid,
    "action" text NOT NULL,
    "entity_type" text,
    "entity_id" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "activity_log_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."activity_log" OWNER TO "postgres";

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."notifications" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" uuid NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "type" text,
    "is_read" boolean DEFAULT false,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."notifications" OWNER TO "postgres";

--
-- Name: chat_contexts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."chat_contexts" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" uuid NOT NULL,
    "context_data" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "chat_contexts_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "public"."chat_contexts" OWNER TO "postgres";

--
-- Name: project_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "public"."project_metadata" (
    "id" uuid DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" text NOT NULL,
    "metadata" jsonb,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "project_metadata_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "project_metadata_project_id_key" UNIQUE ("project_id")
);
ALTER TABLE "public"."project_metadata" OWNER TO "postgres";

--
-- Name: dimension_features; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW "public"."dimension_features" AS
 SELECT f.id AS feature_id,
    f.name AS feature_name,
    d.id AS dimension_id,
    d.name AS dimension_name
   FROM ("public"."features" f
     JOIN "public"."dimensions" d ON ((f.dimension_id = d.id)));
ALTER VIEW "public"."dimension_features" OWNER TO "postgres";

--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_admin
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "email");

--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_admin
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");

--
-- Name: objects_bucket_id_name_idx; Type: INDEX; Schema: storage; Owner: supabase_admin
--

CREATE INDEX "objects_bucket_id_name_idx" ON "storage"."objects" USING "btree" ("bucket_id", "name");

--
-- Name: profiles_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "profiles_email_idx" ON "public"."profiles" USING "btree" ("email");

--
-- Name: properties_owner_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "properties_owner_id_idx" ON "public"."properties" USING "btree" ("owner_id");

--
-- Name: on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_admin
--

CREATE TRIGGER "on_auth_user_created" AFTER INSERT ON "auth"."users" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_user"();

--
-- Name: update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_properties_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_properties_updated_at" BEFORE UPDATE ON "public"."properties" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_maintenance_tickets_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_maintenance_tickets_updated_at" BEFORE UPDATE ON "public"."maintenance_tickets" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_maintenance_tasks_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_maintenance_tasks_updated_at" BEFORE UPDATE ON "public"."maintenance_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_checklists_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_checklists_updated_at" BEFORE UPDATE ON "public"."checklists" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_property_checklists_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_property_checklists_updated_at" BEFORE UPDATE ON "public"."property_checklists" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_checklist_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_checklist_items_updated_at" BEFORE UPDATE ON "public"."checklist_items" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_renovation_rooms_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_renovation_rooms_updated_at" BEFORE UPDATE ON "public"."renovation_rooms" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_room_materials_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_room_materials_updated_at" BEFORE UPDATE ON "public"."room_materials" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_room_item_selections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_room_item_selections_updated_at" BEFORE UPDATE ON "public"."room_item_selections" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_property_inventory_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_property_inventory_items_updated_at" BEFORE UPDATE ON "public"."property_inventory_items" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_external_api_configurations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_external_api_configurations_updated_at" BEFORE UPDATE ON "public"."external_api_configurations" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_chat_contexts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_chat_contexts_updated_at" BEFORE UPDATE ON "public"."chat_contexts" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: update_project_metadata_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "update_project_metadata_updated_at" BEFORE UPDATE ON "public"."project_metadata" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();

--
-- Name: profiles; Type: ROW LEVEL SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles_read_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "profiles_read_policy" ON "public"."profiles" FOR SELECT USING (true);

--
-- Name: profiles_update_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "profiles_update_policy" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

--
-- Name: properties; Type: ROW LEVEL SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;

--
-- Name: properties_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "properties_all_policy" ON "public"."properties" TO "authenticated" USING (("auth"."uid"() = "owner_id")) WITH CHECK (("auth"."uid"() = "owner_id"));

--
-- Name: diagnostic_reports; Type: ROW LEVEL SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE "public"."diagnostic_reports" ENABLE ROW LEVEL SECURITY;

--
-- Name: diagnostic_reports_all_policy; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "diagnostic_reports_all_policy" ON "public"."diagnostic_reports" TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));

--
-- Name: objects; Type: ROW LEVEL SECURITY; Schema: storage; Owner: supabase_admin
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW LEVEL SECURITY; Schema: storage; Owner: supabase_admin
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: properties_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: diagnostic_reports_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."diagnostic_reports"
    ADD CONSTRAINT "diagnostic_reports_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: diagnostic_reports_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."diagnostic_reports"
    ADD CONSTRAINT "diagnostic_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: onboarding_answers_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."onboarding_answers"
    ADD CONSTRAINT "onboarding_answers_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: onboarding_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."onboarding_answers"
    ADD CONSTRAINT "onboarding_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."onboarding_questions"("id") ON DELETE CASCADE;

--
-- Name: onboarding_answers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."onboarding_answers"
    ADD CONSTRAINT "onboarding_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: maintenance_tickets_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."maintenance_tickets"
    ADD CONSTRAINT "maintenance_tickets_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: maintenance_tickets_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."maintenance_tickets"
    ADD CONSTRAINT "maintenance_tickets_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: maintenance_tasks_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."maintenance_tasks"
    ADD CONSTRAINT "maintenance_tasks_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "public"."maintenance_tickets"("id") ON DELETE CASCADE;

--
-- Name: property_checklists_checklist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_checklists"
    ADD CONSTRAINT "property_checklists_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE CASCADE;

--
-- Name: property_checklists_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_checklists"
    ADD CONSTRAINT "property_checklists_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: checklist_items_checklist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."checklist_items"
    ADD CONSTRAINT "checklist_items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE CASCADE;

--
-- Name: renovation_rooms_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."renovation_rooms"
    ADD CONSTRAINT "renovation_rooms_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: room_materials_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."room_materials"
    ADD CONSTRAINT "room_materials_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."renovation_rooms"("id") ON DELETE CASCADE;

--
-- Name: room_item_selections_material_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."room_item_selections"
    ADD CONSTRAINT "room_item_selections_material_option_id_fkey" FOREIGN KEY ("material_option_id") REFERENCES "public"."material_options"("id") ON DELETE CASCADE;

--
-- Name: room_item_selections_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."room_item_selections"
    ADD CONSTRAINT "room_item_selections_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."renovation_rooms"("id") ON DELETE CASCADE;

--
-- Name: reservation_stats_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."reservation_stats"
    ADD CONSTRAINT "reservation_stats_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: property_inventory_items_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."property_inventory_items"
    ADD CONSTRAINT "property_inventory_items_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: external_api_configurations_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."external_api_configurations"
    ADD CONSTRAINT "external_api_configurations_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;

--
-- Name: messages_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."message_rooms"("id") ON DELETE CASCADE;

--
-- Name: messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: user_room_metadata_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."user_room_metadata"
    ADD CONSTRAINT "user_room_metadata_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."message_rooms"("id") ON DELETE CASCADE;

--
-- Name: user_room_metadata_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."user_room_metadata"
    ADD CONSTRAINT "user_room_metadata_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

--
-- Name: chat_contexts_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "public"."chat_contexts"
    ADD CONSTRAINT "chat_contexts_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."message_rooms"("id") ON DELETE CASCADE;
