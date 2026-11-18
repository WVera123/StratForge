CREATE TABLE instruments (
    id SERIAL PRIMARY KEY,

    symbol VARCHAR(50) NOT NULL UNIQUE,
    base_asset VARCHAR(20) NOT NULL,
    quote_asset VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS principles
(
    id SERIAL PRIMARY KEY,
    key VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
	CONSTRAINT principles_key_key UNIQUE (key)
);

CREATE TABLE candles (
    instrument_id INTEGER NOT NULL REFERENCES instruments(id),

    timeframe VARCHAR(10) NOT NULL,
	timestamp TIMESTAMPTZ NOT NULL,
	
    open NUMERIC(30, 10) NOT NULL,
    high NUMERIC(30, 10) NOT NULL,
    low NUMERIC(30, 10) NOT NULL,
    close NUMERIC(30, 10) NOT NULL,
    volume NUMERIC(30, 10) NOT NULL,

    PRIMARY KEY (
        instrument_id,
        timeframe,
        open_time
    )
);

CREATE INDEX idx_candles_instrument_timeframe_time 
ON candles (instrument_id, timeframe, timestamp);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL
);

CREATE TABLE strategies (
    id SERIAL PRIMARY KEY,
	user_id SERIAL NOT NULL REFERENCES users(id),
	
    title VARCHAR(100) NOT NULL,
	instrument_id INTEGER NOT NULL REFERENCES instruments(id),
	instrument2_id INTEGER REFERENCES instruments(id),
	timeframe VARCHAR(10) NOT NULL,
    principle VARCHAR(50) NOT NULL,
	start_date TIMESTAMPTZ NOT NULL,
	split FLOAT NOT NULL,
    parameters JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backtests
(
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER NOT NULL REFERENCES strategies(id),
    instrument_id INTEGER NOT NULL REFERENCES instruments(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    strategy_snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    instrument2_id INTEGER REFERENCES instruments(id),
	initial_capital NUMERIC NOT NULL DEFAULT 10000.0,
	final_capital NUMERIC,
	total_pnl NUMERIC,
	win_rate NUMERIC,
	max_drawdown NUMERIC,
	trade_count INTEGER
);

CREATE TABLE IF NOT EXISTS backtest_trades
(
    id SERIAL PRIMARY KEY,
    backtest_id INTEGER NOT NULL REFERENCES backtests(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    action VARCHAR(10) NOT NULL,    
    price NUMERIC NOT NULL,         
    quantity NUMERIC,               
    pnl NUMERIC,                    
    fees NUMERIC DEFAULT 0,         
    equity_after NUMERIC NOT NULL
);

CREATE INDEX idx_backtest_trades_backtest_id ON backtest_trades(backtest_id);
CREATE INDEX idx_backtest_trades_timestamp ON backtest_trades(timestamp);

CREATE TABLE settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    initial_capital FLOAT NOT NULL DEFAULT 10000.0,
    taker_fee FLOAT NOT NULL DEFAULT 0.0,
    maker_fee FLOAT NOT NULL DEFAULT 0.0,
    slippage FLOAT NOT NULL DEFAULT 0.0,
    position_sizing VARCHAR(50) NOT NULL DEFAULT 'fixed'
);
