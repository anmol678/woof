from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models import Customer, Account
from app.schemas import CustomerCreate
from app.constants import CUSTOMER_NUMBER_LENGTH
from app.exceptions import CustomerNotFoundException, InvalidCustomerNumberException
from app.utils.validators import validate_customer_number
from app.utils.number_generator import generate_unique_number


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
    async def get_customer(customer_number: str, db: AsyncSession, include_accounts: bool = False) -> Customer:
        if not validate_customer_number(customer_number):
            raise InvalidCustomerNumberException(customer_number=customer_number)
        query = select(Customer).where(Customer.customer_number == customer_number)
        if include_accounts:
            query = query.options(selectinload(Customer.accounts))
        result = await db.execute(query)
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
        customer = await CustomerService.get_customer(customer_number, db, include_accounts=True)
        return customer.accounts

    @staticmethod
    async def check_customer_number_exists(db: AsyncSession, customer_number: str) -> bool:
        result = await db.execute(
            select(Customer).where(Customer.customer_number == customer_number).limit(1)
        )
        return result.scalar_one_or_none() is not None

    @staticmethod
    async def generate_unique_customer_number(db: AsyncSession) -> str:
        return await generate_unique_number(db, CUSTOMER_NUMBER_LENGTH, CustomerService.check_customer_number_exists)
