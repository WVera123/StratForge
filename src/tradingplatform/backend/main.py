from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.StrategyRouter import router as strategy_router
from routers.BacktestRouter import router as backtest_router
from routers.MarketDataRouter import router as market_data_router
from routers.SettingsRouter import router as settings_router
from routers.PrincipleRouter import router as principle_router


app = FastAPI(
    title="Crypto Backtesting API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(strategy_router)
app.include_router(backtest_router)
app.include_router(market_data_router)
app.include_router(settings_router)
app.include_router(principle_router)


@app.get("/")
def root():
    return {
        "message": "Crypto Backtesting API is running"
    }