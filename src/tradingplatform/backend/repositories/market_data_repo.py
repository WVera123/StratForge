from datetime import date, datetime, timedelta
from sqlalchemy import text
from database import engine

SUPPORTED_TIMEFRAMES = {
    "1m",
    "1h",
    "1d",
}

class MarketDataRepository:
    def get_currencies(self):
        query = text("""
            SELECT id, symbol, base_asset, quote_asset
            FROM instruments ORDER BY id
        """)
        with engine.connect() as connection:
            result = connection.execute(query)
            return [
                {
                    "id": row.id,
                    "symbol": row.symbol,
                    "base_asset": row.base_asset,
                    "quote_asset": row.quote_asset
                }
                for row in result
            ]

    def get_market_data_one_currency(self, crypto: int, timeframe: str, start_date=None, end_date=None, limit: int | None = None):
        if timeframe not in SUPPORTED_TIMEFRAMES:
            raise ValueError("Unsupported timeframe. Use 1m, 1h or 1d.")

        parameters = {"crypto": crypto, "timeframe": timeframe}

        if start_date is not None:
            if isinstance(start_date, str) and len(start_date) == 10:
                parameters["start_date"] = datetime.strptime(start_date, "%Y-%m-%d")
            else:
                parameters["start_date"] = start_date

        if end_date is not None:
            if isinstance(end_date, str) and len(end_date) == 10:
                end_date_exclusive = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            elif isinstance(end_date, date) and not isinstance(end_date, datetime):
                end_date_exclusive = end_date + timedelta(days=1)
            else:
                end_date_exclusive = end_date
            parameters["end_date_exclusive"] = end_date_exclusive

        query = """
            SELECT timestamp, open, high, low, close, volume
            FROM candles
            WHERE instrument_id = :crypto AND timeframe = :timeframe
        """

        if start_date is not None:
            query += " AND timestamp >= :start_date"
        if end_date is not None:
            query += " AND timestamp < :end_date_exclusive"
        query += " ORDER BY timestamp ASC"

        if limit is not None:
            query += " LIMIT :limit"
            parameters["limit"] = limit

        with engine.connect() as connection:
            result = connection.execute(text(query), parameters)
            data = [dict(row._mapping) for row in result]

        return data

    def get_pair_market_data(self, crypto1: int, crypto2: int, timeframe: str, start_date=None, end_date=None, limit: int | None = None):
        if crypto1 == crypto2:
            raise ValueError("Pairs Trading requires two different cryptocurrencies.")

        data1 = self.get_market_data_one_currency(crypto=crypto1, timeframe=timeframe, start_date=start_date, end_date=end_date, limit=limit)
        data2 = self.get_market_data_one_currency(crypto=crypto2, timeframe=timeframe, start_date=start_date, end_date=end_date, limit=limit)
        return data1, data2

    def get_market_data_range(self, crypto: int, timeframe: str):
        if timeframe not in SUPPORTED_TIMEFRAMES:
            raise ValueError("Unsupported timeframe. Use 1m, 1h or 1d.")
            
        query = text("""
            SELECT MIN(timestamp) AS min_ts, MAX(timestamp) AS max_ts
            FROM candles WHERE instrument_id = :crypto AND timeframe = :timeframe
        """)

        with engine.connect() as connection:
            result = connection.execute(query, {"crypto": crypto, "timeframe": timeframe}).fetchone()

        return {"start_date": result.min_ts, "end_date": result.max_ts}