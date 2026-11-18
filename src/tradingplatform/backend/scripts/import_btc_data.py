import pandas as pd
from sqlalchemy import create_engine, text
import sys
from pathlib import Path

# Allow running this file directly while keeping package-style imports.
SRC_ROOT = Path(__file__).resolve().parents[3]
if str(SRC_ROOT) not in sys.path:
    sys.path.append(str(SRC_ROOT))

from tradingplatform.backend.database import engine

# Read CSV
df = pd.read_csv("docs/BTCUSD_1.csv")

# Make column names lowercase
df.columns = df.columns.str.lower()

# Convert Unix timestamp (seconds) to UTC datetime
df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    unit="s",
    utc=True
)

# Add the timeframe
df["timeframe"] = "1m"


# Get the BTC instrument ID
with engine.connect() as connection:
    result = connection.execute(
        text("""
            SELECT id
            FROM instruments
            WHERE symbol = 'BTC'
        """)
    )

    btc_id = result.scalar_one()

# Add instrument ID to every row
df["instrument_id"] = btc_id


# Keep only the columns needed by PostgreSQL
df = df[
    [
        "instrument_id",
        "timeframe",
        "timestamp",
        "open",
        "high",
        "low",
        "close",
        "volume"
    ]
]


# Insert into PostgreSQL
df.to_sql(
    "candles",
    engine,
    if_exists="append",
    index=False,
    method="multi"
)

print(f"Successfully imported {len(df)} BTC 1-minute candles.")