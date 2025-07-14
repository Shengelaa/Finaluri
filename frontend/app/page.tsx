"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios-instance";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "./CartContext";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const { cart, addToCart } = useCart();

  useEffect(() => {
    const t = getCookie("token");
    if (!t || typeof t !== "string") {
      router.push("/auth/sign-in");
      return;
    }
    setToken(t);
    setTokenChecked(true);
  }, []);

  const fetchProducts = async (token: string) => {
    const resp = await axiosInstance.get("/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (resp.status === 200 && Array.isArray(resp.data)) {
      const data = resp.data.map((p: any) => ({
        ...p,
        id: p._id,
      }));
      setPosts(data);
    } else {
      setPosts([]);
    }
  };

  useEffect(() => {
    if (!token) return;

    const getCurrentUser = async () => {
      try {
        const resp = await axiosInstance.get("/auth/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.status === 200) {
          setUser(resp.data);
        }
      } catch (e) {
        deleteCookie("token");
        router.push("/auth/sign-in");
      }
    };

    getCurrentUser();
    fetchProducts(token);
  }, [token]);

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({
      title: product.title,
      desc: product.desc,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    });
    setEditFile(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === "file" && files && files[0]) {
      setEditFile(files[0]);
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (id: string) => {
    setEditLoading(true);
    try {
      if (editFile) {
        const formData = new FormData();
        Object.entries(editForm).forEach(([key, value]) =>
          formData.append(key, value as string)
        );
        formData.append("file", editFile);
        await axiosInstance.patch(`/products/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.patch(
          `/products/${id}`,
          {
            ...editForm,
            price: Number(editForm.price),
            quantity: Number(editForm.quantity),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId: user._id },
          }
        );
      }
      setEditingId(null);
      setEditFile(null);
      fetchProducts(token!);
    } catch {}
    setEditLoading(false);
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Uechveli wamshleli xar ??")) return;

    if (!user || !user._id) {
      alert("User not loaded. Please try again.");
      return;
    }

    await axiosInstance.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { userId: user._id },
    });

    fetchProducts(token!);
  };

  if (!tokenChecked) return null;

  const filteredPosts = posts.filter((p) =>
    p.category.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 bg-white/80 rounded-xl shadow p-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Shoes Catalog
          </h1>
          <p className="text-gray-500 text-lg">
            Browse and manage shoes. Search by{" "}
            <span className="font-semibold">category</span>.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xl">
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <Input
              type="text"
              placeholder="Search by category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full cursor-text"
            />
          </div>

          <button
            className="relative ml-2 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/cart")}
            aria-label="Cart"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="20" cy="21" r="1.5" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          {user?.role === "admin" && (
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/create-product")}
            >
              + New Product
            </Button>
          )}
        </div>
      </header>
      {user?.role === "admin" && (
        <h2 className="text-1xl font-bold mb-8 text-center text-green-600">
          Welcome, {user.name}! You are logged in as an admin.
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {filteredPosts.length === 0 && (
          <div className="col-span-full text-center text-gray-400 text-lg py-10">
            No products found.
          </div>
        )}
        {filteredPosts.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
            transition={{ duration: 0.7 }}
            className="flex flex-col h-full shadow-lg bg-white rounded-xl"
          >
            {p.imageUrl && (
              <div className="px-4 pt-4">
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="h-48 object-cover rounded-lg w-full"
                  style={{ objectPosition: "center" }}
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{p.title}</CardTitle>
              <CardDescription className="mb-2">{p.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {editingId === p.id ? (
                <form
                  className="flex flex-col gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit(p.id);
                  }}
                >
                  <Label htmlFor="title">Title</Label>
                  <Input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    name="desc"
                    value={editForm.desc}
                    onChange={handleEditChange}
                    required
                  />
                  <Label htmlFor="category">Category</Label>
                  <Input
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                  />
                  <Label htmlFor="price">Price</Label>
                  <Input
                    name="price"
                    type="number"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                  />
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    name="quantity"
                    type="number"
                    value={editForm.quantity}
                    onChange={handleEditChange}
                    required
                  />
                  <Label htmlFor="edit-image">Image</Label>
                  <Input
                    name="image"
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleEditChange}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button type="submit" disabled={editLoading}>
                      {editLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        setEditingId(null);
                        setEditFile(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-2">
                    <span className="font-semibold">Category:</span>{" "}
                    {p.category}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Price:</span> ${p.price}
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Quantity:</span>{" "}
                    {p.quantity}
                  </div>
                  <div className="text-xs text-gray-500 mb-[20px]">
                    Created: {new Date(p.createdAt).toLocaleString()}
                  </div>
                  <Button
                    className="mt-2 mb-4 cursor-pointer"
                    onClick={() => addToCart(p)}
                  >
                    Add to Cart
                  </Button>
                </>
              )}
            </CardContent>
            {user?.role === "admin" && editingId !== p.id && (
              <CardFooter className="flex gap-2 mb-4">
                <Button variant="outline" onClick={() => handleEdit(p)}>
                  Edit
                </Button>
                <Button
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
