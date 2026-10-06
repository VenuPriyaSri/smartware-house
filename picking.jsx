import React, { useState } from "react";

function Picking() {
  const [tasks, setTasks] = useState([
    {
      id: "PICK-001",
      order: "ORD-1001",
      customer: "Rahul Kumar",
      items: "Laptop Pro 14",
      quantity: 1,
      location: "A-01",
      picker: "Ravi",
      priority: "Urgent",
      status: "Pending"
    },
    {
      id: "PICK-002",
      order: "ORD-1002",
      customer: "Priya Sharma",
      items: "Smartphone X",
      quantity: 2,
      location: "A-02",
      picker: "Anil",
      priority: "High",
      status: "Picking"
    },
    {
      id: "PICK-003",
      order: "ORD-1003",
      customer: "Arjun Reddy",
      items: "Wireless Mouse",
      quantity: 3,
      location: "B-05",
      picker: "Suresh",
      priority: "Normal",
      status: "Completed"
    },
    {
      id: "PICK-004",
      order: "ORD-1006",
      customer: "Ananya Rao",
      items: "Wireless Keyboard",
      quantity: 1,
      location: "B-04",
      picker: "Ravi",
      priority: "Urgent",
      status: "Pending"
    }
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const updateStatus = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id !== id) return task;

        if (task.status === "Pending") {
          return { ...task, status: "Picking" };
        }

        if (task.status === "Picking") {
          return { ...task, status: "Completed" };
        }

        return task;
      })
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const searchMatch =
      task.id.toLowerCase().includes(search.toLowerCase()) ||
      task.order.toLowerCase().includes(search.toLowerCase()) ||
      task.customer.toLowerCase().includes(search.toLowerCase()) ||
      task.items.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || task.status === filter;

    return searchMatch && filterMatch;
  });

  const pending = tasks.filter((t) => t.status === "Pending").length;
  const picking = tasks.filter((t) => t.status === "Picking").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const urgent = tasks.filter((t) => t.priority === "Urgent").length;

  return (
    <div className="picking-page">

      <div className="picking-header">
        <div>
          <h1>📋 Picking Management</h1>
          <p>Manage warehouse picking tasks and assignments.</p>
        </div>

        <button className="create-pick">
          + Create Picking Task
        </button>
      </div>

      {/* STATISTICS */}

      <div className="picking-stats">

        <div className="picking-stat">
          <div className="pick-icon">⏳</div>
          <div>
            <strong>{pending}</strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="picking-stat">
          <div className="pick-icon">📦</div>
          <div>
            <strong>{picking}</strong>
            <span>Currently Picking</span>
          </div>
        </div>

        <div className="picking-stat">
          <div className="pick-icon">✅</div>
          <div>
            <strong>{completed}</strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="picking-stat urgent-pick">
          <div className="pick-icon">🚨</div>
          <div>
            <strong>{urgent}</strong>
            <span>Urgent Tasks</span>
          </div>
        </div>

      </div>

      {/* TASK TABLE */}

      <div className="picking-card">

        <div className="picking-toolbar">

          <div>
            <h2>Picking Tasks</h2>
            <p>Track warehouse picking operations</p>
          </div>

          <div className="picking-filters">

            <div className="picking-search">
              🔍
              <input
                type="text"
                placeholder="Search picking tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Picking">Picking</option>
              <option value="Completed">Completed</option>
            </select>

          </div>

        </div>

        <div className="picking-table-container">

          <table className="picking-table">

            <thead>
              <tr>
                <th>Task ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Location</th>
                <th>Picker</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredTasks.map((task) => (

                <tr key={task.id}>

                  <td>
                    <strong>{task.id}</strong>
                  </td>

                  <td>{task.order}</td>

                  <td>{task.customer}</td>

                  <td>{task.items}</td>

                  <td>{task.quantity}</td>

                  <td>
                    <span className="pick-location">
                      📍 {task.location}
                    </span>
                  </td>

                  <td>
                    👤 {task.picker}
                  </td>

                  <td>
                    <span
                      className={`pick-priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`pick-status ${task.status.toLowerCase()}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="pick-action"
                      onClick={() => updateStatus(task.id)}
                      disabled={task.status === "Completed"}
                    >
                      {task.status === "Pending"
                        ? "Start"
                        : task.status === "Picking"
                        ? "Complete"
                        : "Done"}
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredTasks.length === 0 && (
            <div className="no-picking">
              🔍 No picking tasks found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Picking;