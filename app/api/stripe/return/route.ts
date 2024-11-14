// /app/api/stripe/return/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      message: 'Checkout session retrieved successfully',
      session,
    });
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
