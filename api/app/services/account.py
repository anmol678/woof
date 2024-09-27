import random
import string
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import Account, ACCOUNT_NUMBER_LENGTH, Customer
from app.schemas import AccountCreate
from app.exceptions import CustomerNotFoundException, AccountNotFoundException


class AccountService:
    """Service layer for account-related operations."""

    @staticmethod
    async def create_account(account: AccountCreate, db: AsyncSession) -> Account:
         async with db.begin():
            result = await db.execute(select(Customer).where(Customer.id == account.customer_id).with_for_update())
            customer = result.scalar_one_or_none()
            if not customer:
                raise CustomerNotFoundException(customer_id=account.customer_id)
            
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
    async def get_account(account_id: int, db: AsyncSession) -> Account:
        result = await db.execute(select(Account).where(Account.id == account_id))
        account = result.scalar_one_or_none()
        if not account:
            raise AccountNotFoundException(account_id=account_id)
        return account

    @staticmethod
    async def generate_unique_account_number(db: AsyncSession) -> str:
        while True:
            account_number = ''.join(random.choices(string.digits, k=ACCOUNT_NUMBER_LENGTH))
            async with db.begin():
                result = await db.execute(
                    select(Account)
                    .where(Account.account_number == account_number)
                    .with_for_update()
                    .limit(1)
                )
                existing_account = result.scalar_one_or_none()
                if not existing_account:
                    return account_number
