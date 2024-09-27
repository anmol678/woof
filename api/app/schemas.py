from pydantic import BaseModel, Field
from datetime import datetime

from app.constants import CUSTOMER_NUMBER_LENGTH, ACCOUNT_NUMBER_LENGTH


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)

class Customer(BaseModel):
    id: int
    customer_number: str
    name: str

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    customer_number: str = Field(..., pattern=f"^\\d{{{CUSTOMER_NUMBER_LENGTH}}}$")
    initial_deposit: float = Field(..., gt=0)

class Account(BaseModel):
    id: int
    account_number: str
    balance: float
    customer_number: str

    class Config:
        from_attributes = True

class AccountBalance(BaseModel):
    balance: float

class TransferCreate(BaseModel):
    sender_account_number: str = Field(..., pattern=f"^\\d{{{ACCOUNT_NUMBER_LENGTH}}}$")
    receiver_account_number: str = Field(..., pattern=f"^\\d{{{ACCOUNT_NUMBER_LENGTH}}}$")
    amount: float = Field(..., gt=0)

class Transfer(BaseModel):
    id: int
    amount: float
    timestamp: datetime
    sender_account_number: str
    receiver_account_number: str

    class Config:
        from_attributes = True
