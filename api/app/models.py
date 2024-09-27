from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db import Base


ACCOUNT_NUMBER_LENGTH = 12

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)

    accounts = relationship("Account", back_populates="owner", cascade="all, delete-orphan")

class Account(Base):
    __tablename__ = "accounts"
    __table_args__ = (
        Index('ix_account_account_number', 'account_number', unique=True),
    )

    id = Column(Integer, primary_key=True, index=True)
    account_number = Column(String(ACCOUNT_NUMBER_LENGTH), unique=True, index=True, nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    owner = relationship("Customer", back_populates="accounts")
    transfers_sent = relationship("Transfer", back_populates="sender", foreign_keys='Transfer.sender_id', cascade="all, delete-orphan")
    transfers_received = relationship("Transfer", back_populates="receiver", foreign_keys='Transfer.receiver_id', cascade="all, delete-orphan")

class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), default=func.now(), nullable=False)
    sender_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("accounts.id"), nullable=False)

    sender = relationship("Account", foreign_keys=[sender_id], back_populates="transfers_sent")
    receiver = relationship("Account", foreign_keys=[receiver_id], back_populates="transfers_received")
