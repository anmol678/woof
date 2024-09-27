import re

from app.models import ACCOUNT_NUMBER_LENGTH, CUSTOMER_NUMBER_LENGTH


def validate_account_number(account_number: str) -> bool:
    return bool(re.match(f"^\\d{{{ACCOUNT_NUMBER_LENGTH}}}$", account_number))

def validate_customer_number(customer_number: str) -> bool:
    return bool(re.match(f"^\\d{{{CUSTOMER_NUMBER_LENGTH}}}$", customer_number))
