// app/api/check-customer/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY env var is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const runtime = 'nodejs';

type PostBody = {
  email?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as PostBody;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    /* Step 1: find customers that match the email */
    const custSearch = await stripe.customers.search({
      query: `email:'${email}'`,
      limit: 2,
    });

    if (custSearch.data.length === 0) {
      return NextResponse.json({ exists: false });
    }

    // choose the most recent customer if duplicates exist
    const customer = [...custSearch.data].sort(
      (a, b) => b.created - a.created
    )[0];

    /* Step 2: list active subscriptions for that customer */
    const subs = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'active',
      expand: ['data.items.data.price'],
      limit: 1,
    });

    return NextResponse.json({
      exists: true,
      customer,
      activeSubscription: subs.data[0] ?? null,

      metadata : subs.data[0]?.metadata ?? null
    });
  } catch (err) {
    console.error('Stripe lookup failed:', err);
    const msg = err instanceof Error ? err.message : 'Failed to check customer';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
