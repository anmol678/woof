from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


ACCOUNT_NUMBER_LENGTH = 12
CUSTOMER_NUMBER_LENGTH = 10

class Customer(Base):
    __tablename__ = "customers"
    __table_args__ = (
        Index('ix_customer_customer_number', 'customer_number', unique=True),
    )

    id = Column(Integer, primary_key=True)
    customer_number = Column(String(CUSTOMER_NUMBER_LENGTH), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)

    accounts = relationship("Account", back_populates="owner", cascade="all, delete-orphan")

class Account(Base):
    __tablename__ = "accounts"
    __table_args__ = (
        Index('ix_account_account_number', 'account_number', unique=True),
        Index('ix_account_customer_number', 'customer_number', 'account_number'),
    )

    id = Column(Integer, primary_key=True)
    account_number = Column(String(ACCOUNT_NUMBER_LENGTH), unique=True, index=True, nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    customer_number = Column(String(CUSTOMER_NUMBER_LENGTH), ForeignKey("customers.customer_number"), nullable=False)

    owner = relationship("Customer", back_populates="accounts", foreign_keys=[customer_number])
    transfers_sent = relationship("Transfer", back_populates="sender", foreign_keys='Transfer.sender_account_number', cascade="all, delete-orphan")
    transfers_received = relationship("Transfer", back_populates="receiver", foreign_keys='Transfer.receiver_account_number', cascade="all, delete-orphan")

class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    sender_account_number = Column(String(ACCOUNT_NUMBER_LENGTH), ForeignKey("accounts.account_number"), nullable=False)
    receiver_account_number = Column(String(ACCOUNT_NUMBER_LENGTH), ForeignKey("accounts.account_number"), nullable=False)

    sender = relationship("Account", foreign_keys=[sender_account_number], back_populates="transfers_sent")
    receiver = relationship("Account", foreign_keys=[receiver_account_number], back_populates="transfers_received")
