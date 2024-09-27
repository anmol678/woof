from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Account, Customer
from app.schemas import AccountCreate
from app.constants import ACCOUNT_NUMBER_LENGTH
from app.exceptions import *
from app.utils.validators import validate_customer_number, validate_account_number, validate_amount
from app.utils.number_generator import generate_unique_number


class AccountService:
    """Service layer for account-related operations."""

    @staticmethod
    async def create_account(account: AccountCreate, db: AsyncSession) -> Account:
        if not validate_customer_number(account.customer_number):
            raise InvalidCustomerNumberException(customer_number=account.customer_number)
        
        validate_amount(account.initial_deposit)
        
        async with db.begin():
            result = await db.execute(
                select(Customer)
                .where(Customer.customer_number == account.customer_number)
                .with_for_update()
            )
            customer = result.scalar_one_or_none()
            if not customer:
                raise CustomerNotFoundException(customer_number=account.customer_number)
            account_number = await AccountService.generate_unique_account_number(db)
            db_account = Account(
                account_number=account_number,
                balance=account.initial_deposit,
                owner=customer
            )
            db.add(db_account)
        await db.refresh(db_account)
        return db_account

    @staticmethod
    async def get_account(account_number: str, db: AsyncSession) -> Account:
        if not validate_account_number(account_number):
            raise InvalidAccountNumberException(account_number=account_number)
        result = await db.execute(select(Account).where(Account.account_number == account_number))
        account = result.scalar_one_or_none()
        if not account:
            raise AccountNotFoundException(account_number=account_number)
        return account

    @staticmethod
    async def check_account_number_exists(db: AsyncSession, account_number: str) -> bool:
        result = await db.execute(
            select(Account).where(Account.account_number == account_number).limit(1)
        )
        return result.scalar_one_or_none() is not None

    async def generate_unique_account_number(db: AsyncSession) -> str:
        return await generate_unique_number(db, ACCOUNT_NUMBER_LENGTH, AccountService.check_account_number_exists)

