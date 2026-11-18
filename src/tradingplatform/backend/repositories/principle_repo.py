from sqlalchemy import text
from database import engine

class PrincipleRepository:
    def get_principles(self):
        query = text("SELECT id, key, title FROM principles ORDER BY id")
        with engine.connect() as connection:
            result = connection.execute(query)
            return [{"id": row.id, "key": row.key, "title": row.title} for row in result]