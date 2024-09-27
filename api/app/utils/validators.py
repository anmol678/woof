import re
from decimal import Decimal
from app.constants import ACCOUNT_NUMBER_LENGTH, CUSTOMER_NUMBER_LENGTH


def validate_account_number(account_number: str) -> bool:
    return bool(re.match(f"^\\d{{{ACCOUNT_NUMBER_LENGTH}}}$", account_number))

def validate_customer_number(customer_number: str) -> bool:
    return bool(re.match(f"^\\d{{{CUSTOMER_NUMBER_LENGTH}}}$", customer_number))

def validate_amount(amount: float) -> bool:
    decimal_amount = Decimal(str(amount)).normalize()
    return decimal_amount > 0 and decimal_amount.as_tuple().exponent >= -2
