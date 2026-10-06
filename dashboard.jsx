import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const inventory = [
    { name: "Laptop Pro 14", stock: 15, status: "In Stock" },
    { name: "Smartphone X", stock: 7, status: "Low Stock" },
    { name: "Wireless Keyboard", stock: 1, status: "Low Stock" },
    { name: "Monitor 24 inch", stock: 0, status: "Out of Stock" }
  ];

  const orders = [
    {
      id: "ORD-1001",
      customer: "Rahul Kumar",
      status: "Created",
      amount: 64999
    },
    {
      id: "ORD-1002",
      customer: "Priya Sharma",
      status: "Picking",
      amount: 49998
    },
    {
      id: "ORD-1003",
      customer: "Arjun Reddy",
      status: "Packed",
      amount: 2697
    },
    {
      id: "ORD-1004",
      customer: "Sneha Patel",
      status: "Shipped",
      amount: 11999
    }
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <h1>📊 Warehouse Dashboard</h1>
          <p>
            Monitor your warehouse operations and fulfillment performance.
          </p>
        </div>

        <div className="dashboard-date">
          📅 18 August 2026
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="dashboard-icon">📦</div>

          <div>
            <span>Total Products</span>
            <strong>1,248</strong>
            <small>+8.4% this month</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-icon">🛒</div>

          <div>
            <span>Active Orders</span>
            <strong>86</strong>
            <small>12 urgent orders</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-icon">🚚</div>

          <div>
            <span>Shipments</span>
            <strong>42</strong>
            <small>8 in transit</small>
          </div>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-icon">⚡</div>

          <div>
            <span>Fulfillment Rate</span>
            <strong>94.6%</strong>
            <small>+2.1% this week</small>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="quick-action-buttons">

          <Link to="/orders" className="quick-action">
            🛒
            <span>Manage Orders</span>
          </Link>

          <Link to="/inventory" className="quick-action">
            📦
            <span>Check Inventory</span>
          </Link>

          <Link to="/picking" className="quick-action">
            📋
            <span>Picking Tasks</span>
          </Link>

          <Link to="/packing" className="quick-action">
            📦
            <span>Packing</span>
          </Link>

          <Link to="/shipping" className="quick-action">
            🚚
            <span>Shipments</span>
          </Link>

        </div>

      </div>

      {/* MAIN GRID */}

      <div className="dashboard-grid">

        {/* ORDER OVERVIEW */}

        <div className="dashboard-card">

          <div className="card-heading">
            <div>
              <h2>Order Overview</h2>
              <p>Current order fulfillment status</p>
            </div>

            <Link to="/orders">View All →</Link>
          </div>

          <div className="order-overview">

            <div className="overview-item">
              <span className="overview-number created-number">
                18
              </span>
              <span>Created</span>
            </div>

            <div className="overview-item">
              <span className="overview-number picking-number">
                21
              </span>
              <span>Picking</span>
            </div>

            <div className="overview-item">
              <span className="overview-number packed-number">
                15
              </span>
              <span>Packed</span>
            </div>

            <div className="overview-item">
              <span className="overview-number shipped-number">
                24
              </span>
              <span>Shipped</span>
            </div>

            <div className="overview-item">
              <span className="overview-number delivered-number">
                120
              </span>
              <span>Delivered</span>
            </div>

          </div>

        </div>

        {/* WAREHOUSE PERFORMANCE */}

        <div className="dashboard-card">

          <div className="card-heading">
            <div>
              <h2>Warehouse Performance</h2>
              <p>Today's operational metrics</p>
            </div>
          </div>

          <div className="performance-list">

            <div className="performance-row">
              <div>
                <span>Picking Efficiency</span>
                <strong>91%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: "91%" }}
                ></div>
              </div>
            </div>

            <div className="performance-row">
              <div>
                <span>Packing Efficiency</span>
                <strong>87%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: "87%" }}
                ></div>
              </div>
            </div>

            <div className="performance-row">
              <div>
                <span>Shipping Efficiency</span>
                <strong>95%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: "95%" }}
                ></div>
              </div>
            </div>

            <div className="performance-row">
              <div>
                <span>Inventory Accuracy</span>
                <strong>98%</strong>
              </div>

              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: "98%" }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* SECOND GRID */}

      <div className="dashboard-grid">

        {/* INVENTORY ALERTS */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>
              <h2>⚠️ Inventory Alerts</h2>
              <p>Products requiring attention</p>
            </div>

            <Link to="/inventory">
              Inventory →
            </Link>

          </div>

          <div className="inventory-alert-list">

            {inventory.map((product) => (

              <div
                className="inventory-alert"
                key={product.name}
              >

                <div>
                  <strong>{product.name}</strong>
                  <span>Stock: {product.stock}</span>
                </div>

                <span
                  className={`inventory-status ${
                    product.status === "In Stock"
                      ? "in-stock"
                      : product.status === "Low Stock"
                      ? "low-stock"
                      : "out-stock"
                  }`}
                >
                  {product.status}
                </span>

              </div>

            ))}

          </div>

        </div>

        {/* RECENT ORDERS */}

        <div className="dashboard-card">

          <div className="card-heading">

            <div>
              <h2>Recent Orders</h2>
              <p>Latest customer orders</p>
            </div>

            <Link to="/orders">
              Orders →
            </Link>

          </div>

          <div className="recent-orders">

            {orders.map((order) => (

              <div
                className="recent-order"
                key={order.id}
              >

                <div>
                  <strong>{order.id}</strong>
                  <span>{order.customer}</span>
                </div>

                <div className="recent-order-right">
                  <strong>
                    ₹{order.amount.toLocaleString("en-IN")}
                  </strong>

                  <span
                    className={`mini-status ${
                      order.status.toLowerCase()
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="dashboard-card analytics-card">

        <div className="card-heading">

          <div>
            <h2>📈 Weekly Fulfillment Analytics</h2>
            <p>Orders processed during the last 7 days</p>
          </div>

        </div>

        <div className="analytics-chart">

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "45%" }}
            ></div>
            <span>Mon</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "60%" }}
            ></div>
            <span>Tue</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "52%" }}
            ></div>
            <span>Wed</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "75%" }}
            ></div>
            <span>Thu</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "68%" }}
            ></div>
            <span>Fri</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "88%" }}
            ></div>
            <span>Sat</span>
          </div>

          <div className="chart-column">
            <div
              className="chart-bar"
              style={{ height: "95%" }}
            ></div>
            <span>Sun</span>
          </div>

        </div>

      </div>

      {/* ACTIVITY */}

      <div className="dashboard-card">

        <div className="card-heading">

          <div>
            <h2>⚡ Recent Activity</h2>
            <p>Latest warehouse events</p>
          </div>

        </div>

        <div className="activity-list">

          <div className="activity">
            <span className="activity-icon">📦</span>
            <div>
              <strong>Order ORD-1003 packed</strong>
              <span>2 minutes ago</span>
            </div>
          </div>

          <div className="activity">
            <span className="activity-icon">🚚</span>
            <div>
              <strong>Shipment SHIP-002 dispatched</strong>
              <span>8 minutes ago</span>
            </div>
          </div>

          <div className="activity">
            <span className="activity-icon">📋</span>
            <div>
              <strong>PICK-002 picking started</strong>
              <span>15 minutes ago</span>
            </div>
          </div>

          <div className="activity">
            <span className="activity-icon">⚠️</span>
            <div>
              <strong>Monitor 24 inch is out of stock</strong>
              <span>25 minutes ago</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;