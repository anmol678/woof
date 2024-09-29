from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Transfer, Account
from app.schemas import TransferCreate
from app.exceptions import *
from app.utils.validators import validate_account_number, validate_amount

class TransferService:
    """Service layer for transfer-related operations."""

    @staticmethod
    async def create_transfer(transfer: TransferCreate, db: AsyncSession) -> Transfer:
        if not validate_account_number(transfer.sender_account_number):
            raise InvalidAccountNumberException(account_number=transfer.sender_account_number)
        if not validate_account_number(transfer.receiver_account_number):
            raise InvalidAccountNumberException(account_number=transfer.receiver_account_number)
        if transfer.sender_account_number == transfer.receiver_account_number:
            raise SameAccountTransferException()
        
        validate_amount(transfer.amount)

        async with db.begin():
            result = await db.execute(
                select(Account).where(
                    (Account.account_number == transfer.sender_account_number) | (Account.account_number == transfer.receiver_account_number)
                ).with_for_update()
            )
            accounts = result.scalars().all()

            sender = next((acc for acc in accounts if acc.account_number == transfer.sender_account_number), None)
            receiver = next((acc for acc in accounts if acc.account_number == transfer.receiver_account_number), None)

            if not sender:
                raise AccountNotFoundException(account_number=transfer.sender_account_number)
            if not receiver:
                raise AccountNotFoundException(account_number=transfer.receiver_account_number)
            if sender.balance < transfer.amount:
                raise InsufficientFundsException()

            sender.balance -= transfer.amount
            receiver.balance += transfer.amount

            db_transfer = Transfer(
                amount=transfer.amount,
                sender_account_number=sender.account_number,
                receiver_account_number=receiver.account_number
            )
            db.add(db_transfer)

        await db.refresh(db_transfer)
        return db_transfer

    @staticmethod
    async def get_transfer_history(account_number: str, db: AsyncSession) -> list[Transfer]:
        if not validate_account_number(account_number):
            raise InvalidAccountNumberException(account_number=account_number)
        result = await db.execute(
            select(Account)
            .where(Account.account_number == account_number)
        )
        account = result.scalar_one_or_none()
        if not account:
            raise AccountNotFoundException(account_number=account_number)

        result = await db.execute(
            select(Transfer).where(
                (Transfer.sender_account_number == account.account_number) | (Transfer.receiver_account_number == account.account_number)
            ).order_by(Transfer.timestamp.desc())
        )
        transfers = result.scalars().all()
        return transfers
