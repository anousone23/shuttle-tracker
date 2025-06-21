export interface IUser {
  id: string;
  email: string;
  created_at: Date;
  active_until: Date;
}

export interface IShuttlecockTube {
  id: string;
  seller_id: string;
  name: string;
  price: number;
  remaining?: number;
}

export interface IShuttlecock {
  id: string;
  shuttlecock_tube_id: string;
  number: string;
  seller_id: string;
  price: number;
}

export interface ICustomer {
  id: string;
  name: string;
  seller_id: string;
}

export interface ISale {
  id: string;
  shuttlecock_id: string;
  customer_id: string;
  created_at: Date;
  seller_id: string;
}

export type PrevStateType = {
  success: boolean;
  error: string | null;
};
