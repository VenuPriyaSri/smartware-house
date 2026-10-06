import React, { useState } from "react";

function Packing() {
  const [packages, setPackages] = useState([
    {
      id: "PACK-001",
      order: "ORD-1003",
      customer: "Arjun Reddy",
      items: "Wireless Mouse",
      quantity: 3,
      packer: "Suresh",
      box: "Medium",
      priority: "Normal",
      status: "Ready"
    },
    {
      id: "PACK-002",
      order: "ORD-1002",
      customer: "Priya Sharma",
      items: "Smartphone X",
      quantity: 2,
      packer: "Anil",
      box: "Small",
      priority: "High",
      status: "Packing"
    },
    {
      id: "PACK-003",
      order: "ORD-1004",
      customer: "Sneha Patel",
      items: "Monitor 24 inch",
      quantity: 1,
      packer: "Ravi",
      box: "Large",
      priority: "Normal",
      status: "Packed"
    },
    {
      id: "PACK-004",
      order: "ORD-1006",
      customer: "Ananya Rao",
      items: "Wireless Keyboard",
      quantity: 1,
      packer: "Ravi",
      box: "Small",
      priority: "Urgent",
      status: "Ready"
    }
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const updateStatus = (id) => {
    setPackages((currentPackages) =>
      currentPackages.map((pkg) => {
        if (pkg.id !== id) return pkg;

        if (pkg.status === "Ready") {
          return { ...pkg, status: "Packing" };
        }

        if (pkg.status === "Packing") {
          return { ...pkg, status: "Packed" };
        }

        return pkg;
      })
    );
  };

  const filteredPackages = packages.filter((pkg) => {
    const searchMatch =
      pkg.id.toLowerCase().includes(search.toLowerCase()) ||
      pkg.order.toLowerCase().includes(search.toLowerCase()) ||
      pkg.customer.toLowerCase().includes(search.toLowerCase()) ||
      pkg.items.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || pkg.status === filter;

    return searchMatch && filterMatch;
  });

  const ready = packages.filter((p) => p.status === "Ready").length;
  const packing = packages.filter((p) => p.status === "Packing").length;
  const packed = packages.filter((p) => p.status === "Packed").length;
  const urgent = packages.filter((p) => p.priority === "Urgent").length;

  return (
    <div className="packing-page">

      <div className="packing-header">
        <div>
          <h1>📦 Packing Management</h1>
          <p>Prepare picked orders for shipment.</p>
        </div>

        <button className="create-package">
          + Create Package
        </button>
      </div>

      {/* STATISTICS */}

      <div className="packing-stats">

        <div className="packing-stat">
          <div className="pack-icon">📋</div>
          <div>
            <strong>{ready}</strong>
            <span>Ready to Pack</span>
          </div>
        </div>

        <div className="packing-stat">
          <div className="pack-icon">📦</div>
          <div>
            <strong>{packing}</strong>
            <span>Currently Packing</span>
          </div>
        </div>

        <div className="packing-stat packed-stat">
          <div className="pack-icon">✅</div>
          <div>
            <strong>{packed}</strong>
            <span>Packed</span>
          </div>
        </div>

        <div className="packing-stat urgent-pack">
          <div className="pack-icon">🚨</div>
          <div>
            <strong>{urgent}</strong>
            <span>Urgent Packages</span>
          </div>
        </div>

      </div>

      {/* PACKING TABLE */}

      <div className="packing-card">

        <div className="packing-toolbar">

          <div>
            <h2>Packages</h2>
            <p>Track packing operations</p>
          </div>

          <div className="packing-filters">

            <div className="packing-search">
              🔍
              <input
                type="text"
                placeholder="Search package or order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Ready">Ready</option>
              <option value="Packing">Packing</option>
              <option value="Packed">Packed</option>
            </select>

          </div>

        </div>

        <div className="packing-table-container">

          <table className="packing-table">

            <thead>
              <tr>
                <th>Package ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Packer</th>
                <th>Box</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredPackages.map((pkg) => (

                <tr key={pkg.id}>

                  <td>
                    <strong>{pkg.id}</strong>
                  </td>

                  <td>{pkg.order}</td>

                  <td>{pkg.customer}</td>

                  <td>{pkg.items}</td>

                  <td>{pkg.quantity}</td>

                  <td>👤 {pkg.packer}</td>

                  <td>
                    <span className="box-size">
                      📦 {pkg.box}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`pack-priority ${pkg.priority.toLowerCase()}`}
                    >
                      {pkg.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`pack-status ${pkg.status.toLowerCase()}`}
                    >
                      {pkg.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="pack-action"
                      onClick={() => updateStatus(pkg.id)}
                      disabled={pkg.status === "Packed"}
                    >
                      {pkg.status === "Ready"
                        ? "Start"
                        : pkg.status === "Packing"
                        ? "Pack"
                        : "Done"}
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredPackages.length === 0 && (
            <div className="no-packages">
              🔍 No packages found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Packing;