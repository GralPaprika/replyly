import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received Data:", body);

    const { priceFixed, priceMetered } = body;

    if (!priceFixed && !priceMetered) {
      return NextResponse.json(
        { error: "At least one price ID must be provided" },
        { status: 400 }
      );
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (priceFixed) {
      lineItems.push({
        price: priceFixed,
        quantity: 1,
      });
    }

    if (priceMetered) {
      lineItems.push({
        price: priceMetered,
      });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log("Checkout session created:", session.id);
    return NextResponse.json({ client_secret: session.client_secret });
  } catch (error: any) {
    console.error('Error creating checkout session:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
