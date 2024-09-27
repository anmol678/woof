from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.schemas import Customer, CustomerCreate
from app.services import CustomerService


router = APIRouter()

@router.post("/", response_model=Customer, status_code=201)
async def create_customer(customer: CustomerCreate, db: AsyncSession = Depends(get_db)):
    return await CustomerService.create_customer(customer, db)

@router.get("/{customer_number}", response_model=Customer, status_code=200)
async def get_customer(customer_number: str, db: AsyncSession = Depends(get_db)):
    return await CustomerService.get_customer(customer_number, db)

@router.get("/", response_model=list[Customer], status_code=200)
async def list_customers(db: AsyncSession = Depends(get_db)):
    return await CustomerService.list_customers(db)
