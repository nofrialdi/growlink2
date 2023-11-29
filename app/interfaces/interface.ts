export interface TransactionCategory {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  type: string;
  description: string | any;
  amount: number;
  transactionTime: string;

  transactionCategoryId: string;
  transactionCategory: TransactionCategory;
}

export interface Product {
  id: number;
  name: string;
}

export interface Yield {
  id: number;
  productId: number;
  plantingTime: string;
  harvestTime: any;
  description: string;
  quantity: number;
  isHarvested: boolean;
  product: Product;
}
