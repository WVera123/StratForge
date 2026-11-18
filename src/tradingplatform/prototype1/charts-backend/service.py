import math
import time
from datetime import datetime, timedelta, timezone

import repository


BTC_INSTRUMENT_ID = 1


class MarketDataService:
    """
    Handles market-data retrieval and transformation.
    """

    ALLOWED_TIMEFRAMES = {
        "1m",
        "1h",
        "1d",
    }

    ALLOWED_SOURCES = {
        "direct",
        "sql",
        "python",
    }

    def get_bitcoin_candles(
        self,
        timeframe: str,
        source: str,
        start_date=None,
        end_date=None,
        limit: int = 10000,
    ):
        self._validate_timeframe(timeframe)
        self._validate_source(source)

        if limit <= 0:
            raise ValueError(
                "Limit must be greater than 0"
            )

        if timeframe == "1m":

            if (
                start_date is None
                and end_date is None
            ):

                rows = repository.get_latest_candles(
                    BTC_INSTRUMENT_ID,
                    "1m",
                    limit,
                )

            else:

                rows = repository.get_candles_by_range(
                    BTC_INSTRUMENT_ID,
                    "1m",
                    start_date,
                    end_date,
                )

                rows = rows[-limit:]

            return self.convert_rows(rows)
        if (
            start_date is None
            or end_date is None
        ):
            start_date, end_date = (
                self.create_latest_range(
                    timeframe,
                    limit,
                )
            )

        if source == "direct":

            rows = repository.get_candles_by_range(
                BTC_INSTRUMENT_ID,
                timeframe,
                start_date,
                end_date,
            )

            return self.convert_rows(rows)

        if source == "sql":

            rows = repository.get_sql_aggregated_candles(
                BTC_INSTRUMENT_ID,
                timeframe,
                start_date,
                end_date,
            )

            return self.convert_rows(rows)

        rows_1m = repository.get_candles_by_range(
            BTC_INSTRUMENT_ID,
            "1m",
            start_date,
            end_date,
        )

        aggregated = self.aggregate_in_python(
            rows_1m,
            timeframe,
        )

        return self.convert_rows(aggregated)

    def create_latest_range(
        self,
        timeframe: str,
        limit: int,
    ):
        """
        Create a range based on the latest timestamp that
        actually exists in the database.

        This is important because the DB contains historical
        data and may not contain the current date.
        """

        latest_timestamp = (
            repository.get_latest_timestamp(
                BTC_INSTRUMENT_ID,
                "1m",
            )
        )

        if latest_timestamp is None:
            raise ValueError(
                "No Bitcoin 1m data exists in the database."
            )

        if latest_timestamp.tzinfo is None:
            latest_timestamp = latest_timestamp.replace(
                tzinfo=timezone.utc
            )
        else:
            latest_timestamp = latest_timestamp.astimezone(
                timezone.utc
            )

        if timeframe == "1h":

            end_date = latest_timestamp.replace(
                minute=0,
                second=0,
                microsecond=0,
            )

            start_date = (
                end_date
                - timedelta(hours=limit)
            )

        elif timeframe == "1d":

            end_date = latest_timestamp.replace(
                hour=0,
                minute=0,
                second=0,
                microsecond=0,
            )

            start_date = (
                end_date
                - timedelta(days=limit)
            )

        else:
            raise ValueError(
                "Latest range is only supported for 1h and 1d."
            )

        return start_date, end_date

    def aggregate_in_python(
        self,
        rows,
        timeframe: str,
    ):
        """
        Aggregate 1m candles into 1h or 1d candles.

        Uses a single-pass aggregation.
        """

        if timeframe == "1h":

            def get_bucket(timestamp):
                return timestamp.replace(
                    minute=0,
                    second=0,
                    microsecond=0,
                )

        elif timeframe == "1d":

            def get_bucket(timestamp):
                return timestamp.replace(
                    hour=0,
                    minute=0,
                    second=0,
                    microsecond=0,
                )

        else:

            return rows

        buckets = {}

        for row in rows:

            timestamp = row.timestamp
            bucket_key = get_bucket(timestamp)

            if bucket_key not in buckets:

                buckets[bucket_key] = {
                    "time": bucket_key,
                    "open": float(row.open),
                    "high": float(row.high),
                    "low": float(row.low),
                    "close": float(row.close),
                    "volume": float(row.volume),
                }

            else:

                bucket = buckets[bucket_key]

                high = float(row.high)
                low = float(row.low)
                close = float(row.close)
                volume = float(row.volume)

                bucket["high"] = max(
                    bucket["high"],
                    high,
                )

                bucket["low"] = min(
                    bucket["low"],
                    low,
                )

                bucket["close"] = close

                bucket["volume"] += volume

        return [
            buckets[key]
            for key in sorted(buckets)
        ]

    def convert_rows(self, rows):

        result = []

        for row in rows:

            if isinstance(row, dict):

                timestamp = (
                    row["time"]
                    if "time" in row
                    else row["timestamp"]
                )

                open_price = row["open"]
                high_price = row["high"]
                low_price = row["low"]
                close_price = row["close"]
                volume = row["volume"]

            else:

                timestamp = row.timestamp
                open_price = row.open
                high_price = row.high
                low_price = row.low
                close_price = row.close
                volume = row.volume

            result.append(
                {
                    "time": self._format_timestamp(
                        timestamp
                    ),
                    "open": self._safe_float(
                        open_price
                    ),
                    "high": self._safe_float(
                        high_price
                    ),
                    "low": self._safe_float(
                        low_price
                    ),
                    "close": self._safe_float(
                        close_price
                    ),
                    "volume": self._safe_float(
                        volume
                    ),
                }
            )

        return result

    @staticmethod
    def _validate_timeframe(
        timeframe: str,
    ):

        if timeframe not in MarketDataService.ALLOWED_TIMEFRAMES:

            raise ValueError(
                "Invalid timeframe. "
                "Allowed values: 1m, 1h, 1d"
            )

    @staticmethod
    def _validate_source(
        source: str,
    ):

        if source not in MarketDataService.ALLOWED_SOURCES:

            raise ValueError(
                "Invalid source. "
                "Allowed values: direct, sql, python"
            )

    @staticmethod
    def _safe_float(value):

        if value is None:
            return None

        value = float(value)

        if not math.isfinite(value):
            return None

        return value

    @staticmethod
    def _format_timestamp(
        timestamp,
    ):

        if timestamp.tzinfo is None:

            timestamp = timestamp.replace(
                tzinfo=timezone.utc
            )

        else:

            timestamp = timestamp.astimezone(
                timezone.utc
            )

        return timestamp.strftime(
            "%Y-%m-%dT%H:%M:%SZ"
        )


class BenchmarkService:
    """
    Benchmarks:

    1. Stored 1h / 1d candles
    2. 1m -> PostgreSQL aggregation
    3. 1m -> Python aggregation

    All three operate on the exact same date range.
    """

    def run_benchmark(
        self,
        timeframe: str,
        limit: int,
    ):

        if timeframe not in {
            "1h",
            "1d",
        }:

            raise ValueError(
                "Benchmark timeframe must be 1h or 1d so it calculates if the aggregation is faster than reading stored candles."
            )

        if limit <= 0:

            raise ValueError(
                "Limit must be greater than 0"
            )

        start_date, end_date = (
            MarketDataService()
            .create_latest_range(
                timeframe,
                limit,
            )
        )

        direct = self._benchmark_direct(
            timeframe,
            start_date,
            end_date,
        )

        sql = self._benchmark_sql(
            timeframe,
            start_date,
            end_date,
        )

        python = self._benchmark_python(
            timeframe,
            start_date,
            end_date,
        )

        times = {
            "direct": direct["total_ms"],
            "sql": sql["total_ms"],
            "python": python["total_ms"],
        }

        fastest = min(
            times,
            key=times.get,
        )

        return {
            "timeframe": timeframe,
            "requested_candles": limit,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "direct": direct,
            "sql": sql,
            "python": python,
            "fastest": fastest,
            "times": times,
        }

    def _benchmark_direct(
        self,
        timeframe,
        start_date,
        end_date,
    ):

        start = time.perf_counter()

        rows = repository.get_candles_by_range(
            BTC_INSTRUMENT_ID,
            timeframe,
            start_date,
            end_date,
        )

        total_ms = self._elapsed_ms(start)

        return {
            "rows": len(rows),
            "database_ms": total_ms,
            "total_ms": total_ms,
        }

    def _benchmark_sql(
        self,
        timeframe,
        start_date,
        end_date,
    ):

        start = time.perf_counter()

        rows = repository.get_sql_aggregated_candles(
            BTC_INSTRUMENT_ID,
            timeframe,
            start_date,
            end_date,
        )

        total_ms = self._elapsed_ms(start)

        return {
            "rows": len(rows),
            "database_ms": total_ms,
            "total_ms": total_ms,
        }

    def _benchmark_python(
        self,
        timeframe,
        start_date,
        end_date,
    ):

        database_start = time.perf_counter()

        rows_1m = repository.get_candles_by_range(
            BTC_INSTRUMENT_ID,
            "1m",
            start_date,
            end_date,
        )

        database_ms = self._elapsed_ms(
            database_start
        )

        aggregation_start = time.perf_counter()

        aggregated = (
            MarketDataService()
            .aggregate_in_python(
                rows_1m,
                timeframe,
            )
        )

        aggregation_ms = self._elapsed_ms(
            aggregation_start
        )

        total_ms = (
            database_ms
            + aggregation_ms
        )

        return {
            "input_1m_rows": len(rows_1m),
            "output_rows": len(aggregated),
            "database_ms": database_ms,
            "aggregation_ms": aggregation_ms,
            "total_ms": total_ms,
        }

    @staticmethod
    def _elapsed_ms(start):

        return round(
            (
                time.perf_counter()
                - start
            ) * 1000,
            2,
        )