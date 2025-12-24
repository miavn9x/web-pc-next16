// Backend - Interface cho Contact
export interface ContactMailData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  subject: string;
  content: string;
}

export interface OrderMailData {
  code: string;
  email: string;
  phone: string;
  shippingAddress: string;
  totalPrice: number;
}
