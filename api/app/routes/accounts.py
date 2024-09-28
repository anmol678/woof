from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import AccountCreate, AccountBalance, Account, Transfer
from app.services import AccountService, TransferService


router = APIRouter()

@router.post("/", response_model=Account, status_code=201)
async def create_account(account: AccountCreate, db: AsyncSession = Depends(get_db)):
    return await AccountService.create_account(account, db)

@router.get("/{account_number}/balance/", response_model=AccountBalance, status_code=200)
async def get_balance(account_number: str, db: AsyncSession = Depends(get_db)):
    account = await AccountService.get_account(account_number, db)
    return AccountBalance(balance=account.balance)

@router.get("/{account_number}", response_model=Account, status_code=200)
async def get_account(account_number: str, db: AsyncSession = Depends(get_db)):
    return await AccountService.get_account(account_number, db)

@router.get("/{account_number}/transfers/", response_model=list[Transfer], status_code=200)
async def get_transfer_history(account_number: str, db: AsyncSession = Depends(get_db)):
    return await TransferService.get_transfer_history(account_number, db)

@router.get("/", response_model=list[Account], status_code=200)
async def list_accounts(db: AsyncSession = Depends(get_db)):
    return await AccountService.get_all_accounts(db)
