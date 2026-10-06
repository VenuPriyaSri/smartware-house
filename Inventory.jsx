import React, { useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([
    { id: "P001", name: "Laptop Pro 14", category: "Electronics", stock: 3, damaged: 0, location: "A-01", price: 64999 },
    { id: "P002", name: "Smartphone X", category: "Electronics", stock: 5, damaged: 1, location: "A-02", price: 24999 },
    { id: "P003", name: "Wireless Keyboard", category: "Accessories", stock: 0, damaged: 0, location: "B-04", price: 1499 },
    { id: "P004", name: "Wireless Mouse", category: "Accessories", stock: 32, damaged: 2, location: "B-05", price: 899 },
    { id: "P005", name: "USB-C Cable", category: "Accessories", stock: 67, damaged: 3, location: "C-01", price: 499 },
    { id: "P006", name: "Monitor 24 inch", category: "Electronics", stock: 12, damaged: 1, location: "A-05", price: 11999 }
  ]);

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.id.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const increaseStock = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + 1 }
          : product
      )
    );
  };

  return (
    <div className="inventory-page">

      <div className="inventory-header">
        <div>
          <h1>📦 Inventory Management</h1>
          <p>Monitor warehouse stock and product availability.</p>
        </div>

        <button className="add-product">
          + Add Product
        </button>
      </div>

      <div className="inventory-stats">

        <div className="inventory-stat">
          <span>📦</span>
          <div>
            <strong>{totalProducts}</strong>
            <small>Total Products</small>
          </div>
        </div>

        <div className="inventory-stat">
          <span>📊</span>
          <div>
            <strong>{totalStock}</strong>
            <small>Total Units</small>
          </div>
        </div>

        <div className="inventory-stat warning">
          <span>⚠️</span>
          <div>
            <strong>{lowStock}</strong>
            <small>Low Stock</small>
          </div>
        </div>

        <div className="inventory-stat danger">
          <span>🚫</span>
          <div>
            <strong>{outOfStock}</strong>
            <small>Out of Stock</small>
          </div>
        </div>

      </div>

      <div className="inventory-card">

        <div className="inventory-toolbar">

          <div>
            <h2>Warehouse Products</h2>
            <p>Current inventory status</p>
          </div>

          <div className="inventory-search">
            🔍
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

        </div>

        <div className="inventory-table-container">

          <table className="inventory-table">

            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Location</th>
                <th>Stock</th>
                <th>Damaged</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    <strong>{product.id}</strong>
                  </td>

                  <td>
                    <div className="inventory-product">
                      <div className="product-box">
                        📦
                      </div>

                      <div>
                        <strong>{product.name}</strong>
                        <small>₹{product.price.toLocaleString()}</small>
                      </div>
                    </div>
                  </td>

                  <td>{product.category}</td>

                  <td>
                    <span className="location">
                      📍 {product.location}
                    </span>
                  </td>

                  <td>
                    <strong>{product.stock}</strong>
                  </td>

                  <td>
                    {product.damaged}
                  </td>

                  <td>

                    {product.stock === 0 ? (
                      <span className="inventory-status out">
                        Out of Stock
                      </span>
                    ) : product.stock <= 5 ? (
                      <span className="inventory-status low">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inventory-status available">
                        Available
                      </span>
                    )}

                  </td>

                  <td>

                    <button
                      className="restock-button"
                      onClick={() => increaseStock(product.id)}
                    >
                      + Stock
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Inventory;