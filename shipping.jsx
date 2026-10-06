import React, { useState } from "react";

function Shipping() {
  const [shipments, setShipments] = useState([
    {
      id: "SHIP-001",
      order: "ORD-1004",
      customer: "Sneha Patel",
      package: "PACK-003",
      carrier: "BlueDart",
      tracking: "BD78451236",
      destination: "Hyderabad",
      priority: "Normal",
      status: "Ready to Ship"
    },
    {
      id: "SHIP-002",
      order: "ORD-1002",
      customer: "Priya Sharma",
      package: "PACK-002",
      carrier: "Delhivery",
      tracking: "DL56289147",
      destination: "Vijayawada",
      priority: "High",
      status: "Shipped"
    },
    {
      id: "SHIP-003",
      order: "ORD-1005",
      customer: "Vikram Singh",
      package: "PACK-005",
      carrier: "DTDC",
      tracking: "DT89456123",
      destination: "Bangalore",
      priority: "Normal",
      status: "In Transit"
    },
    {
      id: "SHIP-004",
      order: "ORD-1003",
      customer: "Arjun Reddy",
      package: "PACK-003",
      carrier: "Amazon Shipping",
      tracking: "AMZ45871239",
      destination: "Chennai",
      priority: "Urgent",
      status: "Delivered"
    },
    {
      id: "SHIP-005",
      order: "ORD-1006",
      customer: "Ananya Rao",
      package: "PACK-004",
      carrier: "BlueDart",
      tracking: "BD96321478",
      destination: "Kakinada",
      priority: "Urgent",
      status: "Ready to Ship"
    }
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const updateStatus = (id) => {
    const statusFlow = [
      "Ready to Ship",
      "Shipped",
      "In Transit",
      "Delivered"
    ];

    setShipments((currentShipments) =>
      currentShipments.map((shipment) => {
        if (shipment.id !== id) {
          return shipment;
        }

        const currentIndex = statusFlow.indexOf(shipment.status);

        if (currentIndex === statusFlow.length - 1) {
          return shipment;
        }

        return {
          ...shipment,
          status: statusFlow[currentIndex + 1]
        };
      })
    );
  };

  const filteredShipments = shipments.filter((shipment) => {
    const searchMatch =
      shipment.id.toLowerCase().includes(search.toLowerCase()) ||
      shipment.order.toLowerCase().includes(search.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(search.toLowerCase()) ||
      shipment.tracking.toLowerCase().includes(search.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(search.toLowerCase());

    const filterMatch =
      filter === "All" || shipment.status === filter;

    return searchMatch && filterMatch;
  });

  const ready = shipments.filter(
    (s) => s.status === "Ready to Ship"
  ).length;

  const shipped = shipments.filter(
    (s) => s.status === "Shipped"
  ).length;

  const transit = shipments.filter(
    (s) => s.status === "In Transit"
  ).length;

  const delivered = shipments.filter(
    (s) => s.status === "Delivered"
  ).length;

  return (
    <div className="shipping-page">

      {/* HEADER */}

      <div className="shipping-header">

        <div>
          <h1>🚚 Shipping Management</h1>
          <p>
            Manage shipments, tracking and delivery operations.
          </p>
        </div>

        <button className="create-shipment">
          + Create Shipment
        </button>

      </div>

      {/* STATISTICS */}

      <div className="shipping-stats">

        <div className="shipping-stat">
          <div className="ship-icon">📦</div>

          <div>
            <strong>{ready}</strong>
            <span>Ready to Ship</span>
          </div>
        </div>

        <div className="shipping-stat">
          <div className="ship-icon">🚚</div>

          <div>
            <strong>{shipped}</strong>
            <span>Shipped</span>
          </div>
        </div>

        <div className="shipping-stat">
          <div className="ship-icon">🛣️</div>

          <div>
            <strong>{transit}</strong>
            <span>In Transit</span>
          </div>
        </div>

        <div className="shipping-stat delivered-shipping">
          <div className="ship-icon">✅</div>

          <div>
            <strong>{delivered}</strong>
            <span>Delivered</span>
          </div>
        </div>

      </div>

      {/* SHIPMENT TABLE */}

      <div className="shipping-card">

        <div className="shipping-toolbar">

          <div>
            <h2>Shipments</h2>
            <p>Track outgoing warehouse shipments</p>
          </div>

          <div className="shipping-filters">

            <div className="shipping-search">
              🔍

              <input
                type="text"
                placeholder="Search shipment or tracking..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Ready to Ship">
                Ready to Ship
              </option>
              <option value="Shipped">
                Shipped
              </option>
              <option value="In Transit">
                In Transit
              </option>
              <option value="Delivered">
                Delivered
              </option>
            </select>

          </div>

        </div>

        <div className="shipping-table-container">

          <table className="shipping-table">

            <thead>

              <tr>
                <th>Shipment ID</th>
                <th>Order</th>
                <th>Customer</th>
                <th>Carrier</th>
                <th>Tracking ID</th>
                <th>Destination</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredShipments.map((shipment) => (

                <tr key={shipment.id}>

                  <td>
                    <strong>{shipment.id}</strong>
                  </td>

                  <td>{shipment.order}</td>

                  <td>{shipment.customer}</td>

                  <td>
                    🚚 {shipment.carrier}
                  </td>

                  <td>
                    <strong>
                      {shipment.tracking}
                    </strong>
                  </td>

                  <td>
                    📍 {shipment.destination}
                  </td>

                  <td>

                    <span
                      className={`ship-priority ${shipment.priority.toLowerCase()}`}
                    >
                      {shipment.priority}
                    </span>

                  </td>

                  <td>

                    <span
                      className={`ship-status ${shipment.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      {shipment.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="ship-action"
                      onClick={() =>
                        updateStatus(shipment.id)
                      }
                      disabled={
                        shipment.status === "Delivered"
                      }
                    >

                      {shipment.status === "Ready to Ship"
                        ? "Ship"
                        : shipment.status === "Shipped"
                        ? "Track"
                        : shipment.status === "In Transit"
                        ? "Deliver"
                        : "Done"}

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredShipments.length === 0 && (
            <div className="no-shipments">
              🔍 No shipments found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Shipping;