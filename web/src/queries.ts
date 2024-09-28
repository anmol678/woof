import { Customer, CustomerCreate, Account, AccountCreate, Transfer, TransferCreate } from '@/types'
import { get, post } from '@/client'

enum Endpoint {
  CUSTOMERS = '/customers',
  ACCOUNTS = '/accounts',
  TRANSFERS = '/transfers'
}

export class CustomerQuery {
  static getAll(): Promise<Customer[]> {
    return get(Endpoint.CUSTOMERS)
  }

  static get(customerNumber: string): Promise<Customer> {
    return get(`${Endpoint.CUSTOMERS}/${customerNumber}`)
  }

  static getAccounts(customerNumber: string): Promise<Account[]> {
    return get(`${Endpoint.CUSTOMERS}/${customerNumber}/accounts`)
  }

  static create(customer: CustomerCreate): Promise<Customer> {
    return post(Endpoint.CUSTOMERS, customer)
  }
}

export class AccountQuery {
  static getAll(): Promise<Account[]> {
    return get(Endpoint.ACCOUNTS)
  }

  static get(accountNumber: string): Promise<Account> {
    return get(`${Endpoint.ACCOUNTS}/${accountNumber}`)
  }

  static getTransfers(accountNumber: string): Promise<Transfer[]> {
    return get(`${Endpoint.ACCOUNTS}/${accountNumber}/transfers`)
  }

  static create(account: AccountCreate): Promise<Account> {
    return post(Endpoint.ACCOUNTS, account)
  }
}

export class TransferQuery {
  static create(transfer: TransferCreate): Promise<Transfer> {
    return post(Endpoint.TRANSFERS, transfer)
  }
}
