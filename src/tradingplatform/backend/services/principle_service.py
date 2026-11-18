from repositories.principle_repo import PrincipleRepository

class PrincipleService:
    def __init__(self):
        self.repository = PrincipleRepository()

    def get_principles(self):
        return self.repository.get_principles()