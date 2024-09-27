from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import TransferCreate, Transfer
from app.services import TransferService

router = APIRouter()

@router.post("/", response_model=Transfer, status_code=201)
async def create_transfer(transfer: TransferCreate, db: AsyncSession = Depends(get_db)):
    return await TransferService.create_transfer(transfer, db)
