import re
from decimal import Decimal

from app.constants import ACCOUNT_NUMBER_LENGTH, CUSTOMER_NUMBER_LENGTH, MAX_AMOUNT
from app.exceptions import InvalidAmountException, ExcessiveAmountException


def validate_account_number(account_number: str) -> bool:
    return bool(re.match(f"^\\d{{{ACCOUNT_NUMBER_LENGTH}}}$", account_number))

def validate_customer_number(customer_number: str) -> bool:
    return bool(re.match(f"^\\d{{{CUSTOMER_NUMBER_LENGTH}}}$", customer_number))

def validate_amount(amount: float) -> None:
    decimal_amount = Decimal(str(amount)).normalize()
    if decimal_amount <= 0:
        raise InvalidAmountException(amount, "Amount must be greater than zero.")
    if decimal_amount.as_tuple().exponent < -2:
        raise InvalidAmountException(amount, "Amount cannot have more than two decimal places.")
    if decimal_amount > MAX_AMOUNT:
        raise ExcessiveAmountException(amount, MAX_AMOUNT)
