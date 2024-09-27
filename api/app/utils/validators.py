import re
from decimal import Decimal

from app.constants import ACCOUNT_NUMBER_LENGTH, CUSTOMER_NUMBER_LENGTH, MAX_AMOUNT
from app.exceptions import InvalidAmountException, ExcessiveAmountException

def validate_number(number: str, length: int) -> bool:
    return bool(re.match(f"^\\d{{{length}}}$", number))

def validate_account_number(account_number: str) -> bool:
    return validate_number(account_number, ACCOUNT_NUMBER_LENGTH)

def validate_customer_number(customer_number: str) -> bool:
    return validate_number(customer_number, CUSTOMER_NUMBER_LENGTH)

def validate_amount(amount: float) -> None:
    decimal_amount = Decimal(str(amount)).normalize()
    if decimal_amount <= 0:
        raise InvalidAmountException(amount, "Amount must be greater than zero.")
    if decimal_amount.as_tuple().exponent < -2:
        raise InvalidAmountException(amount, "Amount cannot have more than two decimal places.")
    if decimal_amount > MAX_AMOUNT:
        raise ExcessiveAmountException(amount, MAX_AMOUNT)
