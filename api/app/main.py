import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import customers, accounts, transfers
from app.db import init_db
from app.utils.logger import logger


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEBAPP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

base_prefix = "/api/v1"

app.include_router(customers.router, prefix=base_prefix + "/customers", tags=["Customers"])
app.include_router(accounts.router, prefix=base_prefix + "/accounts", tags=["Accounts"])
app.include_router(transfers.router, prefix=base_prefix + "/transfers", tags=["Transfers"])

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Application startup complete.")

@app.get("/")
async def root():
    return {"message": "Welcome to the Bank API"}
