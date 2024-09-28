
export type CustomerCreate = {
  name: string;
};

export type Customer = {
  id: number;
  name: string;
  customer_number: string;
};

export type AccountCreate = {
  customer_number: string;
  initial_deposit: number;
};

export type Account = {
  id: number;
  account_number: string;
  balance: number;
  customer_number: string;
};

export type TransferCreate = {
  amount: number;
  sender_account_number: string;
  receiver_account_number: string;
};

export type Transfer = {
  id: number;
  amount: number;
  timestamp: string;
  sender_account_number: string;
  receiver_account_number: string;
};
