import secrets
import string
from sqlalchemy.ext.asyncio import AsyncSession

from app.constants import MAX_RETRIES

def generate_number(length):
    first_digit = secrets.choice(string.digits[1:])  # First digit from 1-9
    other_digits = ''.join(secrets.choice(string.digits) for _ in range(length - 1))
    return first_digit + other_digits

async def generate_unique_number(db: AsyncSession, length: int, check_func):
    for _ in range(MAX_RETRIES):
        number = generate_number(length)
        if not await check_func(db, number):
            return number
    raise ValueError(f"Unable to generate a unique number after {MAX_RETRIES} attempts")
