from abc import ABC, abstractmethod

import pandas as pd


class BaseStrategy(ABC):
    @abstractmethod
    def run(self, df: pd.DataFrame, parameters):
        """Generate trading signals for the supplied market data."""
        raise NotImplementedError
