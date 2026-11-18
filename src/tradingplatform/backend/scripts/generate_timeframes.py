import sys
from pathlib import Path

from sqlalchemy import text

# Allow running this file directly while keeping package-style imports.
SRC_ROOT = Path(__file__).resolve().parents[3]
if str(SRC_ROOT) not in sys.path:
    sys.path.append(str(SRC_ROOT))

from tradingplatform.backend.database import engine

TARGET_TIMEFRAMES = {
    "1h": "hour",
    "1d": "day",
}

def generate_timeframe(timeframe: str, trunc_unit: str):
    """
    Generate a higher timeframe from existing 1-minute candles.

    Example:
        1m -> 1h
        1m -> 1d

    The generated candles are stored in the same candles table.
    """

    print(f"Generating {timeframe} candles...")

    query = text(f"""
        INSERT INTO candles (
            instrument_id,
            timeframe,
            timestamp,
            open,
            high,
            low,
            close,
            volume
        )

        SELECT
            instrument_id,
            :timeframe AS timeframe,

            date_trunc(
                '{trunc_unit}',
                timestamp
            ) AS timestamp,

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

        FROM candles

        WHERE timeframe = '1m'

        GROUP BY
            instrument_id,
            date_trunc(
                '{trunc_unit}',
                timestamp
            )

        ON CONFLICT (
            instrument_id,
            timeframe,
            timestamp
        )

        DO UPDATE SET
            open = EXCLUDED.open,
            high = EXCLUDED.high,
            low = EXCLUDED.low,
            close = EXCLUDED.close,
            volume = EXCLUDED.volume
    """)

    with engine.begin() as connection:

        result = connection.execute(
            query,
            {
                "timeframe": timeframe
            }
        )

    print(
        f"Finished {timeframe}: "
        f"{result.rowcount} rows inserted/updated."
    )


def main():

    print("Starting candle timeframe generation...")
    print("Source timeframe: 1m")
    print("Target timeframes: 1h, 1d")
    print()

    for timeframe, trunc_unit in TARGET_TIMEFRAMES.items():

        generate_timeframe(
            timeframe=timeframe,
            trunc_unit=trunc_unit
        )

    print()
    print("All timeframes generated successfully.")


if __name__ == "__main__":
    main()