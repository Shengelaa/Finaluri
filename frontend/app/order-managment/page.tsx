"use client";

import { axiosInstance } from "@/lib/axios-instance";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { set } from "react-hook-form";
import { Button } from "@/components/ui/button";

type User = {
  _id: string;
  email: string;
  role: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
  _id: string;
};

type ShippingAddress = {
  country: string;
  city: string;
  street: string;
  building: string;
  _id: string;
};

type PaymentDetails = {
  cardNumber: string;
  expiry: string;
  cvv: string;
  _id: string;
};

type Order = {
  _id: string;
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
};

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkOrder, setCheckOrder] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          router.push("/auth/sign-in");
          return;
        }

        const userResp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userResp.status === 200) {
          const currentUser: User = userResp.data;
          setUser(currentUser);

          if (currentUser.role.toLowerCase() !== "admin") {
            router.push("/");
            return;
          }

          const params = new URLSearchParams({ id: currentUser._id });
          const ordersResp = await axiosInstance.get(
            `/orders?${params.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (ordersResp.status === 200) {
            setOrders(ordersResp.data);
          }
        } else {
          router.push("/auth/sign-in");
        }
      } catch (error) {
        console.error(error);
        deleteCookie("token");
        router.push("/auth/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 font-semibold text-lg">
        Loading...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 ">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 border-b border-gray-800 pb-4">
        Orders List
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="border border-gray-800 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md bg-gray-400  border-[5px] border-black pt-3 "
            >
              <CardHeader className="border-b border-gray-300 pb-3">
                <CardTitle className="text-xl font-semibold text-white">
                  Order ID: {order._id}
                </CardTitle>
                <CardDescription className="text-sm text-white">
                  Created at:{" "}
                  {new Date(order.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-white bg-gray-400">
                <div>
                  <h3 className="font-semibold mb-1 border-b border-gray-200 pb-1 text-white">
                    Shipping Address
                  </h3>
                  <p className="text-black font-bold underline">
                    {order.shippingAddress.building},{" "}
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                    , {order.shippingAddress.country}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1 border-b border-gray-200 pb-1 text-white">
                    Payment Details
                  </h3>
                  <p className="text-black font-bold underline">
                    Card Number: **** **** ****{" "}
                    {order.paymentDetails.cardNumber.slice(-4)} <br />
                    Expiry: {order.paymentDetails.expiry}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1 border-b border-gray-200 pb-1 text-white">
                    Items
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 max-h-36 overflow-auto ">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className="text-black font-bold underline"
                      >
                        Product ID: {item.productId} — Quantity: {item.quantity}{" "}
                        — Price: ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="font-semibold text-lg text-gray-900">
                  Total: <span className="text-white">${order.total}</span>
                </div>

                {order.userEmail && (
                  <div className="text-sm text-gray-600">
                    User Email: {order.userEmail}
                  </div>
                )}
              </CardContent>

              <div className="w-full flex flex-col justify-bottom align-bottom items-center h-full">
                <Button className="w-fit">Check Order Out.</Button>
                <Button className="w-fit mt-2">Order Done, {"(Delete)"}</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
