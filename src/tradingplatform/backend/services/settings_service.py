from repositories.settings_repo import SettingsRepository

class SettingsService:
    def __init__(self):
        self.repository = SettingsRepository()

    def get_settings(self, user_id: int):
        return self.repository.get_settings(user_id)
        
    def save_settings(self, user_id: int, settings: dict):
        return self.repository.save_settings(user_id, settings)