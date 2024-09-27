from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import Transfer, Account
from app.schemas import TransferCreate
from app.exceptions import AccountNotFoundException, InsufficientFundsException

class TransferService:
    """Service layer for transfer-related operations."""

    @staticmethod
    async def create_transfer(transfer: TransferCreate, db: AsyncSession) -> Transfer:
        async with db.begin():
            result = await db.execute(
                select(Account).where(
                    (Account.id == transfer.sender_id) | (Account.id == transfer.receiver_id)
                ).with_for_update()
            )
            accounts = result.scalars().all()

            sender = next((acc for acc in accounts if acc.id == transfer.sender_id), None)
            receiver = next((acc for acc in accounts if acc.id == transfer.receiver_id), None)

            if not sender:
                raise AccountNotFoundException(account_id=transfer.sender_id)
            if not receiver:
                raise AccountNotFoundException(account_id=transfer.receiver_id)
            if sender.balance < transfer.amount:
                raise InsufficientFundsException()

            sender.balance -= transfer.amount
            receiver.balance += transfer.amount

            db_transfer = Transfer(
                amount=transfer.amount,
                sender_id=sender.id,
                receiver_id=receiver.id
            )
            db.add(db_transfer)

        await db.refresh(db_transfer)
        return db_transfer

    @staticmethod
    async def get_transfer_history(account_id: int, db: AsyncSession) -> list[Transfer]:
        result = await db.execute(select(Account).where(Account.id == account_id))
        account = result.scalar_one_or_none()
        if not account:
            raise AccountNotFoundException(account_id=account_id)

        result = await db.execute(
            select(Transfer).where(
                (Transfer.sender_id == account_id) | (Transfer.receiver_id == account_id)
            ).order_by(Transfer.timestamp.desc())
        )
        transfers = result.scalars().all()
        return transfers
