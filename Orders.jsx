import React, { useMemo, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "Rahul Kumar",
      items: "Laptop Pro 14",
      quantity: 1,
      amount: 64999,
      priority: "Urgent",
      status: "Created",
      date: "18 Aug 2026"
    },
    {
      id: "ORD-1002",
      customer: "Priya Sharma",
      items: "Smartphone X",
      quantity: 2,
      amount: 49998,
      priority: "High",
      status: "Picking",
      date: "18 Aug 2026"
    },
    {
      id: "ORD-1003",
      customer: "Arjun Reddy",
      items: "Wireless Mouse",
      quantity: 3,
      amount: 2697,
      priority: "Normal",
      status: "Packed",
      date: "17 Aug 2026"
    },
    {
      id: "ORD-1004",
      customer: "Sneha Patel",
      items: "Monitor 24 inch",
      quantity: 1,
      amount: 11999,
      priority: "Normal",
      status: "Shipped",
      date: "17 Aug 2026"
    },
    {
      id: "ORD-1005",
      customer: "Vikram Singh",
      items: "USB-C Cable",
      quantity: 5,
      amount: 2495,
      priority: "High",
      status: "Delivered",
      date: "16 Aug 2026"
    },
    {
      id: "ORD-1006",
      customer: "Ananya Rao",
      items: "Wireless Keyboard",
      quantity: 1,
      amount: 1499,
      priority: "Urgent",
      status: "Created",
      date: "18 Aug 2026"
    }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.toLowerCase().includes(search.toLowerCase()) ||
        order.items.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || order.status === statusFilter;

      const priorityMatch =
        priorityFilter === "All" || order.priority === priorityFilter;

      return searchMatch && statusMatch && priorityMatch;
    });
  }, [orders, search, statusFilter, priorityFilter]);

  const updateStatus = (id) => {
    const statusFlow = [
      "Created",
      "Picking",
      "Packed",
      "Shipped",
      "Delivered"
    ];

    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== id) return order;

        const currentIndex = statusFlow.indexOf(order.status);

        if (currentIndex === statusFlow.length - 1) {
          return order;
        }

        return {
          ...order,
          status: statusFlow[currentIndex + 1]
        };
      })
    );
  };

  const totalOrders = orders.length;
  const urgentOrders = orders.filter(
    (order) => order.priority === "Urgent"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status !== "Delivered"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="orders-page">

      <div className="orders-header">
        <div>
          <h1>🛒 Order Management</h1>
          <p>Manage customer orders and warehouse fulfillment.</p>
        </div>

        <button className="create-order">
          + Create Order
        </button>
      </div>

      {/* ORDER STATISTICS */}

      <div className="order-stats">

        <div className="order-stat">
          <div className="order-stat-icon">🛒</div>
          <div>
            <strong>{totalOrders}</strong>
            <span>Total Orders</span>
          </div>
        </div>

        <div className="order-stat urgent-stat">
          <div className="order-stat-icon">🚨</div>
          <div>
            <strong>{urgentOrders}</strong>
            <span>Urgent Orders</span>
          </div>
        </div>

        <div className="order-stat pending-stat">
          <div className="order-stat-icon">⏳</div>
          <div>
            <strong>{pendingOrders}</strong>
            <span>In Progress</span>
          </div>
        </div>

        <div className="order-stat delivered-stat">
          <div className="order-stat-icon">✅</div>
          <div>
            <strong>{deliveredOrders}</strong>
            <span>Delivered</span>
          </div>
        </div>

      </div>

      {/* ORDER TABLE */}

      <div className="orders-card">

        <div className="orders-toolbar">

          <div>
            <h2>All Orders</h2>
            <p>Track and manage warehouse orders</p>
          </div>

          <div className="order-filters">

            <div className="order-search">
              🔍
              <input
                type="text"
                placeholder="Search order or customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Created">Created</option>
              <option value="Picking">Picking</option>
              <option value="Packed">Packed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priority</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>

          </div>

        </div>

        <div className="orders-table-container">

          <table className="orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.map((order) => (

                <tr key={order.id}>

                  <td>
                    <strong>{order.id}</strong>
                  </td>

                  <td>{order.customer}</td>

                  <td>{order.items}</td>

                  <td>{order.quantity}</td>

                  <td>
                    <strong>
                      ₹{order.amount.toLocaleString("en-IN")}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`priority-badge ${order.priority.toLowerCase()}`}
                    >
                      {order.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`order-status ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td>{order.date}</td>

                  <td>
                    <button
                      className="status-button"
                      onClick={() => updateStatus(order.id)}
                      disabled={order.status === "Delivered"}
                    >
                      {order.status === "Delivered"
                        ? "Completed"
                        : "Next →"}
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredOrders.length === 0 && (
            <div className="no-orders">
              🔍 No orders found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Orders;