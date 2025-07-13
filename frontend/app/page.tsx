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
    await axiosInstance.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchProducts(token!);
  };

  if (!tokenChecked) return null;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      {user?.role === "admin" && (
        <h1 className="text-1xl font-bold mb-8 text-center text-green-600">
          Welcome, {user.name}! You are logged in as an admin. more buttons will
          show
        </h1>
      )}
      {user?.role === "admin" && (
        <Button
          className="cursor-pointer"
          onClick={() => router.push("/create-product")}
        >
          Create A New Product
        </Button>
      )}
      <h1 className="text-3xl font-bold mb-8 text-center">Product Catalog</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {posts.map((p) => (
          <Card className="flex flex-col h-full shadow-lg" key={p.id}>
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
                  <div className="text-xs text-gray-500">
                    Created: {new Date(p.createdAt).toLocaleString()}
                  </div>
                </>
              )}
            </CardContent>
            {user?.role === "admin" && editingId !== p.id && (
              <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={() => handleEdit(p)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
