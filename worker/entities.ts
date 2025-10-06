import { IndexedEntity } from "./core-utils";
import type { PaymentLink } from "@shared/types";
// PAYMENT LINK ENTITY: one DO instance per payment link
export class PaymentLinkEntity extends IndexedEntity<PaymentLink> {
  static readonly entityName = "paymentLink";
  static readonly indexName = "paymentLinks";
  static readonly initialState: PaymentLink = {
    id: "",
    amount: 0,
    currency: 'USD',
    description: "",
    status: 'pending',
    createdAt: 0,
  };
}