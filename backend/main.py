from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api.stock_api import router as stock_router
app = FastAPI(title="Quant Engine API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(stock_router, prefix="/api/stocks", tags=["Stocks Market"])
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=18000, reload=True)