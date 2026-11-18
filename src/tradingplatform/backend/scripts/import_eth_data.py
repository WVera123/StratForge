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
# The CSV has no header and contains:
# timestamp, open, high, low, close, volume, trades
df = pd.read_csv(
    "docs/ETHUSD_1.csv",
    header=None
)

# Add column names
df.columns = [
    "timestamp",
    "open",
    "high",
    "low",
    "close",
    "volume",
    "trades"
]

# Convert Unix timestamp (seconds) to UTC datetime
df["timestamp"] = pd.to_datetime(
    df["timestamp"],
    unit="s",
    utc=True
)

# Add the timeframe
df["timeframe"] = "1m"


# Get the ETH instrument ID
with engine.connect() as connection:
    result = connection.execute(
        text("""
            SELECT id
            FROM instruments
            WHERE symbol = 'ETH'
        """)
    )

    eth_id = result.scalar_one()

# Add instrument ID to every row
df["instrument_id"] = eth_id


# Keep only the columns needed by PostgreSQL
# The trades column is intentionally left out
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

print(f"Successfully imported {len(df)} ETH 1-minute candles.")