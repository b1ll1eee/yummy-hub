import { EnumType } from "typescript";

export interface HistoryData {
    orderId: string;
    store: {
        storeId?: string,
        name: string,
        address: string,
        latitude: number,
        longitude: number,
        imgStore: string,
        storeOpen: string,
        storeClose: string,
        rating: number
    };
    orderDate: string;
    orderStatus: string;
    totalAmount: number;
    filepath: string | null;
    paymentDate: string | null;
    paymentStatus: string;
    pickupCode: string;
    pickupDate: string | null;
    pickupStatus: string;
    createdate: string;
    updatedate: string | null;
  }
