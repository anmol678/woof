from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import AccountCreate, AccountBalance, Account, Transfer
from app.services import AccountService, TransferService


router = APIRouter()

@router.post("/", response_model=Account, status_code=201)
async def create_account(account: AccountCreate, db: AsyncSession = Depends(get_db)):
    return await AccountService.create_account(account, db)

@router.get("/{account_id}/balance/", response_model=AccountBalance, status_code=200)
async def get_balance(account_id: int, db: AsyncSession = Depends(get_db)):
    account = await AccountService.get_account(account_id, db)
    return AccountBalance(balance=account.balance)

@router.get("/{account_id}", response_model=Account, status_code=200)
async def get_account(account_id: int, db: AsyncSession = Depends(get_db)):
    return await AccountService.get_account(account_id, db)

@router.get("/{account_id}/transfers/", response_model=list[Transfer], status_code=200)
async def get_transfer_history(account_id: int, db: AsyncSession = Depends(get_db)):
    return await TransferService.get_transfer_history(account_id, db)
