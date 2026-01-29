"use client";

import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Product, productCategories } from "@/data/products";
import { Event } from "@/data/events";

const ADMIN_PASSWORD = "IBE2008admin"; // Change this password

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "events">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);

  const { products, events, addProduct, updateProduct, deleteProduct, addEvent, updateEvent, deleteEvent } = useData();

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem("ibe_admin_auth");
    if (session === "true") {
      setIsAuthenticated(true);
    }
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
            <span style={{ fontSize: "48px", fontWeight: 800, color: "#d69e2e" }}>IBE</span>
            <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc", marginTop: "16px" }}>Admin Login</h1>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(15, 20, 25, 0.8)",
                  border: "1px solid rgba(74, 85, 104, 0.4)",
                  borderRadius: "8px",
                  color: "#f7fafc",
                  fontSize: "16px",
                  outline: "none",
                }}
                placeholder="Enter admin password"
              />
            </div>
            {error && <p style={{ color: "#e53e3e", fontSize: "14px", marginBottom: "16px" }}>{error}</p>}
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                background: "#c05621",
                color: "#f7fafc",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.3s ease",
              }}
            >
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
      <header style={{ background: "rgba(26, 54, 93, 0.4)", borderBottom: "1px solid rgba(74, 85, 104, 0.3)", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "28px", fontWeight: 800, color: "#d69e2e" }}>IBE</span>
          <span style={{ color: "#a0aec0", fontSize: "14px" }}>Admin Panel</span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/" style={{ color: "#a0aec0", fontSize: "14px", textDecoration: "none" }}>View Site</a>
          <button onClick={handleLogout} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #a0aec0", borderRadius: "4px", color: "#a0aec0", fontSize: "14px", cursor: "pointer" }}>Logout</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "12px 24px",
              background: activeTab === "products" ? "#c05621" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "products" ? "#c05621" : "rgba(74, 85, 104, 0.4)",
              borderRadius: "8px",
              color: "#f7fafc",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("events")}
            style={{
              padding: "12px 24px",
              background: activeTab === "events" ? "#c05621" : "transparent",
              border: "1px solid",
              borderColor: activeTab === "events" ? "#c05621" : "rgba(74, 85, 104, 0.4)",
              borderRadius: "8px",
              color: "#f7fafc",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Events ({events.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#f7fafc" }}>Manage Products</h2>
              {!showAddProduct && !editingProduct && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  style={{ padding: "12px 24px", background: "#c05621", color: "#f7fafc", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                >
                  + Add Product
                </button>
              )}
            </div>

            {/* Add/Edit Product Form */}
            {(showAddProduct || editingProduct) && (
              <div style={{ background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f7fafc", marginBottom: "24px" }}>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <form onSubmit={handleProductSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Product Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product["category"] })}
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                      >
                        {productCategories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Description *</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      required
                      rows={3}
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Image Path</label>
                    <input
                      type="text"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="/images/your-image.jpg"
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                    />
                    <p style={{ fontSize: "12px", color: "#718096", marginTop: "8px" }}>Enter the path relative to public folder (e.g., /images/Breadrack.jpg)</p>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" style={{ padding: "12px 24px", background: "#c05621", color: "#f7fafc", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                      {editingProduct ? "Update Product" : "Add Product"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={{ padding: "12px 24px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div style={{ display: "grid", gap: "16px" }}>
              {productCategories.map((category) => {
                const categoryProducts = products.filter((p) => p.category === category.id);
                if (categoryProducts.length === 0) return null;
                return (
                  <div key={category.id}>
                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#d69e2e", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>{category.name}</h3>
                    <div style={{ display: "grid", gap: "12px" }}>
                      {categoryProducts.map((product) => (
                        <div key={product.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "8px" }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px" }}>{product.name}</h4>
                            <p style={{ fontSize: "13px", color: "#a0aec0" }}>{product.description.substring(0, 80)}...</p>
                            {product.image && <p style={{ fontSize: "12px", color: "#718096", marginTop: "4px" }}>Image: {product.image}</p>}
                          </div>
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => startEditProduct(product)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d69e2e", color: "#d69e2e", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                            <button onClick={() => { if (confirm("Delete this product?")) deleteProduct(product.id); }} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#e53e3e", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Delete</button>
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
                <button
                  onClick={() => setShowAddEvent(true)}
                  style={{ padding: "12px 24px", background: "#c05621", color: "#f7fafc", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
                >
                  + Add Event
                </button>
              )}
            </div>

            {/* Add/Edit Event Form */}
            {(showAddEvent || editingEvent) && (
              <div style={{ background: "rgba(26, 54, 93, 0.3)", border: "1px solid rgba(74, 85, 104, 0.3)", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#f7fafc", marginBottom: "24px" }}>{editingEvent ? "Edit Event" : "Add New Event"}</h3>
                <form onSubmit={handleEventSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Event Title *</label>
                      <input
                        type="text"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        required
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Date *</label>
                      <input
                        type="text"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                        required
                        placeholder="e.g., September 2025"
                        style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Location *</label>
                    <input
                      type="text"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      required
                      placeholder="e.g., Las Vegas, NV"
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Description *</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      required
                      rows={3}
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none", resize: "vertical" }}
                    />
                  </div>
                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#a0aec0", marginBottom: "8px" }}>Link (optional)</label>
                    <input
                      type="url"
                      value={eventForm.link}
                      onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })}
                      placeholder="https://example.com/event"
                      style={{ width: "100%", padding: "12px 16px", background: "rgba(15, 20, 25, 0.8)", border: "1px solid rgba(74, 85, 104, 0.4)", borderRadius: "8px", color: "#f7fafc", fontSize: "14px", outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="submit" style={{ padding: "12px 24px", background: "#c05621", color: "#f7fafc", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                      {editingEvent ? "Update Event" : "Add Event"}
                    </button>
                    <button type="button" onClick={cancelEdit} style={{ padding: "12px 24px", background: "transparent", border: "1px solid #a0aec0", color: "#a0aec0", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
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
                  <p style={{ color: "#a0aec0" }}>No events added yet. Click "Add Event" to create one.</p>
                </div>
              ) : (
                events.map((event) => (
                  <div key={event.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "rgba(26, 54, 93, 0.2)", border: "1px solid rgba(74, 85, 104, 0.2)", borderRadius: "8px" }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "16px", fontWeight: 600, color: "#f7fafc", marginBottom: "4px" }}>{event.title}</h4>
                      <p style={{ fontSize: "14px", color: "#d69e2e", marginBottom: "4px" }}>{event.date} - {event.location}</p>
                      <p style={{ fontSize: "13px", color: "#a0aec0" }}>{event.description.substring(0, 100)}...</p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => startEditEvent(event)} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #d69e2e", color: "#d69e2e", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Edit</button>
                      <button onClick={() => { if (confirm("Delete this event?")) deleteEvent(event.id); }} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #e53e3e", color: "#e53e3e", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>Delete</button>
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
