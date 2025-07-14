"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useCart } from "@/app/CartContext";
import { axiosInstance } from "@/lib/axios-instance";

const checkoutSchema = yup.object({
  country: yup.string().required("Country is required"),
  city: yup.string().required("City is required"),
  street: yup.string().required("Street is required"),
  building: yup.string().required("Building is required"),
  cardNumber: yup.string().required("Card Number is required"),

  expiry: yup.string().required("Expiry is required"),

  cvv: yup
    .string()
    .required("CVV is required")
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

type CheckoutFormData = yup.InferType<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema),
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axiosInstance.post(
        "/orders",
        {
          shippingAddress: {
            country: data.country,
            city: data.city,
            street: data.street,
            building: data.building,
          },
          paymentDetails: {
            cardNumber: data.cardNumber,
            expiry: data.expiry,
            cvv: data.cvv,
          },
          total,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      console.log(response);

      if (response.status === 201 || response.status === 200) {
        toast.success("Order placed successfully!");
        clearCart();
        router.push("/orders/success");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error("Checkout failed.");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/")}>
              Back to HomePage
            </Button>
          </CardAction>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Shipping Address</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="country" className="mb-2 ml-1">
                    Country
                  </Label>
                  <Input
                    id="country"
                    {...register("country")}
                    aria-invalid={!!errors.country}
                    placeholder="Country"
                  />
                  {errors.country && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="city" className="mb-2 ml-1">
                    City
                  </Label>
                  <Input
                    id="city"
                    {...register("city")}
                    aria-invalid={!!errors.city}
                    placeholder="City"
                  />
                  {errors.city && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="street" className="mb-2 ml-1">
                    Street
                  </Label>
                  <Input
                    id="street"
                    {...register("street")}
                    aria-invalid={!!errors.street}
                    placeholder="Street"
                  />
                  {errors.street && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.street.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="building" className="mb-2 ml-1">
                    Building
                  </Label>
                  <Input
                    id="building"
                    {...register("building")}
                    aria-invalid={!!errors.building}
                    placeholder="Building"
                  />
                  {errors.building && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.building.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Payment Details</h3>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="cardNumber" className="mb-2 ml-1">
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    {...register("cardNumber")}
                    maxLength={16}
                    placeholder="1234123412341234"
                    aria-invalid={!!errors.cardNumber}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="expiry" className="mb-2 ml-1">
                    Expiry (MM/YY)
                  </Label>
                  <Input
                    id="expiry"
                    {...register("expiry")}
                    maxLength={5}
                    placeholder="MM/YY"
                    aria-invalid={!!errors.expiry}
                  />
                  {errors.expiry && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.expiry.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cvv" className="mb-2 ml-1">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    {...register("cvv")}
                    maxLength={4}
                    type="password"
                    placeholder="123"
                    aria-invalid={!!errors.cvv}
                  />
                  {errors.cvv && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex justify-between items-center w-full mt-4">
              <div className="text-xl font-bold">
                Total: ${total.toFixed(2)}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
