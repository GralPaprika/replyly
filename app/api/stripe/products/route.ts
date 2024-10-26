import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-09-30.acacia' });

export async function GET() {
    try {
      const products = await stripe.products.list({ active: true });
  
      const productData = await Promise.all(
        products.data.map(async (product) => {
          // Fetch all prices associated with this product
          const prices = await stripe.prices.list({
            product: product.id,
            active: true, // Fetch only active prices
          });
  
          // Combine product and its prices
          return { ...product, prices: prices.data };
        })
      );
  
      return NextResponse.json(productData);
    } catch (error:any) {
      console.error('Error fetching products and prices:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  
