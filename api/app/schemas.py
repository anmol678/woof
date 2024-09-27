from pydantic import BaseModel
from datetime import datetime


class CustomerCreate(BaseModel):
    name: str

class Customer(BaseModel):
    id: int
    customer_number: str
    name: str

    class Config:
        from_attributes = True

class AccountCreate(BaseModel):
    customer_number: str
    initial_deposit: float

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
    sender_id: int
    receiver_id: int
    amount: float

class Transfer(BaseModel):
    id: int
    amount: float
    timestamp: datetime
    sender_id: int
    receiver_id: int

    class Config:
        from_attributes = True
