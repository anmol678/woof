from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Customer
from app.schemas import CustomerCreate
from app.exceptions import CustomerNotFoundException

class CustomerService:
    """Service layer for customer-related operations."""

    @staticmethod
    async def create_customer(customer: CustomerCreate, db: AsyncSession) -> Customer:
        db_customer = Customer(name=customer.name)
        db.add(db_customer)
        await db.commit()
        await db.refresh(db_customer)
        return db_customer

    @staticmethod
    async def get_customer(customer_id: int, db: AsyncSession) -> Customer:
        result = await db.execute(select(Customer).where(Customer.id == customer_id))
        customer = result.scalar_one_or_none()
        if not customer:
            raise CustomerNotFoundException(customer_id=customer_id)
        return customer

    @staticmethod
    async def list_customers(db: AsyncSession) -> list[Customer]:
        async with db.begin():
            result = await db.execute(select(Customer))
            return result.scalars().all()
