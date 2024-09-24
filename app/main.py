from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime
from .schemas import TurbineResponse, TurbineData
from .db import collection

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])


@app.get("/turbine/{turbine_id}/data", response_model=TurbineResponse)
def get_turbine_data(turbine_id: str, start_time: str, end_time: str):
    try:
        converted_start_time = datetime.strptime(start_time, "%d.%m.%Y, %H:%M")
        converted_end_time = datetime.strptime(end_time, "%d.%m.%Y, %H:%M")
    except ValueError as exc:
        raise HTTPException(
            status_code=400, detail="Invalid date format. Use DD.MM.YYYY, HH:MM"
        ) from exc

    query = {
        "turbine_id": turbine_id,
        "Dat/Zeit": {"$gte": converted_start_time, "$lte": converted_end_time},
    }

    try:
        results = list(collection.find(query, {"_id": 0}).sort("Dat/Zeit", 1))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if not results:
        raise HTTPException(
            status_code=404,
            detail="No data found for the turbine ID and time range.",
        )

    turbine_data = [
        TurbineData(
            datetime=str(result["Dat/Zeit"]),
            wind_speed=str(result["Wind(m/s)"]),
            power=str(result["Leistung(kW)"]),
        )
        for result in results
    ]

    return TurbineResponse(turbine_id=turbine_id, data=turbine_data)
