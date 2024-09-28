import os
from fastapi import FastAPI, APIRouter, Security
from fastapi.middleware.cors import CORSMiddleware

from app.routes import customers, accounts, transfers
from app.db import init_db
from app.constants import API_PREFIX
from app.security import get_api_key
from app.exceptions import exception_to_status_code, service_exception_handler
from app.utils.logger import logger

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEB_APP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix=API_PREFIX, dependencies=[Security(get_api_key)])
router.include_router(customers.router, prefix="/customers", tags=["Customers"])
router.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
router.include_router(transfers.router, prefix="/transfers", tags=["Transfers"])
app.include_router(router)

for exception_class in exception_to_status_code.keys():
    app.add_exception_handler(exception_class, service_exception_handler)

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Application startup complete.")

@app.get("/")
async def root():
    return {"message": "Welcome to the Bank API"}
