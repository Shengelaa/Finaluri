"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios-instance";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function CreateProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    desc: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [forbidden, setForbidden] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = getCookie("token");
      if (!token || typeof token !== "string") {
        router.replace("/");
        return;
      }
      try {
        const resp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 200 && resp.data.role !== "admin") {
          setForbidden(true);
          setTimeout(() => router.replace("/"), 1500);
        }
      } catch {
        deleteCookie("token");
        router.replace("/");
      }
      setChecked(true);
    };
    checkAdmin();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (file) formData.append("file", file);

    try {
      const res = await axiosInstance.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201 || res.status === 200) {
        setMessage("Product created!");
        setForm({ title: "", desc: "", price: "", quantity: "", category: "" });
        setFile(null);
      } else {
        setMessage("Failed to create product.");
      }
    } catch {
      setMessage("Error occurred.");
    }
    setLoading(false);
  };

  if (!checked) return null;

  if (forbidden) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600">FORBIDDEN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-red-600">
              You are not allowed to access this page.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Create a New Product</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                name="title"
                id="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Input
                name="desc"
                id="desc"
                placeholder="Description"
                value={form.desc}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                name="price"
                id="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                name="quantity"
                id="quantity"
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                name="category"
                id="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="file">Product Image</Label>
              <Input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>
            {message && (
              <div className="text-center text-sm text-green-600">
                {message}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
