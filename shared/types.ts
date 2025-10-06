export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Types for EdgePay
export interface PaymentLink {
  id: string;
  amount: number;
  currency: 'USD';
  description: string;
  status: 'pending' | 'paid' | 'expired';
  createdAt: number; // epoch millis
  expiresAt?: number; // epoch millis
}