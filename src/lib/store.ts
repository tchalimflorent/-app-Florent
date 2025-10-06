import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { PaymentLink } from '@shared/types';
import { api } from './api-client';
type NewPaymentLinkPayload = {
  amount: number;
  description: string;
  expiresAt?: number;
};
type PaymentLinkStore = {
  paymentLinks: PaymentLink[];
  isLoading: boolean;
  fetchPaymentLinks: () => Promise<void>;
  addPaymentLink: (link: NewPaymentLinkPayload) => Promise<PaymentLink>;
  deletePaymentLink: (id: string) => Promise<void>;
  getPaymentLinkById: (id: string) => PaymentLink | undefined;
};
export const usePaymentLinkStore = create<PaymentLinkStore>()(
  immer((set, get) => ({
    paymentLinks: [],
    isLoading: true,
    fetchPaymentLinks: async () => {
      set({ isLoading: true });
      try {
        const data = await api<{ items: PaymentLink[] }>('/api/payment-links');
        set({ paymentLinks: data.items, isLoading: false });
      } catch (error)
      {
        console.error("Failed to fetch payment links:", error);
        set({ isLoading: false });
      }
    },
    addPaymentLink: async (linkDetails) => {
      const newLink = await api<PaymentLink>('/api/payment-links', {
        method: 'POST',
        body: JSON.stringify(linkDetails),
      });
      set((state) => {
        state.paymentLinks.unshift(newLink);
      });
      return newLink;
    },
    deletePaymentLink: async (id: string) => {
      // Optimistic update
      const originalLinks = get().paymentLinks;
      set((state) => {
        state.paymentLinks = state.paymentLinks.filter((link) => link.id !== id);
      });
      try {
        await api(`/api/payment-links/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error("Failed to delete payment link:", error);
        // Revert on failure
        set({ paymentLinks: originalLinks });
      }
    },
    getPaymentLinkById: (id: string) => {
      return get().paymentLinks.find((link) => link.id === id);
    },
  }))
);