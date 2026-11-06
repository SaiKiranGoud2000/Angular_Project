export interface AppNotification {
    id: number;
    customerName: string;
    phone: string;
    email: string;
    productName: string;
    createdAt: string;
    status: 'new' | 'contacted';
}
