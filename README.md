# StratForge

StratForge is a full-stack crypto trading platform for configuring, testing, and comparing trading strategies with historical market data.

The application consists of a React/Vite frontend, a FastAPI backend, and a PostgreSQL database.

## Features

- View historical data for BTC, ETH, and SOL
- Support for 1-minute, 1-hour, and 1-day timeframes
- Build strategies using:
  - Mean reversion
  - Trend following
  - Pairs trading
  - Rule-based trading
- Configure strategy parameters
- Run backtests
- View result statistics and trade history
- Save, edit, and delete strategies
- Configure starting capital, fees, slippage, and position sizing
- Use interactive market-data and backtest charts

## Technology stack

| Component | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Lightweight Charts |
| Backend | Python, FastAPI, Pydantic |
| Database | PostgreSQL, SQLAlchemy |
| Data processing | pandas, NumPy |
| Package management | uv and npm |

## Requirements

- Python 3.14 or higher
- Node.js 20 or higher
- npm
- PostgreSQL
- uv

To install `uv` on Windows:

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Installation

Open a terminal in the project root directory.

### 1. Install Python dependencies

```powershell
uv sync
```

### 2. Install frontend dependencies

```powershell
cd src/tradingplatform/frontend
npm install
cd ../../..
```

### 3. Configure PostgreSQL

Create a PostgreSQL database, for example `stratforge`:

```sql
CREATE DATABASE stratforge;
```

Then create `src/tradingplatform/backend/.env` if it does not already exist:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/stratforge
```

Replace `username`, `password`, and the port if they differ from your PostgreSQL configuration.

### 4. Initialize the database schema

Run the SQL file:

```powershell
psql -U postgres -d stratforge -f db/creates.sql
```

The schema includes tables for:

- instruments
- principles
- candles
- users
- strategies
- backtests
- backtest_trades
- settings

### 5. Import historical market data

> [!NOTE]
> Historical CSV data files are **not included in this repository**. Obtain the files separately and place them in the `docs/` directory under the following filenames:
>
> - `docs/BTCUSD_1.csv`
> - `docs/ETHUSD_1.csv`
> - `docs/SOLUSD_1.csv`

The import scripts expect the CSV files in `docs/` and must be run from the project root directory:

```powershell
uv run python src/tradingplatform/backend/scripts/import_btc_data.py
uv run python src/tradingplatform/backend/scripts/import_eth_data.py
uv run python src/tradingplatform/backend/scripts/import_sol_data.py
```

After importing the 1-minute data, 1-hour and 1-day candles can be generated:

```powershell
uv run python src/tradingplatform/backend/scripts/generate_timeframes.py
```

## Start the application

### Start the backend

```powershell
cd src/tradingplatform/backend
uv run uvicorn main:app --reload --port 8001
```

The API will then be available at:

- API: http://localhost:8001
- Swagger documentation: http://localhost:8001/docs
- ReDoc documentation: http://localhost:8001/redoc

### Start the frontend

Open a second terminal:

```powershell
cd src/tradingplatform/frontend
npm run dev
```

The frontend is available by default at:

- http://localhost:5173

## Project structure

```text
StratForge/
├── db/
│   └── creates.sql              # PostgreSQL database schema
├── docs/                         # Market data and project documentation
├── src/tradingplatform/
│   ├── backend/
│   │   ├── main.py               # FastAPI endpoints
│   │   ├── database.py           # Database connection
│   │   ├── indicators/           # Technical indicators
│   │   ├── repositories/         # Database access
│   │   ├── schemas/              # Pydantic request/response models
│   │   ├── scripts/              # Data imports and timeframe generation
│   │   ├── services/             # Application business logic
│   │   └── strategies/           # Trading strategies
│   └── frontend/
│       └── src/
│           ├── components/       # Reusable UI components
│           ├── charts/           # Chart components
│           ├── css/              # Stylesheets
│           └── helpers/          # Frontend helpers
├── pyproject.toml
└── README.md
```

## Main API routes

| Route | Purpose |
|---|---|
| `/currencies` | Retrieve available instruments |
| `/market-data/{crypto}` | Retrieve historical market data |
| `/principles` | Retrieve available strategy principles |
| `/strategies` | Manage strategies |
| `/strategies/preview` | Run a strategy preview |
| `/backtests` | Run a backtest |
| `/backtests/history` | Retrieve backtest history |
| `/settings` | Manage trading settings |

The complete list of parameters and request bodies is available in the automatic Swagger documentation at http://localhost:8001/docs.

## Development

### Frontend production build

```powershell
cd src/tradingplatform/frontend
npm run build
````