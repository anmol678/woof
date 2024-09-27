from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from typing import Dict, Type


class CustomerError(Exception):
    pass

class AccountError(Exception):
    pass

class TransactionError(Exception):
    pass

class CustomerNotFoundException(CustomerError):
    def __init__(self, customer_number: str):
        self.customer_number = customer_number
        super().__init__(f"Customer with number {customer_number} not found.")

class AccountNotFoundException(AccountError):
    def __init__(self, account_number: str):
        self.account_number = account_number
        super().__init__(f"Account with number {account_number} not found.")

class InsufficientFundsException(TransactionError):
    def __init__(self):
        super().__init__("Insufficient funds in the sender's account.")

class InvalidCustomerNumberException(CustomerError):
    def __init__(self, customer_number: str):
        self.customer_number = customer_number
        super().__init__(f"Invalid customer number: {customer_number}.")

class InvalidAccountNumberException(AccountError):
    def __init__(self, account_number: str):
        self.account_number = account_number
        super().__init__(f"Invalid account number: {account_number}.")

class InvalidAmountException(TransactionError):
    def __init__(self, amount: float, reason: str):
        self.amount = amount
        self.reason = reason
        super().__init__(f"Invalid amount: {amount}. {reason}")

class ExcessiveAmountException(TransactionError):
    def __init__(self, amount: float, max_amount: float):
        self.amount = amount
        self.max_amount = max_amount
        super().__init__(f"Amount {amount} exceeds maximum allowed amount of {max_amount}.")

exception_to_status_code: Dict[Type[Exception], int] = {
    CustomerNotFoundException: HTTP_404_NOT_FOUND,
    AccountNotFoundException: HTTP_404_NOT_FOUND,
    InsufficientFundsException: HTTP_400_BAD_REQUEST,
    InvalidCustomerNumberException: HTTP_400_BAD_REQUEST,
    InvalidAccountNumberException: HTTP_400_BAD_REQUEST,
    InvalidAmountException: HTTP_400_BAD_REQUEST,
    ExcessiveAmountException: HTTP_400_BAD_REQUEST,
}

async def service_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    for exception_class, status_code in exception_to_status_code.items():
        if isinstance(exc, exception_class):
            return JSONResponse(
                status_code=status_code,
                content={"detail": str(exc)}
            )
    # If the exception is not in our mapping, re-raise it
    raise exc
