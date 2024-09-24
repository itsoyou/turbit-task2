from pydantic import BaseModel
from typing import List

class TurbineData(BaseModel):
    datetime: str
    wind_speed: str # Wind(m/s)
    power: str  # Leistung(kW)


class TurbineResponse(BaseModel):
    turbine_id: str
    data: List[TurbineData]
