from pydantic import BaseModel


class Principle(BaseModel):
    id: int
    key: str
    title: str