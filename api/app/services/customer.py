import random
import string
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Customer, CUSTOMER_NUMBER_LENGTH, Account
from app.schemas import CustomerCreate
from app.exceptions import CustomerNotFoundException, InvalidCustomerNumberException


def validate_customer_number(customer_number: str) -> bool:
    return bool(re.match(f"^\\d{{{CUSTOMER_NUMBER_LENGTH}}}$", customer_number))

class CustomerService:
    """Service layer for customer-related operations."""

    @staticmethod
    async def create_customer(customer: CustomerCreate, db: AsyncSession) -> Customer:
        customer_number = await CustomerService.generate_unique_customer_number(db)
        db_customer = Customer(name=customer.name, customer_number=customer_number)
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer

    @staticmethod
    async def get_customer(customer_number: str, db: AsyncSession) -> Customer:
        if not validate_customer_number(customer_number):
            raise InvalidCustomerNumberException(customer_number=customer_number)
        result = await db.execute(select(Customer).where(Customer.customer_number == customer_number))
        customer = result.scalar_one_or_none()
        if not customer:
            raise CustomerNotFoundException(customer_number=customer_number)
        return customer

    @staticmethod
    async def list_customers(db: AsyncSession) -> list[Customer]:
        async with db.begin():
            result = await db.execute(select(Customer))
            return result.scalars().all()

    @staticmethod
    async def get_customer_accounts(customer_number: str, db: AsyncSession) -> list[Account]:
        customer = await CustomerService.get_customer(customer_number, db)
        return customer.accounts

    @staticmethod
    async def generate_unique_customer_number(db: AsyncSession) -> str:
        while True:
            customer_number = ''.join(random.choices(string.digits, k=CUSTOMER_NUMBER_LENGTH))
            result = await db.execute(
                select(Customer)
                .where(Customer.customer_number == customer_number)
                .limit(1)
            )
            existing_customer = result.scalar_one_or_none()
            if not existing_customer:
                return customer_number
