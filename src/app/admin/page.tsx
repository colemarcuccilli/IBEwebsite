"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useData } from "@/context/DataContext";
import { Product, productCategories } from "@/data/products";
import { Event } from "@/data/events";
import ibeLogo from "@/assets/IBENewLogo.png";

const ADMIN_PASSWORD = "IBE2008admin";

// Available images in public/images — add new filenames here after uploading
const availableImages = [
  { path: "/images/Breadrack.jpg", label: "Bread Rack" },
  { path: "/images/BreadTransport RackwithBuns.jpg", label: "Bread Transport Rack with Buns" },
  { path: "/images/Carryout Cropped.jpg", label: "Carryout Cart" },
  { path: "/images/cropped tub.jpg", label: "Dough Trough" },
  { path: "/images/Donut Basket.jpg", label: "Donut Basket" },
  { path: "/images/Glazing Rack.jpg", label: "Glazing Rack" },
  { path: "/images/LS3 Mail Cart.jpg", label: "LS3 Mail Cart" },
  { path: "/images/LS4 Mail Cart.jpg", label: "LS4 Mail Cart" },
  { path: "/images/Pan Rack Cropped new.jpg", label: "Pan Rack" },
  { path: "/images/Pie Rack.JPG", label: "Pie Rack" },
  { path: "/images/Receiving Cart - Closed.jpg", label: "Receiving Cart (Closed)" },
  { path: "/images/Receiving Cart - Fully open.jpg", label: "Receiving Cart (Open)" },
  { path: "/images/Receiving Cart - Half Open.jpg", label: "Receiving Cart (Half Open)" },
  { path: "/images/Seafood Rack.jpg", label: "Seafood Rack" },
];

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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "events">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { products, events, addProduct, updateProduct, deleteProduct, addEvent, updateEvent, deleteEvent } = useData();

  useEffect(() => {
    const session = sessionStorage.getItem("ibe_admin_auth");
    if (session === "true") setIsAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("ibe_admin_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("ibe_admin_auth");
  };

  // Product form state
  const [productForm, setProductForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    image: "",
    category: "bakery",
  });

  // Event form state
  const [eventForm, setEventForm] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    location: "",
    description: "",
    link: "",
  });

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      addProduct({ ...productForm, id: `product-${Date.now()}` });
      setShowAddProduct(false);
    }
    setProductForm({ name: "", description: "", image: "", category: "bakery" });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent(editingEvent.id, eventForm);
      setEditingEvent(null);
    } else {
      addEvent({ ...eventForm, id: `event-${Date.now()}` });
      setShowAddEvent(false);
    }
    setEventForm({ title: "", date: "", location: "", description: "", link: "" });
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
    });
    setShowAddProduct(false);
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      link: event.link || "",
    });
    setShowAddEvent(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditingEvent(null);
    setShowAddProduct(false);
    setShowAddEvent(false);
    setProductForm({ name: "", description: "", image: "", category: "bakery" });
    setEventForm({ title: "", date: "", location: "", description: "", link: "" });
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p style={{ color: "#e53e3e", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
            <button type="submit" style={{ ...btnPrimary, width: "100%", padding: "14px" }}>
              Login
            </button>
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
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {(["products", "events"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
              {tab === "products" ? `Products (${products.length})` : `Events (${events.length})`}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Manage Products</h2>
              {!showAddProduct && !editingProduct && (
                <button onClick={() => setShowAddProduct(true)} style={btnPrimary}>
                  + Add Product
                </button>
              )}
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
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product["category"] })}
                        style={{ ...inputStyle, cursor: "pointer" }}
                      >
                        {productCategories.map((cat) => (
                          <option key={cat.id} value={cat.id} style={{ background: "#0f1419" }}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>

                  {/* Image Picker */}
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Product Image</label>
                    <select
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="" style={{ background: "#0f1419" }}>No image</option>
                      {availableImages.map((img) => (
                        <option key={img.path} value={img.path} style={{ background: "#0f1419" }}>
                          {img.label}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: "12px", color: "#718096", marginTop: "8px" }}>
                      Select from available images. To add new images, a developer must upload them to the repository.
                    </p>

                    {/* Image Preview */}
                    {productForm.image && (
                      <div style={{ marginTop: "12px", position: "relative", width: "200px", height: "140px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(74, 85, 104, 0.3)" }}>
                        <Image
                          src={productForm.image}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="200px"
                        />
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" style={btnPrimary}>
                      {editingProduct ? "Update Product" : "Add Product"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={btnSecondary}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div style={{ display: "grid", gap: "24px" }}>
              {productCategories.map((category) => {
                const categoryProducts = products.filter((p) => p.category === category.id);
                if (categoryProducts.length === 0) return null;
                return (
                  <div key={category.id}>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#dd6b20", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                      {category.name} ({categoryProducts.length})
                    </h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {categoryProducts.map((product) => (
                        <div
                          key={product.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            padding: "16px 20px",
                            background: "rgba(26, 54, 93, 0.2)",
                            border: "1px solid rgba(74, 85, 104, 0.2)",
                            borderRadius: "10px",
                            transition: "border-color 0.2s",
                          }}
                        >
                          {/* Thumbnail */}
                          <div style={{ width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", background: "rgba(43, 108, 176, 0.1)", flexShrink: 0, position: "relative" }}>
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill style={{ objectFit: "cover" }} sizes="64px" />
                            ) : (
                              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#4a5568", fontSize: "10px", textAlign: "center", padding: "4px" }}>
                                No image
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px" }}>{product.name}</h4>
                            <p style={{ fontSize: "13px", color: "#a0aec0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {product.description}
                            </p>
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                            <button
                              onClick={() => startEditProduct(product)}
                              style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2b6cb0", color: "#63b3ed", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
                            >
                              Edit
                            </button>
                            {deleteConfirm === product.id ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                <button
                                  onClick={() => { deleteProduct(product.id); setDeleteConfirm(null); }}
                                  style={{ padding: "8px 12px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  style={{ padding: "8px 12px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(product.id)}
                                style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#fc8181", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Manage Events</h2>
              {!showAddEvent && !editingEvent && (
                <button onClick={() => setShowAddEvent(true)} style={btnPrimary}>
                  + Add Event
                </button>
              )}
            </div>

            {/* Add/Edit Event Form */}
            {(showAddEvent || editingEvent) && (
              <div style={{ background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f7fafc", marginBottom: "24px" }}>
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h3>
                <form onSubmit={handleEventSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={labelStyle}>Event Title *</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Date *</label>
                      <input
                        type="text"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                        placeholder="e.g., September 2025"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Location *</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                      placeholder="e.g., Las Vegas, NV"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Description *</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={labelStyle}>Link (optional)</label>
                    <input
                      type="url"
                      value={eventForm.link}
                      onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })}
                      placeholder="https://example.com/event"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" style={btnPrimary}>
                      {editingEvent ? "Update Event" : "Add Event"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={btnSecondary}>
                      Cancel
                    </button>
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
                  <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px" }}>{event.title}</h4>
                      <p style={{ fontSize: "14px", color: "#dd6b20", marginBottom: "4px" }}>{event.date} — {event.location}</p>
                      <p style={{ fontSize: "13px", color: "#a0aec0" }}>{event.description}</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0, marginLeft: "16px" }}>
                      <button
                        onClick={() => startEditEvent(event)}
                        style={{ padding: "8px 16px", background: "transparent", border: "1px solid #2b6cb0", color: "#63b3ed", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
                      >
                        Edit
                      </button>
                      {deleteConfirm === event.id ? (
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() => { deleteEvent(event.id); setDeleteConfirm(null); }}
                            style={{ padding: "8px 12px", background: "#e53e3e", border: "none", color: "#fff", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            style={{ padding: "8px 12px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(event.id)}
                          style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#fc8181", borderRadius: "6px", fontSize: "12px", cursor: "pointer", fontWeight: 500 }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
