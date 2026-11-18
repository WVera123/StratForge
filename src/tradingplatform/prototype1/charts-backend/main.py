from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from service import (
    BenchmarkService,
    MarketDataService,
)


app = FastAPI(
    title="Crypto Chart Benchmark API Prototype"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

market_data_service = MarketDataService()
benchmark_service = BenchmarkService()

@app.get("/")
def root():

    return {
        "message":
            "Crypto Chart Benchmark Prototype API is running"
    }

@app.get("/bitcoin")
def get_bitcoin(
    timeframe: str = "1h",
    source: str = "direct",
    start_date: str | None = None,
    end_date: str | None = None,
    limit: int = 10000,
):
    try:

        parsed_start = None
        parsed_end = None

        if start_date:

            parsed_start = datetime.fromisoformat(
                start_date.replace(
                    "Z",
                    "+00:00",
                )
            )

        if end_date:

            parsed_end = datetime.fromisoformat(
                end_date.replace(
                    "Z",
                    "+00:00",
                )
            )
            
        if (
            parsed_start is None
            and parsed_end is not None
        ) or (
            parsed_start is not None
            and parsed_end is None
        ):

            raise ValueError(
                "start_date and end_date must "
                "be provided together."
            )

        if parsed_start and parsed_end:

            if parsed_start >= parsed_end:

                raise ValueError(
                    "start_date must be before end_date."
                )

        data = (
            market_data_service
            .get_bitcoin_candles(
                timeframe=timeframe,
                source=source,
                start_date=parsed_start,
                end_date=parsed_end,
                limit=limit,
            )
        )

        return {
            "timeframe": timeframe,
            "source": source,
            "rows": len(data),
            "start_date": (
                parsed_start.isoformat()
                if parsed_start
                else None
            ),
            "end_date": (
                parsed_end.isoformat()
                if parsed_end
                else None
            ),
            "data": data,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

@app.get("/benchmark")
def run_benchmark(
    timeframe: str = "1h",
    limit: int = 10000,
):

    try:

        return (
            benchmark_service
            .run_benchmark(
                timeframe=timeframe,
                limit=limit,
            )
        )

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )