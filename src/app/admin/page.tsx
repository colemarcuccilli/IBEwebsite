"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import ibeLogo from "@/assets/IBENewLogo.png";
import type { ProductRow, EventRow, ContactRow, CategoryRow } from "@/lib/supabase/types";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  background: "rgba(15, 20, 25, 0.8)",
  border: "1px solid rgba(74, 85, 104, 0.4)",
  borderRadius: "8px",
  color: "#f7fafc",
  fontSize: "14px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 500,
  color: "#a0aec0",
  marginBottom: "8px",
};

const btnPrimary: React.CSSProperties = {
  padding: "12px 24px",
  background: "linear-gradient(135deg, #dd6b20, #c05621)",
  color: "#f7fafc",
  border: "none",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  padding: "12px 24px",
  background: "transparent",
  border: "1px solid #a0aec0",
  color: "#a0aec0",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
};

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, { ...opts, credentials: "include" });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  return res.json();
}

// Convert "2026-03" to "March 2026" for display
function monthValueToDisplay(val: string): string {
  if (!val || !val.includes("-")) return val;
  const [year, month] = val.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// Convert "March 2026" to "2026-03" for the input
function displayToMonthValue(display: string): string {
  if (!display) return "";
  // If already in YYYY-MM format, return as-is
  if (/^\d{4}-\d{2}$/.test(display)) return display;
  const parsed = new Date(display + " 1");
  if (isNaN(parsed.getTime())) return "";
  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "events" | "customers">("products");

  // Products state
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({ name: "", description: "", image_url: "", pdf_url: "", category: "bakery", sort_order: 0 });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [deleteCatConfirm, setDeleteCatConfirm] = useState<string | null>(null);

  // Events state
  const [events, setEvents] = useState<EventRow[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", date: "", location: "", description: "", link: "", pdf_url: "" });
  const [uploadingEventPdf, setUploadingEventPdf] = useState(false);

  // Customers state
  const [contacts, setContacts] = useState<ContactRow[]>([]);

  // Shared state
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/products");
      setProducts(data);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") { setIsAuthenticated(false); return; }
      console.error("Failed to load products", err);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/categories");
      setCategories(data);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") { setIsAuthenticated(false); return; }
      console.error("Failed to load categories", err);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/events");
      setEvents(data);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") { setIsAuthenticated(false); return; }
      console.error("Failed to load events", err);
    }
  }, []);

  const loadContacts = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/contacts");
      setContacts(data);
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") { setIsAuthenticated(false); return; }
      console.error("Failed to load contacts", err);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadCategories();
      loadEvents();
      loadContacts();
    }
  }, [isAuthenticated, loadProducts, loadCategories, loadEvents, loadContacts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setIsAuthenticated(true);
      setPassword("");
    } catch {
      setLoginError("Incorrect password");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setIsAuthenticated(false);
  };

  // File upload helper
  const handleFileUpload = async (file: File, target: "product_image" | "product_pdf" | "event_pdf") => {
    const setUploading = target === "product_image" ? setUploadingImage : target === "product_pdf" ? setUploadingPdf : setUploadingEventPdf;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const data = await apiFetch("/api/admin/upload", { method: "POST", body: form });
      if (target === "product_image") {
        setProductForm((prev) => ({ ...prev, image_url: data.url }));
      } else if (target === "product_pdf") {
        setProductForm((prev) => ({ ...prev, pdf_url: data.url }));
      } else {
        setEventForm((prev) => ({ ...prev, pdf_url: data.url }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Category CRUD
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setSaving(true);
    setError("");
    try {
      const id = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await apiFetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: newCategoryName.trim(), sort_order: categories.length }),
      });
      setNewCategoryName("");
      setShowAddCategory(false);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setError("");
    try {
      await apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      setDeleteCatConfirm(null);
      await loadCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setDeleteCatConfirm(null);
    }
  };

  // Product CRUD
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingProduct) {
        await apiFetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productForm),
        });
      } else {
        const id = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await apiFetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...productForm, id }),
        });
      }
      cancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const startEditProduct = (product: ProductRow) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      image_url: product.image_url || "",
      pdf_url: product.pdf_url || "",
      category: product.category,
      sort_order: product.sort_order || 0,
    });
    setShowAddProduct(false);
  };

  // Event CRUD
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Convert YYYY-MM to display format for storage
      const dateToStore = eventForm.date.includes("-")
        ? monthValueToDisplay(eventForm.date)
        : eventForm.date;

      if (editingEvent) {
        await apiFetch(`/api/admin/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventForm, date: dateToStore }),
        });
      } else {
        const id = eventForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await apiFetch("/api/admin/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...eventForm, id, date: dateToStore }),
        });
      }
      cancelEdit();
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await apiFetch(`/api/admin/events/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await loadEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const startEditEvent = (event: EventRow) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: displayToMonthValue(event.date) || event.date,
      location: event.location,
      description: event.description,
      link: event.link || "",
      pdf_url: event.pdf_url || "",
    });
    setShowAddEvent(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditingEvent(null);
    setShowAddProduct(false);
    setShowAddEvent(false);
    setShowAddCategory(false);
    setProductForm({ name: "", description: "", image_url: "", pdf_url: "", category: categories[0]?.id || "bakery", sort_order: 0 });
    setEventForm({ title: "", date: "", location: "", description: "", link: "", pdf_url: "" });
    setError("");
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f1419", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "400px", width: "100%", background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "16px", padding: "48px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <Image src={ibeLogo} alt="IBE" width={140} height={70} style={{ objectFit: "contain", margin: "0 auto 16px" }} />
            <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc", marginTop: "16px" }}>Admin Login</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Enter admin password" />
            </div>
            {loginError && <p style={{ color: "#e53e3e", fontSize: "14px", marginBottom: "16px" }}>{loginError}</p>}
            <button type="submit" style={{ ...btnPrimary, width: "100%", padding: "14px" }}>Login</button>
          </form>
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <a href="/" style={{ color: "#a0aec0", fontSize: "14px", textDecoration: "none" }}>← Back to Website</a>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div style={{ minHeight: "100vh", background: "#0f1419" }}>
      {/* Header */}
      <header style={{ background: "rgba(26, 54, 93, 0.4)", borderBottom: "1px solid rgba(74, 85, 104, 0.3)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Image src={ibeLogo} alt="IBE" width={80} height={40} style={{ objectFit: "contain" }} />
          <span style={{ color: "#a0aec0", fontSize: "14px", borderLeft: "1px solid rgba(74, 85, 104, 0.4)", paddingLeft: "16px" }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/" style={{ color: "#a0aec0", fontSize: "14px", textDecoration: "none" }}>View Site</a>
          <button onClick={handleLogout} style={btnSecondary}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(229, 62, 62, 0.15)", border: "1px solid rgba(229, 62, 62, 0.3)", borderRadius: "8px", color: "#fc8181", fontSize: "14px", marginBottom: "24px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          {(["products", "events", "customers"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); cancelEdit(); }}
              style={{
                padding: "12px 24px",
                background: activeTab === tab ? "linear-gradient(135deg, #dd6b20, #c05621)" : "transparent",
                border: "1px solid",
                borderColor: activeTab === tab ? "#dd6b20" : "rgba(74, 85, 104, 0.4)",
                borderRadius: "8px",
                color: "#f7fafc",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {tab === "products" ? `Products (${products.length})` : tab === "events" ? `Events (${events.length})` : `Customers (${contacts.length})`}
            </button>
          ))}
        </div>

        {/* ─── Products Tab ─── */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Manage Products</h2>
              {!showAddProduct && !editingProduct && (
                <button onClick={() => setShowAddProduct(true)} style={btnPrimary}>+ Add Product</button>
              )}
            </div>

            {/* Categories Management */}
            <div style={{ background: "rgba(26, 54, 93, 0.15)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#a0aec0", textTransform: "uppercase", letterSpacing: "1.5px" }}>Categories</h3>
                {!showAddCategory && (
                  <button onClick={() => setShowAddCategory(true)} style={{ padding: "6px 14px", background: "transparent", border: "1px solid rgba(74, 85, 104, 0.4)", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>+ Add Category</button>
                )}
              </div>
              {showAddCategory && (
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    style={{ ...inputStyle, flex: 1 }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCategory(); } }}
                  />
                  <button onClick={handleAddCategory} disabled={saving} style={{ ...btnPrimary, padding: "8px 16px", fontSize: "12px" }}>Add</button>
                  <button onClick={() => { setShowAddCategory(false); setNewCategoryName(""); }} style={{ ...btnSecondary, padding: "8px 16px", fontSize: "12px" }}>Cancel</button>
                </div>
              )}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                  <div key={cat.id} style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "6px" }}>
                    <span style={{ fontSize: "13px", color: "#f7fafc" }}>{cat.name}</span>
                    {deleteCatConfirm === cat.id ? (
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button onClick={() => deleteCategory(cat.id)} style={{ padding: "2px 8px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}>Yes</button>
                        <button onClick={() => setDeleteCatConfirm(null)} style={{ padding: "2px 8px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "4px", fontSize: "11px", cursor: "pointer" }}>No</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteCatConfirm(cat.id)} style={{ padding: "0", background: "none", border: "none", color: "#fc8181", cursor: "pointer", fontSize: "14px", lineHeight: 1 }}>×</button>
                    )}
                  </div>
                ))}
                {categories.length === 0 && <span style={{ fontSize: "13px", color: "#718096" }}>No categories yet. Add one above.</span>}
              </div>
            </div>

            {/* Add/Edit Product Form */}
            {(showAddProduct || editingProduct) && (
              <div style={{ background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f7fafc", marginBottom: "24px" }}>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <form onSubmit={handleProductSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={labelStyle}>Product Name *</label>
                      <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id} style={{ background: "#0f1419" }}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={labelStyle}>Sort Order</label>
                      <input type="number" value={productForm.sort_order} onChange={(e) => setProductForm({ ...productForm, sort_order: parseInt(e.target.value) || 0 })} style={inputStyle} />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Product Image</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <label style={{ ...btnSecondary, display: "inline-block", cursor: "pointer" }}>
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          style={{ display: "none" }}
                          disabled={uploadingImage}
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, "product_image"); }}
                        />
                      </label>
                      {productForm.image_url && (
                        <span style={{ fontSize: "13px", color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                          {productForm.image_url.split("/").pop()}
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <label style={{ ...labelStyle, fontSize: "12px" }}>Or enter URL directly:</label>
                      <input type="text" value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} placeholder="https://... or /images/..." style={inputStyle} />
                    </div>
                    {productForm.image_url && (
                      <div style={{ marginTop: "12px", position: "relative", width: "200px", height: "140px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(74, 85, 104, 0.3)" }}>
                        <Image src={productForm.image_url} alt="Preview" fill style={{ objectFit: "cover" }} sizes="200px" />
                      </div>
                    )}
                  </div>

                  {/* PDF Upload */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>PDF Spec Sheet</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <label style={{ ...btnSecondary, display: "inline-block", cursor: "pointer" }}>
                        {uploadingPdf ? "Uploading..." : "Upload PDF"}
                        <input
                          type="file"
                          accept=".pdf"
                          style={{ display: "none" }}
                          disabled={uploadingPdf}
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, "product_pdf"); }}
                        />
                      </label>
                      {productForm.pdf_url && (
                        <span style={{ fontSize: "13px", color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                          {decodeURIComponent(productForm.pdf_url.split("/").pop() || "")}
                        </span>
                      )}
                      {productForm.pdf_url && (
                        <button type="button" onClick={() => setProductForm({ ...productForm, pdf_url: "" })} style={{ padding: "0", background: "none", border: "none", color: "#fc8181", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</button>
                      )}
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <label style={{ ...labelStyle, fontSize: "12px" }}>Or enter PDF URL directly:</label>
                      <input type="text" value={productForm.pdf_url} onChange={(e) => setProductForm({ ...productForm, pdf_url: e.target.value })} placeholder="https://... or /pdf/..." style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                      {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={btnSecondary}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div style={{ display: "grid", gap: "24px" }}>
              {categories.map((category) => {
                const categoryProducts = products.filter((p) => p.category === category.id);
                if (categoryProducts.length === 0) return null;
                return (
                  <div key={category.id}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#dd6b20", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      {category.name} ({categoryProducts.length})
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {categoryProducts.map((product) => (
                        <div key={product.id} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px 20px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", background: "rgba(43, 108, 176, 0.1)", flexShrink: 0, position: "relative" }}>
                            {product.image_url ? (
                              <Image src={product.image_url} alt={product.name} fill style={{ objectFit: "cover" }} sizes="64px" />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5568", fontSize: "10px", textAlign: "center", padding: "4px" }}>No image</div>
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px", wordBreak: "break-word" }}>{product.name}</h4>
                            <p style={{ fontSize: "13px", color: "#a0aec0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>{product.description}</p>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <button onClick={() => startEditProduct(product)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2b6cb0", color: "#63b3ed", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                            {deleteConfirm === product.id ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button onClick={() => deleteProduct(product.id)} style={{ padding: "8px 12px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>No</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#fc8181", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Delete</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {/* Products with no matching category */}
              {(() => {
                const catIds = new Set(categories.map((c) => c.id));
                const uncategorized = products.filter((p) => !catIds.has(p.category));
                if (uncategorized.length === 0) return null;
                return (
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#718096", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      Uncategorized ({uncategorized.length})
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {uncategorized.map((product) => (
                        <div key={product.id} style={{ display: "flex", alignItems: "flex-start", gap: "16px", padding: "16px 20px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px", wordBreak: "break-word" }}>{product.name} <span style={{ fontSize: "12px", color: "#718096" }}>({product.category})</span></h4>
                            <p style={{ fontSize: "13px", color: "#a0aec0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.5" }}>{product.description}</p>
                          </div>
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            <button onClick={() => startEditProduct(product)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2b6cb0", color: "#63b3ed", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                            {deleteConfirm === product.id ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button onClick={() => deleteProduct(product.id)} style={{ padding: "8px 12px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>Confirm</button>
                                <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>No</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#fc8181", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Delete</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              {products.length === 0 && (
                <div style={{ padding: "48px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ color: "#a0aec0" }}>No products yet. Click &quot;Add Product&quot; to create one, or run the seed script to import defaults.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Events Tab ─── */}
        {activeTab === "events" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Manage Events</h2>
              {!showAddEvent && !editingEvent && (
                <button onClick={() => setShowAddEvent(true)} style={btnPrimary}>+ Add Event</button>
              )}
            </div>

            {(showAddEvent || editingEvent) && (
              <div style={{ background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f7fafc", marginBottom: "24px" }}>
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <form onSubmit={handleEventSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={labelStyle}>Event Title *</label>
                      <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Month *</label>
                      <input
                        type="month"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                        style={{ ...inputStyle, colorScheme: "dark" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Location *</label>
                    <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required placeholder="e.g., Las Vegas, NV" style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required rows={3} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Link (optional)</label>
                    <input type="url" value={eventForm.link} onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })} placeholder="https://example.com/event" style={inputStyle} />
                  </div>

                  {/* Event PDF Upload */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>PDF Attachment (optional)</label>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <label style={{ ...btnSecondary, display: "inline-block", cursor: "pointer" }}>
                        {uploadingEventPdf ? "Uploading..." : "Upload PDF"}
                        <input
                          type="file"
                          accept=".pdf"
                          style={{ display: "none" }}
                          disabled={uploadingEventPdf}
                          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file, "event_pdf"); }}
                        />
                      </label>
                      {eventForm.pdf_url && (
                        <span style={{ fontSize: "13px", color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "300px" }}>
                          {decodeURIComponent(eventForm.pdf_url.split("/").pop() || "")}
                        </span>
                      )}
                      {eventForm.pdf_url && (
                        <button type="button" onClick={() => setEventForm({ ...eventForm, pdf_url: "" })} style={{ padding: "0", background: "none", border: "none", color: "#fc8181", cursor: "pointer", fontSize: "16px", lineHeight: 1 }}>×</button>
                      )}
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <label style={{ ...labelStyle, fontSize: "12px" }}>Or enter PDF URL directly:</label>
                      <input type="text" value={eventForm.pdf_url} onChange={(e) => setEventForm({ ...eventForm, pdf_url: e.target.value })} placeholder="https://... or /pdf/..." style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }}>
                      {saving ? "Saving..." : editingEvent ? "Update Event" : "Add Event"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={btnSecondary}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Events List */}
            <div style={{ display: "grid", gap: "16px" }}>
              {events.length === 0 ? (
                <div style={{ padding: "48px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "12px", textAlign: "center" }}>
                  <p style={{ color: "#a0aec0" }}>No events added yet. Click &quot;Add Event&quot; to create one.</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "10px", gap: "16px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px" }}>{event.title}</h4>
                      <p style={{ fontSize: "14px", color: "#dd6b20", marginBottom: "4px" }}>{event.date} — {event.location}</p>
                      <p style={{ fontSize: "13px", color: "#a0aec0", wordBreak: "break-word" }}>{event.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button onClick={() => startEditEvent(event)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2b6cb0", color: "#63b3ed", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Edit</button>
                      {deleteConfirm === event.id ? (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button onClick={() => deleteEvent(event.id)} style={{ padding: "8px 12px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(event.id)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#fc8181", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}>Delete</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ─── Customers Tab ─── */}
        {activeTab === "customers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Customer Submissions</h2>
              <button onClick={loadContacts} style={btnSecondary}>Refresh</button>
            </div>

            {contacts.length === 0 ? (
              <div style={{ padding: "48px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "12px", textAlign: "center" }}>
                <p style={{ color: "#a0aec0" }}>No form submissions yet.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(74, 85, 104, 0.4)" }}>
                      {["Date", "Name", "Email", "Company", "Phone", "Products", "Message"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#a0aec0", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => (
                      <tr key={c.id} style={{ borderBottom: "1px solid rgba(74, 85, 104, 0.2)" }}>
                        <td style={{ padding: "12px 16px", color: "#a0aec0", whiteSpace: "nowrap" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: "12px 16px", color: "#f7fafc", fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: "12px 16px", color: "#63b3ed" }}>{c.email}</td>
                        <td style={{ padding: "12px 16px", color: "#a0aec0" }}>{c.company || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#a0aec0" }}>{c.phone || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#a0aec0", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.products || c.product_interest || "—"}</td>
                        <td style={{ padding: "12px 16px", color: "#a0aec0", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
