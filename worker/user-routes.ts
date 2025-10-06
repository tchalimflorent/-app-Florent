import { Hono } from "hono";
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import type { Env } from './core-utils';
import { PaymentLinkEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { PaymentLink } from "@shared/types";
const createLinkSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(3).max(100),
  expiresAt: z.number().optional(),
});
// Helper to check and update link status based on expiration
const checkExpiration = (link: PaymentLink): PaymentLink => {
  if (link.status === 'pending' && link.expiresAt && link.expiresAt < Date.now()) {
    return { ...link, status: 'expired' };
  }
  return link;
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PUBLIC ROUTE to get a single payment link
  app.get('/api/public/links/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const linkEntity = new PaymentLinkEntity(c.env, id);
    if (!await linkEntity.exists()) return notFound(c, 'Payment link not found');
    const link = await linkEntity.getState();
    return ok(c, checkExpiration(link));
  });
  // PUBLIC ROUTE to simulate payment
  app.post('/api/public/links/:id/pay', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const linkEntity = new PaymentLinkEntity(c.env, id);
    if (!await linkEntity.exists()) return notFound(c, 'Payment link not found');
    const currentLink = await linkEntity.getState();
    const checkedLink = checkExpiration(currentLink);
    if (checkedLink.status !== 'pending') {
      return bad(c, `Payment link cannot be paid. Status is: ${checkedLink.status}`);
    }
    await linkEntity.patch({ status: 'paid' });
    const updatedLink = await linkEntity.getState();
    return ok(c, updatedLink);
  });
  // PROTECTED ROUTES (mocked auth for now)
  // List all payment links
  app.get('/api/payment-links', async (c) => {
    const page = await PaymentLinkEntity.list(c.env);
    // Check expiration and sort by creation date descending
    const processedItems = page.items
      .map(checkExpiration)
      .sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, { ...page, items: processedItems });
  });
  // Create a new payment link
  app.post('/api/payment-links', zValidator('json', createLinkSchema), async (c) => {
    const { amount, description, expiresAt } = c.req.valid('json');
    const newLink: PaymentLink = {
      id: crypto.randomUUID(),
      amount,
      description,
      currency: 'USD',
      status: 'pending',
      createdAt: Date.now(),
      expiresAt,
    };
    const created = await PaymentLinkEntity.create(c.env, newLink);
    return ok(c, created);
  });
  // Get a single payment link (protected)
  app.get('/api/payment-links/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const linkEntity = new PaymentLinkEntity(c.env, id);
    if (!await linkEntity.exists()) return notFound(c, 'Payment link not found');
    const link = await linkEntity.getState();
    return ok(c, checkExpiration(link));
  });
  // Delete a payment link
  app.delete('/api/payment-links/:id', async (c) => {
    const id = c.req.param('id');
    if (!isStr(id)) return bad(c, 'Invalid ID');
    const deleted = await PaymentLinkEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Payment link not found');
    return ok(c, { id, deleted });
  });
}