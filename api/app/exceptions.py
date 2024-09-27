from fastapi import HTTPException
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND


class CustomerNotFoundException(HTTPException):
    def __init__(self, customer_id: int):
        super().__init__(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Customer with ID {customer_id} not found."
        )

class AccountNotFoundException(HTTPException):
    def __init__(self, account_id: int):
        super().__init__(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Account with ID {account_id} not found."
        )

class InsufficientFundsException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=HTTP_400_BAD_REQUEST,
            detail="Insufficient funds in the sender's account."
        )
