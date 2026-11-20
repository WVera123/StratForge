import json
from repositories.backtest_repo import BacktestRepository


class BacktestHistoryService:
    def __init__(self, repository=None):
        self.repository = repository or BacktestRepository()

    def get_backtest_history(self, strategy_id: int | None = None):
        executions = self.repository.get_backtest_history(strategy_id)
        return [execution.to_dict() if hasattr(execution, "to_dict") else execution for execution in executions]

    def get_backtest_execution(self, backtest_id: int):
        backtest = self.repository.get_backtest_by_id(backtest_id)

        if not backtest:
            return None

        if hasattr(backtest, "to_dict"):
            return backtest.to_dict()

        return backtest
