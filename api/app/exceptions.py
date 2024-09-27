from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND


class CustomerNotFoundException(HTTPException):
    def __init__(self, customer_number: str):
        super().__init__(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Customer with number {customer_number} not found."
        )

class AccountNotFoundException(HTTPException):
    def __init__(self, account_number: str):
        super().__init__(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Account with number {account_number} not found."
        )

class InsufficientFundsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Insufficient funds in the sender's account."
        )

class InvalidCustomerNumberException(HTTPException):
    def __init__(self, customer_number: str):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid customer number: {customer_number}."
        )

class InvalidAccountNumberException(HTTPException):
    def __init__(self, account_number: str):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid account number: {account_number}."
        )

class InvalidAmountException(HTTPException):
    def __init__(self, amount: float, reason: str):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid amount: {amount}. {reason}"
        )

class ExcessiveAmountException(HTTPException):
    def __init__(self, amount: float, max_amount: float):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Amount {amount} exceeds maximum allowed amount of {max_amount}."
        )