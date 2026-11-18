from repositories.market_data_repo import MarketDataRepository

class MarketDataService:
    def __init__(self):
        self.repository = MarketDataRepository()

    def get_currencies(self):
        return self.repository.get_currencies()

    def get_market_data_one_currency(self, crypto: int, timeframe: str):
        return self.repository.get_market_data_one_currency(crypto=crypto, timeframe=timeframe)

    def get_market_data_range(self, crypto: int, timeframe: str):
        return self.repository.get_market_data_range(crypto=crypto, timeframe=timeframe)