"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useRef, useState } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface Product {
  id: string;
  name: string;
  description: string;
  priceFixed: { id: string; unit_amount: number; currency: string } | null;
  priceMetered: { id: string; unit_amount: number; currency: string } | null;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPrices, setSelectedPrices] = useState<{
    priceFixed: string | null;
    priceMetered: string | null;
  }>({ priceFixed: null, priceMetered: null });

  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/stripe/products");
        const data = await response.json();

        const transformedProducts = data.map((product: any) => {
          const priceFixed = product.prices.find(
            (price: any) => price.recurring && price.recurring.meter === null
          );
          const priceMetered = product.prices.find(
            (price: any) => price.recurring && price.recurring.meter !== null
          );

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            priceFixed: priceFixed
              ? {
                  id: priceFixed.id,
                  unit_amount: priceFixed.unit_amount,
                  currency: priceFixed.currency,
                }
              : null,
            priceMetered: priceMetered
              ? {
                  id: priceMetered.id,
                  unit_amount: priceMetered.unit_amount,
                  currency: priceMetered.currency,
                }
              : null,
          };
        });

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchClientSecret = useCallback(() => {
    return fetch("/api/stripe/embedded-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedPrices),
    })
      .then((res) => res.json())
      .then((data) => data.client_secret);
  }, [selectedPrices]);

  const options = { fetchClientSecret };

  const openModal = (
    priceFixed: string | null,
    priceMetered: string | null
  ) => {
    setSelectedPrices({ priceFixed, priceMetered });
    setShowCheckout(true);
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    setShowCheckout(false);
    modalRef.current?.close();
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card shadow-xl p-4">
            <h2 className="text-2xl font-semibold">{product.name}</h2>
            <p className="text-gray-500">{product.description}</p>
            <div className="mt-4 space-y-2">
              {product.priceFixed && (
                <p className="text-lg">
                  Fixed Price: {product.priceFixed.currency.toUpperCase()}{" "}
                  {(product.priceFixed.unit_amount / 100).toFixed(2)}
                </p>
              )}
              {product.priceMetered && (
                <p className="text-lg">
                  Metered Price: {product.priceMetered.currency.toUpperCase()}{" "}
                  {(product.priceMetered.unit_amount / 100).toFixed(2)}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary mt-4"
              onClick={() =>
                openModal(
                  product.priceFixed?.id || null,
                  product.priceMetered?.id || null
                )
              }
            >
              Subscribe to {product.name}
            </button>
          </div>
        ))}
      </div>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Embedded Checkout</h3>
          <div className="py-4">
            {showCheckout && (
              <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
              >
                <EmbeddedCheckout />
              </EmbeddedCheckoutProvider>
            )}
          </div>
          <div className="modal-action">
            <button className="btn btn-error" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
