import { buffer } from 'micro';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

export const config = { api: { bodyParser: false } }; 

export async function POST(req: NextRequest) {
  const buf = await buffer(req as any); 
  const sig = req.headers.get('stripe-signature')!; 

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    console.log('Payment succeeded:', invoice);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
