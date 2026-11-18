from sqlalchemy import text

from database import engine

DIRECT_QUERY = text(
    """
    SELECT
        timestamp,
        timeframe,
        open,
        high,
        low,
        close,
        volume
    FROM candles
    WHERE instrument_id = :instrument_id
      AND timeframe = :timeframe
      AND timestamp >= :start_date
      AND timestamp < :end_date
    ORDER BY timestamp ASC
    """
)

LATEST_TIMESTAMP_QUERY = text(
    """
    SELECT MAX(timestamp) AS latest_timestamp
    FROM candles
    WHERE instrument_id = :instrument_id
      AND timeframe = :timeframe
    """
)

LATEST_CANDLES_QUERY = text(
    """
    SELECT
        timestamp,
        timeframe,
        open,
        high,
        low,
        close,
        volume
    FROM candles
    WHERE instrument_id = :instrument_id
      AND timeframe = :timeframe
    ORDER BY timestamp DESC
    LIMIT :limit
    """
)

SQL_AGGREGATED_QUERY = text(
    """
    WITH buckets AS (
        SELECT
            date_trunc(
                :bucket,
                timestamp AT TIME ZONE 'UTC'
            ) AT TIME ZONE 'UTC' AS bucket,

            timestamp,
            open,
            high,
            low,
            close,
            volume

        FROM candles

        WHERE instrument_id = :instrument_id
          AND timeframe = '1m'
          AND timestamp >= :start_date
          AND timestamp < :end_date
    )

    SELECT
        bucket AS timestamp,

        (
            array_agg(
                open
                ORDER BY timestamp ASC
            )
        )[1] AS open,

        MAX(high) AS high,

        MIN(low) AS low,

        (
            array_agg(
                close
                ORDER BY timestamp DESC
            )
        )[1] AS close,

        SUM(volume) AS volume

    FROM buckets

    GROUP BY bucket

    ORDER BY bucket ASC
    """
)


def get_candles_by_range(
    instrument_id: int,
    timeframe: str,
    start_date,
    end_date,
):
    """
    Retrieve candles already stored at the requested timeframe
    within the specified date range.
    """

    with engine.connect() as connection:

        result = connection.execute(
            DIRECT_QUERY,
            {
                "instrument_id": instrument_id,
                "timeframe": timeframe,
                "start_date": start_date,
                "end_date": end_date,
            },
        )

        return result.fetchall()


def get_latest_candles(
    instrument_id: int,
    timeframe: str,
    limit: int,
):
    """
    Retrieve the latest existing candles.

    The database returns newest first for efficient indexed
    retrieval. We reverse the result so the frontend receives
    chronological ascending data.
    """

    with engine.connect() as connection:

        result = connection.execute(
            LATEST_CANDLES_QUERY,
            {
                "instrument_id": instrument_id,
                "timeframe": timeframe,
                "limit": limit,
            },
        )

        rows = result.fetchall()

    rows.reverse()

    return rows


def get_latest_timestamp(
    instrument_id: int,
    timeframe: str,
):
    """
    Return the latest timestamp that actually exists in the DB.
    """

    with engine.connect() as connection:

        result = connection.execute(
            LATEST_TIMESTAMP_QUERY,
            {
                "instrument_id": instrument_id,
                "timeframe": timeframe,
            },
        )

        row = result.fetchone()

    if row is None:
        return None

    return row.latest_timestamp


def get_sql_aggregated_candles(
    instrument_id: int,
    timeframe: str,
    start_date,
    end_date,
):
    """
    Retrieve 1m candles and aggregate them inside PostgreSQL.
    """

    bucket_mapping = {
        "1h": "hour",
        "1d": "day",
    }

    if timeframe not in bucket_mapping:
        raise ValueError(
            "SQL aggregation is only available for 1h and 1d"
        )

    bucket = bucket_mapping[timeframe]

    with engine.connect() as connection:

        result = connection.execute(
            SQL_AGGREGATED_QUERY,
            {
                "instrument_id": instrument_id,
                "bucket": bucket,
                "start_date": start_date,
                "end_date": end_date,
            },
        )

        return result.fetchall()