export interface transaction {
  username: string;
  receiver: string;
  value: number;
}

export interface transactionsToFilter {
  extract: {
    type: string;
    id: number;
    debitedAccountId: number;
    creditedAccountId: number;
    value: number;
    createdAt: Date;
  }[];
  dateFilter?: string;
  typeFilter?: transactionType;
}

export type transactionType = "debit" | "credit";
