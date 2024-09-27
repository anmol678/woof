import os
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from app.routes import customers, accounts, transfers
from app.db import init_db
from app.constants import API_PREFIX
from app.exceptions import exception_to_status_code, service_exception_handler
from app.utils.logger import logger

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("WEBAPP_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix=API_PREFIX)
router.include_router(customers.router, prefix="/customers", tags=["Customers"])
router.include_router(accounts.router, prefix="/accounts", tags=["Accounts"])
router.include_router(transfers.router, prefix="/transfers", tags=["Transfers"])
app.include_router(router)

@app.on_event("startup")
async def startup_event():
    await init_db()
    logger.info("Application startup complete.")

@app.get("/")
async def root():
    return {"message": "Welcome to the Bank API"}

for exception_class in exception_to_status_code.keys():
    app.add_exception_handler(exception_class, service_exception_handler)
