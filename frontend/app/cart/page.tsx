"use client";

import { useCart } from "@/app/CartContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart, decreaseQuantity, clearCart } =
    useCart();

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Button
        variant="link"
        className="flex self-start w-full justify-end cursor-pointer text-md"
        onClick={() => router.push("/")}
      >
        Back to HomePage
      </Button>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-sm text-gray-500">
                      ${item.price} x {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    -
                  </Button>

                  <Button
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    +
                  </Button>

                  <Button
                    className="bg-white text-black border-[1.5px] border-black cursor-pointer hover:bg-red-800 hover:text-white hover:border-white transition-all duration-400"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex justify-between items-center">
            <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
