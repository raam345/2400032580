import React, { useMemo, useState } from "react";
import { ShoppingCart, Leaf, Plus, Minus, Trash2, Check } from "lucide-react";

// --- Utility helpers ---
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

const PRODUCTS = [
  {
    id: "pothos",
    name: "Golden Pothos",
    price: 299,
    category: "Easy Care",
    img: "https://images.unsplash.com/photo-1623302005222-ec8a7df2aee9?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "snake",
    name: "Snake Plant",
    price: 399,
    category: "Air Purifying",
    img: "https://images.unsplash.com/photo-1602595688238-9fffe12d5354?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "zz",
    name: "ZZ Plant",
    price: 449,
    category: "Low Light",
    img: "https://images.unsplash.com/photo-1598899134739-24b1393bb5a8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "monstera",
    name: "Monstera Deliciosa",
    price: 799,
    category: "Statement Plants",
    img: "https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "peace",
    name: "Peace Lily",
    price: 499,
    category: "Air Purifying",
    img: "https://images.unsplash.com/photo-1605196566824-4b8c8f784f2b?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: "succulent",
    name: "Mini Succulent",
    price: 199,
    category: "Easy Care",
    img: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop"
  }
];

const CATEGORIES = [
  "Easy Care",
  "Air Purifying",
  "Low Light",
  "Statement Plants"
];

export default function App() {
  const [activePage, setActivePage] = useState("products"); // "products" | "cart"
  // cart: Record<productId, quantity>
  const [cart, setCart] = useState({});

  const totalItems = useMemo(
    () => Object.values(cart).reduce((a, b) => a + b, 0),
    [cart]
  );
  const totalCost = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [pid, qty]) => {
        const p = PRODUCTS.find((x) => x.id === pid);
        return sum + (p ? p.price * qty : 0);
      }, 0),
    [cart]
  );

  function addToCart(pid) {
    setCart((prev) => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));
  }
  function inc(pid) {
    addToCart(pid);
  }
  function dec(pid) {
    setCart((prev) => {
      const next = { ...prev };
      if (!next[pid]) return prev;
      next[pid] = next[pid] - 1;
      if (next[pid] <= 0) delete next[pid];
      return next;
    });
  }
  function del(pid) {
    setCart((prev) => {
      const next = { ...prev };
      delete next[pid];
      return next;
    });
  }

  const inCart = (pid) => (cart[pid] || 0) > 0;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header
        totalItems={totalItems}
        onNav={(p) => setActivePage(p)}
        activePage={activePage}
      />

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        {activePage === "products" ? (
          <ProductListing
            products={PRODUCTS}
            categories={CATEGORIES}
            onAdd={addToCart}
            inCart={inCart}
          />
        ) : (
          <CartPage
            cart={cart}
            onInc={inc}
            onDec={dec}
            onDel={del}
            totalItems={totalItems}
            totalCost={totalCost}
            toProducts={() => setActivePage("products")}
          />
        )}
      </main>

      <footer className="py-8 text-center text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Leaf & Co. • Happy planting!</p>
      </footer>
    </div>
  );
}

function Header({ totalItems, onNav, activePage }) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4 md:p-5">
        <div className="flex items-center gap-2">
          <Leaf className="h-7 w-7" />
          <span className="text-xl font-semibold">Leaf & Co.</span>
        </div>
        <nav className="flex items-center gap-2">
          <button
            onClick={() => onNav("products")}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 ${
              activePage === "products" ? "bg-neutral-900 text-white" : "bg-white"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => onNav("cart")}
            className={`relative rounded-2xl px-4 py-2 text-sm font-medium transition hover:bg-neutral-100 ${
              activePage === "cart" ? "bg-neutral-900 text-white" : "bg-white"
            }`}
            aria-label="Cart"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Cart
            </span>
            <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-neutral-900 px-2 text-xs font-semibold text-white shadow">
              {totalItems}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}

function ProductListing({ products, categories, onAdd, inCart }) {
  return (
    <div className="space-y-10">
      <h1 className="text-2xl md:text-3xl font-bold">Houseplants</h1>
      <p className="text-neutral-600">Browse by category and add your favourites to the cart.</p>

      {/* Grouped by at least three categories */}
      {categories.map((cat) => {
        const items = products.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} className="space-y-4">
            <h2 className="text-xl font-semibold">{cat}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <article
                  key={p.id}
                  className="group rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-44 w-full rounded-t-2xl object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-neutral-900">{p.name}</h3>
                      <span className="text-sm font-medium text-neutral-700">{INR.format(p.price)}</span>
                    </div>
                    <button
                      onClick={() => onAdd(p.id)}
                      disabled={inCart(p.id)}
                      className={`w-full rounded-xl px-4 py-2 text-sm font-medium shadow transition ${
                        inCart(p.id)
                          ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                          : "bg-neutral-900 text-white hover:-translate-y-0.5 hover:shadow-md"
                      }`}
                    >
                      {inCart(p.id) ? (
                        <span className="inline-flex items-center gap-2">
                          <Check className="h-4 w-4" /> Added
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Add to Cart
                        </span>
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function CartPage({ cart, onInc, onDec, onDel, totalItems, totalCost, toProducts }) {
  const entries = Object.entries(cart);
  const detailed = entries
    .map(([pid, qty]) => {
      const p = PRODUCTS.find((x) => x.id === pid);
      return p ? { ...p, qty } : null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Your Cart</h1>
        <button
          onClick={toProducts}
          className="rounded-2xl bg-white px-4 py-2 text-sm font-medium shadow hover:bg-neutral-100"
        >
          Continue Shopping
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {detailed.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-600">
              Your cart is empty. Add some leafy friends!
            </div>
          ) : (
            detailed.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-neutral-600">Unit: {INR.format(item.price)}</p>
                    </div>
                    <button
                      onClick={() => onDel(item.id)}
                      className="rounded-xl border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      <Trash2 className="inline-block h-4 w-4 mr-1" /> Delete
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onDec(item.id)}
                        className="rounded-xl border border-neutral-300 p-2 hover:bg-neutral-100"
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center font-semibold">{item.qty}</span>
                      <button
                        onClick={() => onInc(item.id)}
                        className="rounded-xl border border-neutral-300 p-2 hover:bg-neutral-100"
                        aria-label={`Increase ${item.name}`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-sm text-neutral-700">
                      Subtotal: <span className="font-semibold">{INR.format(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <aside className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Summary</h2>
          <div className="flex items-center justify-between text-sm">
            <span>Total items</span>
            <span className="font-semibold">{totalItems}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Total cost</span>
            <span className="font-semibold">{INR.format(totalCost)}</span>
          </div>
          <button
            onClick={() => alert("Checkout – Coming Soon!")}
            className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:-translate-y-0.5 hover:shadow-md"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={toProducts}
            className="w-full rounded-xl bg-white px-4 py-2 font-medium shadow hover:bg-neutral-100"
          >
            Continue Shopping
          </button>
        </aside>
      </div>
    </div>
  );
}
