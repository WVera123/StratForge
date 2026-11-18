from sqlalchemy import text
from database import engine

class SettingsRepository:
    def get_settings(self, user_id: int):
        query = text("SELECT initial_capital, taker_fee, maker_fee, slippage, position_sizing FROM settings WHERE user_id = :user_id")
        with engine.connect() as connection:
            result = connection.execute(query, {"user_id": user_id}).fetchone()
            if result:
                return {
                    "initialCapital": result.initial_capital,
                    "takerFee": result.taker_fee,
                    "makerFee": result.maker_fee,
                    "slippage": result.slippage,
                    "positionSizing": result.position_sizing
                }
            return {}

    def save_settings(self, user_id: int, settings_data: dict):
        try:
            with engine.begin() as connection:
                query = text("""
                    INSERT INTO settings (user_id, initial_capital, taker_fee, maker_fee, slippage, position_sizing, position_allocation)
                    VALUES (:user_id, :initial_capital, :taker_fee, :maker_fee, :slippage, :position_sizing, :position_allocation)
                    ON CONFLICT (user_id) DO UPDATE SET
                        initial_capital = EXCLUDED.initial_capital, taker_fee = EXCLUDED.taker_fee,
                        maker_fee = EXCLUDED.maker_fee, slippage = EXCLUDED.slippage,
                        position_sizing = EXCLUDED.position_sizing, position_allocation = EXCLUDED.position_allocation
                """)
                connection.execute(query, {
                    "user_id": user_id, "initial_capital": settings_data["initialCapital"],
                    "taker_fee": settings_data["takerFee"], "maker_fee": settings_data["makerFee"],
                    "slippage": settings_data["slippage"], "position_sizing": settings_data["positionSizing"],
                    "position_allocation": settings_data["positionAllocation"]
                })
            return settings_data
        except Exception as e:
            print(f"DATABASE ERROR in save_settings: {str(e)}")
            raise e