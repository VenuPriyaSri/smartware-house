import React, { useState, useMemo, useEffect } from "react";
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import {
  prioritizeOrders,
  detectBottlenecks,
  calculateMetrics,
  getReorderRecommendations
} from "./warehouseEngine";
import "./warehouse-styles.css";

/* ==================== PRODUCT CATALOG ==================== */

const PRODUCT_CATALOG = [
  { id: "P001", name: "Laptop Pro 14", category: "Electronics", price: 64999, originalPrice: 79999, stock: 3, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 245, badge: "Deal", description: "High-performance laptop with 16GB RAM" },
  { id: "P002", name: "Smartphone X", category: "Electronics", price: 24999, originalPrice: 29999, stock: 5, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 512, badge: "Bestseller", description: "Latest flagship smartphone" },
  { id: "P003", name: "Wireless Keyboard", category: "Accessories", price: 1499, originalPrice: 1999, stock: 0, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 89, badge: "Soon", description: "Ergonomic wireless keyboard" },
  { id: "P004", name: "Wireless Mouse", category: "Accessories", price: 899, originalPrice: 1299, stock: 32, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 234, badge: null, description: "Precision tracking mouse" },
  { id: "P005", name: "USB-C Cable", category: "Accessories", price: 499, originalPrice: 699, stock: 67, image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 567, badge: null, description: "Fast charging cable" },
  { id: "P006", name: "Monitor 24 inch", category: "Electronics", price: 11999, originalPrice: 14999, stock: 12, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80", rating: 4.9, reviews: 178, badge: "Hot", description: "4K Ultra HD Monitor" },
  { id: "P007", name: "Wireless Headphones", category: "Accessories", price: 3499, originalPrice: 5999, stock: 15, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 342, badge: "Deal", description: "Noise-canceling headphones" },
  { id: "P008", name: "USB Hub 7-Port", category: "Accessories", price: 2499, originalPrice: 3499, stock: 21, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 156, badge: null, description: "Multi-port USB hub" },
  { id: "P009", name: "Webcam HD 1080p", category: "Electronics", price: 2999, originalPrice: 4499, stock: 8, image: "https://images.unsplash.com/photo-1580495817784-0d9ad4d33900?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 203, badge: "Deal", description: "Crystal clear video" },
  { id: "P010", name: "Laptop Stand", category: "Accessories", price: 1299, originalPrice: 1999, stock: 18, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 95, badge: null, description: "Adjustable laptop stand" },
  { id: "P011", name: "Men Casual Shirt", category: "Men", price: 1899, originalPrice: 2499, stock: 24, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 154, badge: "New", description: "Premium cotton shirt for everyday comfort" },
  { id: "P012", name: "Women Fashion Dress", category: "Women", price: 3299, originalPrice: 4999, stock: 18, image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 332, badge: "Trending", description: "Elegant dress for casual and party looks" },
  { id: "P013", name: "Kids School Backpack", category: "Kids", price: 1599, originalPrice: 2199, stock: 40, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 123, badge: null, description: "Durable backpack for school and travel" },
  { id: "P014", name: "Basmati Rice 5kg", category: "Grocery", price: 499, originalPrice: 699, stock: 80, image: "https://images.unsplash.com/photo-1586201375761-83865001a7d2?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 250, badge: "Fresh", description: "Premium quality rice for daily meals" },
  { id: "P015", name: "Fruit Basket", category: "Grocery", price: 799, originalPrice: 1199, stock: 36, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 470, badge: "Healthy", description: "Fresh seasonal fruits packed with nutrition" },
  { id: "P016", name: "Milk Pack 1L", category: "Grocery", price: 69, originalPrice: 99, stock: 120, image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80", rating: 4.3, reviews: 95, badge: null, description: "Farm fresh milk for everyday use" },
  { id: "P017", name: "Men Running Shoes", category: "Men", price: 3599, originalPrice: 5299, stock: 22, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 410, badge: "Top Rated", description: "Comfortable shoes built for movement" },
  { id: "P018", name: "Women Handbag", category: "Women", price: 2499, originalPrice: 3499, stock: 12, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 269, badge: "Lite", description: "Elegant handbag with roomy storage" },
  { id: "P019", name: "Smart Watch Elite", category: "Electronics", price: 6999, originalPrice: 8999, stock: 14, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 540, badge: "Popular", description: "Track fitness, health and notifications all day" },
  { id: "P020", name: "AirPods Pro", category: "Electronics", price: 19999, originalPrice: 25999, stock: 9, image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80", rating: 4.9, reviews: 610, badge: "Deal", description: "Wireless earbuds with immersive sound and noise cancellation" },
  { id: "P021", name: "Gaming Controller", category: "Electronics", price: 3499, originalPrice: 4699, stock: 17, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 188, badge: null, description: "Responsive controller for PC and console gaming" },
  { id: "P022", name: "Portable SSD 1TB", category: "Electronics", price: 7999, originalPrice: 10999, stock: 11, image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 281, badge: "Hot", description: "Compact storage for work and travel" },
  { id: "P023", name: "Classic Sunglasses", category: "Accessories", price: 1499, originalPrice: 2199, stock: 28, image: "https://images.unsplash.com/photo-1577803947579-9f39f0d5bfa3?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 175, badge: null, description: "UV-protected shades for street and beach style" },
  { id: "P024", name: "Travel Charger", category: "Accessories", price: 899, originalPrice: 1299, stock: 44, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 132, badge: null, description: "Fast-charge adapter for all major devices" },
  { id: "P025", name: "Polo T-Shirt", category: "Men", price: 1299, originalPrice: 1899, stock: 52, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 214, badge: null, description: "Smart casual tee for daily wear" },
  { id: "P026", name: "Denim Jeans", category: "Men", price: 2799, originalPrice: 3999, stock: 33, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 298, badge: "Trending", description: "Classic fit jeans with comfort stretch" },
  { id: "P027", name: "Leather Wallet", category: "Men", price: 1799, originalPrice: 2499, stock: 19, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 116, badge: null, description: "Premium leather wallet with slim design" },
  { id: "P028", name: "Formal Watch", category: "Men", price: 4999, originalPrice: 6999, stock: 8, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 201, badge: "Luxury", description: "Classic watch for formal and daily wear" },
  { id: "P029", name: "Kurta Set", category: "Women", price: 2899, originalPrice: 4099, stock: 26, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80", rating: 4.7, reviews: 323, badge: "Festive", description: "Traditional comfort wear for festive days" },
  { id: "P030", name: "Casual Sneakers", category: "Women", price: 2399, originalPrice: 3499, stock: 21, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 196, badge: null, description: "Everyday sneakers with soft cushioning" },
  { id: "P031", name: "Diamond Earrings", category: "Women", price: 4599, originalPrice: 6999, stock: 13, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80", rating: 4.9, reviews: 342, badge: "Gift", description: "Stylish earrings made for special moments" },
  { id: "P032", name: "Silk Scarf", category: "Women", price: 1099, originalPrice: 1699, stock: 39, image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 122, badge: null, description: "Soft fabric scarf for finishing every outfit" },
  { id: "P033", name: "Kids T-Shirt", category: "Kids", price: 699, originalPrice: 999, stock: 58, image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 87, badge: null, description: "Soft cotton tee for active children" },
  { id: "P034", name: "Toy Train Set", category: "Kids", price: 1999, originalPrice: 2799, stock: 16, image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 220, badge: "Fun", description: "Creative playset for imaginative hours" },
  { id: "P035", name: "Kids Water Bottle", category: "Kids", price: 499, originalPrice: 799, stock: 63, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80", rating: 4.3, reviews: 72, badge: null, description: "Leak-proof bottle for school and outings" },
  { id: "P036", name: "Kids Sports Shoes", category: "Kids", price: 1799, originalPrice: 2499, stock: 25, image: "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 171, badge: "Popular", description: "Lightweight sports shoes for playtime" },
  { id: "P037", name: "Onion 1kg", category: "Grocery", price: 59, originalPrice: 89, stock: 140, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80", rating: 4.4, reviews: 110, badge: null, description: "Fresh and clean onions for daily cooking" },
  { id: "P038", name: "Fresh Mangoes", category: "Grocery", price: 199, originalPrice: 299, stock: 90, image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80", rating: 4.8, reviews: 256, badge: "Seasonal", description: "Sweet mangoes full of flavor and nutrition" },
  { id: "P039", name: "Atta 5kg", category: "Grocery", price: 289, originalPrice: 399, stock: 110, image: "https://images.unsplash.com/photo-1582515073490-39981397c445?auto=format&fit=crop&w=900&q=80", rating: 4.6, reviews: 174, badge: "Staple", description: "Whole wheat flour for everyday home meals" },
  { id: "P040", name: "Tea Leaves Pack", category: "Grocery", price: 179, originalPrice: 249, stock: 95, image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80", rating: 4.5, reviews: 143, badge: null, description: "Aromatic tea leaves for refreshing moments" }
];

const getSearchMatches = (query = "", categoryName = "Any") => {
  const normalizedQuery = query.trim().toLowerCase();
  const selectedCategory = categoryName && categoryName !== "Any" && categoryName !== "All" ? categoryName.toLowerCase() : "";

  return PRODUCT_CATALOG.filter((product) => {
    const queryMatches = !normalizedQuery ||
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.id.toLowerCase().includes(normalizedQuery) ||
      (product.badge && product.badge.toLowerCase().includes(normalizedQuery));

    const categoryMatches = !selectedCategory || product.category.toLowerCase() === selectedCategory;

    return queryMatches && categoryMatches;
  });
};

/* ==================== AMAZON HEADER ==================== */

function AmazonHeader({ cart, searchQuery, setSearchQuery, onSearch }) {
  const navigate = useNavigate();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="amazon-header">
      <div className="header-top">
        <div className="header-left">
          <Link to="/" className="logo">
            🛒 Smart<span>Store</span>
          </Link>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && onSearch()} className="search-input" />
          <button className="search-btn" onClick={onSearch}>🔍</button>
        </div>

        <div className="header-right">
          <Link to="/account" className="header-optionLink">
            <span className="header-optionLineOne">👤</span>
            <span className="header-optionLineTwo">Account</span>
          </Link>
          <Link to="/order" className="header-optionLink">
            <span className="header-optionLineOne">📦</span>
            <span className="header-optionLineTwo">Order</span>
          </Link>
          <Link to="/orders" className="header-optionLink">
            <span className="header-optionLineOne">🧾</span>
            <span className="header-optionLineTwo">Orders</span>
          </Link>
          <Link to="/cart" className="header-optionLink cart-option">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cartCount}</span>
          </Link>
        </div>
      </div>

      <div className="header-bottom">
        <div className="nav-items">
          <Link to="/order" className="nav-item">Order 🛍️</Link>
          <Link to="/deals" className="nav-item">All Deals 🎁</Link>
          <Link to="/all-products" className="nav-item">All Products 🛍️</Link>
          <Link to="/electronics" className="nav-item">Electronics 💻</Link>
          <Link to="/men" className="nav-item">Men 👕</Link>
          <Link to="/women" className="nav-item">Women 👗</Link>
          <Link to="/kids" className="nav-item">Kids 🎒</Link>
          <Link to="/grocery" className="nav-item">Grocery 🛒</Link>
          <Link to="/warehouse" className="nav-item admin">Warehouse 🏭</Link>
        </div>
      </div>
    </header>
  );
}

/* ==================== WAREHOUSE NAVBAR ==================== */

function WarehouseNavbar() {
  const location = useLocation();
  return (
    <nav className="warehouse-navbar">
      <div className="nav-brand">
        <h2>🏭 Smart Warehouse</h2>
      </div>
      <div className="nav-links">
        <Link to="/warehouse/dashboard" className={location.pathname === "/warehouse/dashboard" ? "active" : ""}>📊 Dashboard</Link>
        <Link to="/warehouse/orders" className={location.pathname === "/warehouse/orders" ? "active" : ""}>🛒 Orders</Link>
        <Link to="/warehouse/inventory" className={location.pathname === "/warehouse/inventory" ? "active" : ""}>📦 Inventory</Link>
        <Link to="/warehouse/picking" className={location.pathname === "/warehouse/picking" ? "active" : ""}>📋 Picking</Link>
        <Link to="/warehouse/packing" className={location.pathname === "/warehouse/packing" ? "active" : ""}>📦 Packing</Link>
        <Link to="/warehouse/shipping" className={location.pathname === "/warehouse/shipping" ? "active" : ""}>🚚 Shipping</Link>
        <Link to="/" className="nav-item">🛍️ Back to Store</Link>
      </div>
    </nav>
  );
}

/* ==================== HOME PAGE ==================== */

function HomePage({ cart, setCart, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    } else {
      navigate(`/all-products`);
    }
  };

  const featuredProducts = PRODUCT_CATALOG.filter(p => p.badge).slice(0, 6);

  return (
    <div className="amazon-home">
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Welcome to SmartStore</h1>
          <p>Shop millions of products at great prices</p>
          <div className="hero-search">
            <input type="text" placeholder="Search for products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSearch()} />
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <h2>🌟 Featured Deals</h2>
        <div className="featured-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
          ))}
        </div>
      </div>

      <div className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-icon">💻</div>
            <h3>Electronics</h3>
            <Link to="/electronics">Shop Now</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">�</div>
            <h3>Men</h3>
            <Link to="/men">Shop Now</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">👗</div>
            <h3>Women</h3>
            <Link to="/women">Shop Now</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🎒</div>
            <h3>Kids</h3>
            <Link to="/kids">Shop Now</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🛒</div>
            <h3>Grocery</h3>
            <Link to="/grocery">Shop Now</Link>
          </div>
          <div className="category-card">
            <div className="category-icon">🎁</div>
            <h3>Today's Deals</h3>
            <Link to="/deals">Shop Now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== PRODUCT CARD ==================== */

function ProductCard({ product, cart, setCart }) {
  const navigate = useNavigate();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const addToCart = () => {
    if (product.stock === 0) {
      alert("⚠️ Out of stock!");
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("⚠️ Not enough stock!");
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, cartItemId: Math.random() }]);
    }

    alert(`✅ ${product.name} added to cart.`);
  };

  const orderNow = () => {
    if (product.stock === 0) {
      alert("⚠️ Out of stock!");
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("⚠️ Not enough stock!");
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, cartItemId: Math.random() }]);
    }

    navigate("/cart");
  };

  return (
    <div className="product-card-amazon">
      {product.badge && <div className="badge">{product.badge}</div>}
      <div className="product-img">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <div className="rating">
          <span className="stars">⭐ {product.rating}</span>
          <span className="reviews">({product.reviews})</span>
        </div>
        <div className="price-section">
          <span className="price">₹{product.price.toLocaleString("en-IN")}</span>
          <span className="original-price">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          <span className="discount">-{discount}%</span>
        </div>
        <p className="description">{product.description}</p>
        <div className="stock-info">
          {product.stock === 0 ? (
            <span className="out-of-stock">Out of Stock</span>
          ) : product.stock < 5 ? (
            <span className="low-stock">Only {product.stock} left!</span>
          ) : (
            <span className="in-stock">In Stock</span>
          )}
        </div>
        <div className="product-actions">
          <button className={`add-cart-amazon ${product.stock === 0 ? "disabled" : ""}`} onClick={addToCart} disabled={product.stock === 0}>
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
          <button className="order-now-btn" onClick={orderNow} disabled={product.stock === 0}>
            {product.stock === 0 ? "Unavailable" : "Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==================== BROWSE CATEGORY ==================== */

function BrowseCategory({ categoryName, cart, setCart, defaultSearch = "" }) {
  const [search, setSearch] = useState(defaultSearch);
  const products = getSearchMatches(search, categoryName);
  const title = categoryName === "Any" ? (defaultSearch ? "Best Sellers" : "All Deals") : categoryName;

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>{title}</h1>
        <input type="text" placeholder="Search in this category..." value={search} onChange={(e) => setSearch(e.target.value)} className="category-search" />
      </div>
      <div className="products-grid-amazon">
        {products.length === 0 ? (
          <div className="no-products">No products found</div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
          ))
        )}
      </div>
    </div>
  );
}

/* ==================== SEARCH RESULTS ==================== */

function SearchResults({ cart, setCart, location }) {
  const query = new URLSearchParams(location.search).get("q") || "";
  const results = getSearchMatches(query, "Any");

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>{query ? `Search Results for "${query}"` : "All Products"}</h1>
        <p>{results.length} result{results.length === 1 ? "" : "s"} found</p>
      </div>
      <div className="products-grid-amazon">
        {results.length === 0 ? (
          <div className="no-products">No products found for your search</div>
        ) : (
          results.map(product => (
            <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
          ))
        )}
      </div>
    </div>
  );
}

function AllProductsPage({ cart, setCart }) {
  const products = PRODUCT_CATALOG;

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>All Products</h1>
        <p>{products.length} products available</p>
      </div>
      <div className="products-grid-amazon">
        {products.map(product => (
          <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
        ))}
      </div>
    </div>
  );
}

function OrderPage({ cart, setCart }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Electronics", "Men", "Women", "Kids", "Grocery", "Accessories"];
  const products = getSearchMatches(search, selectedCategory);

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Order Products</h1>
        <p>Shop across electronics, fashion, kids and grocery essentials</p>
      </div>

      <div className="category-filter-row">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-chip ${selectedCategory === category ? "active" : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="browse-header" style={{ marginTop: "1.5rem" }}>
        <input
          type="text"
          placeholder="Search any product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="category-search"
        />
      </div>

      <div className="products-grid-amazon">
        {products.length === 0 ? (
          <div className="no-products">No products found in this category</div>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} cart={cart} setCart={setCart} />
          ))
        )}
      </div>
    </div>
  );
}

function OrdersPage({ orders }) {
  return (
    <div className="orders-page">
      <div className="search-header">
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length === 1 ? "" : "s"} placed</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-products">No orders yet. Start shopping to place an order.</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item-card">
              <div className="order-item-top">
                <strong>{order.id}</strong>
                <span className="status-badge created">{order.status}</span>
              </div>
              <p><strong>Customer:</strong> {order.customer}</p>
              <p><strong>Items:</strong> {order.items}</p>
              <p><strong>Amount:</strong> ₹{order.amount.toLocaleString("en-IN")}</p>
              <p><strong>Delivery:</strong> {order.address || "Address not provided"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AccountPage() {
  return (
    <div className="orders-page">
      <div className="search-header">
        <h1>My Account</h1>
      </div>
      <div className="account-card">
        <h2>Welcome back</h2>
        <p>Manage your profile, orders, and saved items here.</p>
        <div className="account-links">
          <Link to="/orders" className="nav-item">View Orders</Link>
          <Link to="/cart" className="nav-item">Cart</Link>
          <Link to="/" className="nav-item">Shop Products</Link>
        </div>
      </div>
    </div>
  );
}

/* ==================== SHOPPING CART ==================== */

function ShoppingCartPage({ cart, setCart, orders, setOrders }) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const tax = Math.round(cartTotal * 0.18);
  const finalTotal = cartTotal + tax;

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(cart.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
  };

  const checkout = () => {
    if (!customerName.trim()) {
      alert("⚠️ Please enter your name");
      return;
    }
    if (cart.length === 0) {
      alert("⚠️ Your cart is empty!");
      return;
    }

    const orderId = `ORD-${1000 + orders.length + 1}`;
    const itemsList = cart.map(item => `${item.name} (x${item.quantity})`).join(", ");

    const newOrder = {
      id: orderId,
      customer: customerName,
      items: itemsList,
      quantity: itemCount,
      amount: finalTotal,
      priority: "Normal",
      status: "Created",
      date: new Date().toLocaleDateString("en-IN"),
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN"),
      address: customerAddress,
      email: customerEmail
    };

    setOrders([...orders, newOrder]);
    const successText = `✅ Order ${orderId} placed successfully! Thank you for shopping.`;
    setOrderMessage(successText);
    alert(successText);

    setCart([]);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerAddress("");
  };

  return (
    <div className="cart-page-amazon">
      <h1>🛒 Shopping Cart</h1>
      {orderMessage && <div className="success-banner">{orderMessage}</div>}
      <div className="cart-main">
        <div className="cart-items-container">
          {cart.length === 0 ? (
            <div className="empty-cart-amazon">
              <p>Your Amazon Cart is empty</p>
              <Link to="/" className="continue-shopping">Continue Shopping</Link>
            </div>
          ) : (
            <>
              <div className="cart-items-header">
                <h2>Subtotal ({itemCount} items): ₹{cartTotal.toLocaleString("en-IN")}</h2>
              </div>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item-amazon">
                    <div className="item-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>₹{item.price.toLocaleString("en-IN")} each</p>
                    </div>
                    <div className="item-qty">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>−</button>
                      <input type="number" value={item.quantity} readOnly />
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                    </div>
                    <div className="item-total">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.cartItemId)}>🗑️</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="checkout-amazon">
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="breakdown-row">
                <span>Shipping:</span>
                <span className="free">FREE</span>
              </div>
              <div className="breakdown-row">
                <span>Tax (18%):</span>
                <span>₹{tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="breakdown-row total">
                <span>Total:</span>
                <span>₹{finalTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="customer-form">
              <h3>Delivery Details</h3>
              <input type="text" placeholder="Full Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <input type="email" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
              <input type="text" placeholder="Delivery Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
              <button className="checkout-btn-amazon" onClick={checkout}>Proceed to Checkout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== WAREHOUSE DASHBOARD ==================== */

function AdvancedDashboard({ inventory, orders, picking, packing, shipping }) {
  const metrics = useMemo(() => calculateMetrics(orders), [orders]);
  const bottlenecks = useMemo(() => detectBottlenecks(orders, inventory, picking, packing, shipping), [orders, inventory, picking, packing, shipping]);
  const reorderRecs = useMemo(() => getReorderRecommendations(inventory), [inventory]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 Smart Warehouse Dashboard</h1>
        <p>Real-time warehouse metrics and intelligent decision support</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">🛒</div>
          <div className="kpi-content">
            <span>Total Orders</span>
            <strong>{metrics.totalOrders}</strong>
          </div>
        </div>
        <div className="kpi-card highlight">
          <div className="kpi-icon">📈</div>
          <div className="kpi-content">
            <span>Fulfillment Rate</span>
            <strong>{metrics.fulfillmentRate}%</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">🚨</div>
          <div className="kpi-content">
            <span>Urgent Orders</span>
            <strong>{metrics.urgentOrders}</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <span>Total Stock</span>
            <strong>{inventory.reduce((sum, p) => sum + p.stock, 0)}</strong>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">✅</div>
          <div className="kpi-content">
            <span>On-Time Rate</span>
            <strong>{metrics.onTimePercentage}%</strong>
          </div>
        </div>
      </div>

      <div className="alerts-section">
        <h2>🚨 Smart Alerts & Bottleneck Detection</h2>
        {bottlenecks.length === 0 ? (
          <div className="no-alerts">✅ All systems operating smoothly!</div>
        ) : (
          <div className="alerts-list">
            {bottlenecks.map((alert, idx) => (
              <div key={idx} className="alert-item">
                <strong>{alert.type}:</strong> {alert.message}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="reorder-section">
        <h2>📋 Inventory Reorder Recommendations</h2>
        {reorderRecs.length === 0 ? (
          <div className="no-alerts">✅ All stock levels healthy</div>
        ) : (
          <div className="reorder-list">
            {reorderRecs.map((rec) => (
              <div key={rec.productId} className="reorder-item">
                <div>
                  <strong>{rec.name}</strong>
                  <p>Current: {rec.currentStock} | Recommend: +{rec.recommendedQuantity}</p>
                </div>
                <span className={`urgency-badge ${rec.urgency.toLowerCase()}`}>{rec.urgency}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== ORDERS MANAGEMENT ==================== */

function SmartOrders({ orders, setOrders, inventory }) {
  const [search, setSearch] = useState("");
  const prioritizedOrders = useMemo(() => prioritizeOrders(orders, inventory), [orders, inventory]);
  const filteredOrders = prioritizedOrders.filter((order) =>
    order.id.toLowerCase().includes(search.toLowerCase()) || order.customer.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id) => {
    const statusFlow = ["Created", "Picking", "Packed", "Shipped", "Delivered"];
    setOrders(orders.map((order) => {
      if (order.id !== id) return order;
      const currentIndex = statusFlow.indexOf(order.status);
      if (currentIndex === statusFlow.length - 1) return order;
      return { ...order, status: statusFlow[currentIndex + 1] };
    }));
  };

  return (
    <div className="orders-container">
      <h1>🛒 Order Management</h1>
      <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>₹{order.amount.toLocaleString("en-IN")}</td>
                <td><span className={`status-badge ${order.status.toLowerCase().replace(" ", "-")}`}>{order.status}</span></td>
                <td><button onClick={() => updateStatus(order.id)} disabled={order.status === "Delivered"} className="action-btn">{order.status === "Delivered" ? "✓" : "Next"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==================== INVENTORY MANAGEMENT ==================== */

function SmartInventory({ inventory, setInventory }) {
  const [search, setSearch] = useState("");
  const filteredInventory = inventory.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const increaseStock = (id) => {
    setInventory(inventory.map((product) => product.id === id ? { ...product, stock: product.stock + 5 } : product));
  };

  const decreaseStock = (id) => {
    setInventory(inventory.map((product) => product.id === id && product.stock > 0 ? { ...product, stock: product.stock - 1 } : product));
  };

  return (
    <div className="inventory-container">
      <h1>📦 Inventory Management</h1>
      <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Reorder Point</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td><strong>{product.stock}</strong></td>
                <td>{product.reorderPoint}</td>
                <td>{product.location}</td>
                <td>
                  <button onClick={() => increaseStock(product.id)} className="action-btn">+5</button>
                  <button onClick={() => decreaseStock(product.id)} className="action-btn">-1</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==================== PICKING MANAGEMENT ==================== */

function PickingManagement({ picking, setPicking }) {
  const [search, setSearch] = useState("");
  const filteredTasks = picking.filter((task) =>
    task.id.toLowerCase().includes(search.toLowerCase()) || task.customer.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id) => {
    setPicking(picking.map((task) => {
      if (task.id !== id) return task;
      if (task.status === "Pending") return { ...task, status: "Picking" };
      if (task.status === "Picking") return { ...task, status: "Completed" };
      return task;
    }));
  };

  return (
    <div className="picking-container">
      <h1>📋 Picking Management</h1>
      <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
      <div className="tasks-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`task-card status-${task.status.toLowerCase()}`}>
            <div className="task-header">
              <strong>{task.id}</strong>
              <span>{task.order}</span>
            </div>
            <p>Customer: {task.customer}</p>
            <p>Items: {task.items} (x{task.quantity})</p>
            <p>Location: {task.location} | Picker: {task.picker}</p>
            <button onClick={() => updateStatus(task.id)} className="action-btn">{task.status === "Completed" ? "✓ Done" : task.status === "Picking" ? "Mark Complete" : "Start Picking"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== PACKING MANAGEMENT ==================== */

function PackingManagement({ packing, setPacking }) {
  const [search, setSearch] = useState("");
  const filteredPackages = packing.filter((pkg) =>
    pkg.id.toLowerCase().includes(search.toLowerCase()) || pkg.customer.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id) => {
    setPacking(packing.map((pkg) => {
      if (pkg.id !== id) return pkg;
      if (pkg.status === "Ready") return { ...pkg, status: "Packing" };
      if (pkg.status === "Packing") return { ...pkg, status: "Packed" };
      return pkg;
    }));
  };

  return (
    <div className="packing-container">
      <h1>📦 Packing Management</h1>
      <input type="text" placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
      <div className="tasks-list">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className={`task-card status-${pkg.status.toLowerCase()}`}>
            <div className="task-header">
              <strong>{pkg.id}</strong>
              <span>{pkg.order}</span>
            </div>
            <p>Customer: {pkg.customer}</p>
            <p>Items: {pkg.items} (x{pkg.quantity}) | Box: {pkg.box}</p>
            <p>Packer: {pkg.packer}</p>
            <button onClick={() => updateStatus(pkg.id)} className="action-btn">{pkg.status === "Packed" ? "✓ Done" : pkg.status === "Packing" ? "Mark Packed" : "Start Packing"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== SHIPPING MANAGEMENT ==================== */

function ShippingManagement({ shipping, setShipping }) {
  const [search, setSearch] = useState("");
  const filteredShipments = shipping.filter((shipment) =>
    shipment.id.toLowerCase().includes(search.toLowerCase()) || shipment.customer.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = (id) => {
    const statusFlow = ["Ready to Ship", "Shipped", "In Transit", "Delivered"];
    setShipping(shipping.map((shipment) => {
      if (shipment.id !== id) return shipment;
      const currentIndex = statusFlow.indexOf(shipment.status);
      if (currentIndex === statusFlow.length - 1) return shipment;
      return { ...shipment, status: statusFlow[currentIndex + 1] };
    }));
  };

  return (
    <div className="shipping-container">
      <h1>🚚 Shipping Management</h1>
      <input type="text" placeholder="Search shipments..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
      <div className="tasks-list">
        {filteredShipments.map((shipment) => (
          <div key={shipment.id} className={`task-card status-${shipment.status.toLowerCase().replace(" ", "-")}`}>
            <div className="task-header">
              <strong>{shipment.id}</strong>
              <span>{shipment.order}</span>
            </div>
            <p>Customer: {shipment.customer}</p>
            <p>Carrier: {shipment.carrier} | Tracking: {shipment.tracking}</p>
            <button onClick={() => updateStatus(shipment.id)} className="action-btn">{shipment.status === "Delivered" ? "✓ Done" : "Next Status"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================== MAIN APP ==================== */

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventory, setInventory] = useState([
    { id: "P001", name: "Laptop Pro 14", stock: 3, damaged: 0, location: "A-01", price: 64999, reorderPoint: 5 },
    { id: "P002", name: "Smartphone X", stock: 5, damaged: 1, location: "A-02", price: 24999, reorderPoint: 8 },
    { id: "P003", name: "Wireless Keyboard", stock: 0, damaged: 0, location: "B-04", price: 1499, reorderPoint: 10 },
    { id: "P004", name: "Wireless Mouse", stock: 32, damaged: 2, location: "B-05", price: 899, reorderPoint: 15 },
    { id: "P005", name: "USB-C Cable", stock: 67, damaged: 3, location: "C-01", price: 499, reorderPoint: 30 },
    { id: "P006", name: "Monitor 24 inch", stock: 12, damaged: 1, location: "A-05", price: 11999, reorderPoint: 3 }
  ]);
  const [orders, setOrders] = useState([]);
  const [picking, setPicking] = useState([
    { id: "PICK-001", order: "ORD-1001", customer: "Rahul Kumar", items: "Laptop", quantity: 1, location: "A-01", picker: "Ravi", status: "Pending" },
    { id: "PICK-002", order: "ORD-1002", customer: "Priya Sharma", items: "Smartphone", quantity: 2, location: "A-02", picker: "Anil", status: "Picking" }
  ]);
  const [packing, setPacking] = useState([
    { id: "PACK-001", order: "ORD-1003", customer: "Arjun Reddy", items: "Mouse", quantity: 3, packer: "Suresh", box: "Medium", status: "Ready" },
    { id: "PACK-002", order: "ORD-1002", customer: "Priya Sharma", items: "Smartphone", quantity: 2, packer: "Anil", box: "Small", status: "Packing" }
  ]);
  const [shipping, setShipping] = useState([
    { id: "SHIP-001", order: "ORD-1004", customer: "Sneha Patel", carrier: "BlueDart", tracking: "BD78451236", status: "Ready to Ship" },
    { id: "SHIP-002", order: "ORD-1002", customer: "Priya Sharma", carrier: "Delhivery", tracking: "DL56289147", status: "Shipped" }
  ]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const isWarehousePath = location.pathname.startsWith("/warehouse");

  return (
    <>
      {!isWarehousePath && <AmazonHeader cart={cart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />}
      {isWarehousePath && <WarehouseNavbar />}

      <Routes>
        <Route path="/" element={<HomePage cart={cart} setCart={setCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />} />
          <Route path="/electronics" element={<BrowseCategory categoryName="Electronics" cart={cart} setCart={setCart} />} />
        <Route path="/accessories" element={<BrowseCategory categoryName="Accessories" cart={cart} setCart={setCart} />} />
        <Route path="/men" element={<BrowseCategory categoryName="Men" cart={cart} setCart={setCart} />} />
        <Route path="/women" element={<BrowseCategory categoryName="Women" cart={cart} setCart={setCart} />} />
        <Route path="/kids" element={<BrowseCategory categoryName="Kids" cart={cart} setCart={setCart} />} />
        <Route path="/grocery" element={<BrowseCategory categoryName="Grocery" cart={cart} setCart={setCart} />} />
        <Route path="/deals" element={<BrowseCategory categoryName="Any" cart={cart} setCart={setCart} />} />
        <Route path="/bestsellers" element={<BrowseCategory categoryName="Any" defaultSearch="bestseller" cart={cart} setCart={setCart} />} />
        <Route path="/all-products" element={<AllProductsPage cart={cart} setCart={setCart} />} />
        <Route path="/order" element={<OrderPage cart={cart} setCart={setCart} />} />
        <Route path="/search" element={<SearchResults cart={cart} setCart={setCart} location={location} />} />
        <Route path="/cart" element={<ShoppingCartPage cart={cart} setCart={setCart} orders={orders} setOrders={setOrders} />} />
        <Route path="/orders" element={<OrdersPage orders={orders} />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="/warehouse" element={<Navigate to="/warehouse/dashboard" />} />
        <Route path="/warehouse/dashboard" element={<AdvancedDashboard inventory={inventory} orders={orders} picking={picking} packing={packing} shipping={shipping} />} />
        <Route path="/warehouse/orders" element={<SmartOrders orders={orders} setOrders={setOrders} inventory={inventory} />} />
        <Route path="/warehouse/inventory" element={<SmartInventory inventory={inventory} setInventory={setInventory} />} />
        <Route path="/warehouse/picking" element={<PickingManagement picking={picking} setPicking={setPicking} />} />
        <Route path="/warehouse/packing" element={<PackingManagement packing={packing} setPacking={setPacking} />} />
        <Route path="/warehouse/shipping" element={<ShippingManagement shipping={shipping} setShipping={setShipping} />} />
      </Routes>
    </>
  );
}

function Navigate({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  return null;
}

export default function RootApp() {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}
