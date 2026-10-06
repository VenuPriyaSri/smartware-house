/**
 * INTELLIGENT WAREHOUSE OPERATIONS ENGINE
 * Handles order prioritization, inventory allocation, and smart decisions
 */

// Order Prioritization Engine
export const prioritizeOrders = (orders, inventory) => {
  return orders
    .map((order) => {
      let score = 0;

      // Priority level scoring
      if (order.priority === "Urgent") score += 50;
      else if (order.priority === "High") score += 30;
      else if (order.priority === "Normal") score += 10;

      // Status scoring (Created orders should be prioritized)
      if (order.status === "Created") score += 40;
      else if (order.status === "Picking") score += 20;

      // Stock availability
      const item = inventory.find((p) => p.name === order.items);
      if (item && item.stock >= order.quantity) score += 15;
      else if (item && item.stock > 0) score += 5;

      // Time-based urgency (newer orders get boost)
      const orderDate = new Date(order.date);
      const daysSinceOrder = (new Date() - orderDate) / (1000 * 60 * 60 * 24);
      if (daysSinceOrder > 3) score += 20;

      return { ...order, priorityScore: score };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
};

// Smart Inventory Allocation Engine
export const allocateInventory = (orders, inventory) => {
  const prioritized = prioritizeOrders(orders, inventory);
  const allocations = [];
  const inventoryCopy = JSON.parse(JSON.stringify(inventory));

  prioritized.forEach((order) => {
    const product = inventoryCopy.find((p) => p.name === order.items);

    if (product) {
      if (product.stock >= order.quantity) {
        // Full allocation
        allocations.push({
          orderId: order.id,
          allocated: order.quantity,
          status: "FULL_ALLOCATION",
          productId: product.id
        });
        product.stock -= order.quantity;
      } else if (product.stock > 0) {
        // Partial allocation
        allocations.push({
          orderId: order.id,
          allocated: product.stock,
          requested: order.quantity,
          status: "PARTIAL_ALLOCATION",
          productId: product.id,
          shortage: order.quantity - product.stock
        });
        product.stock = 0;
      } else {
        // No stock
        allocations.push({
          orderId: order.id,
          allocated: 0,
          status: "OUT_OF_STOCK",
          productId: product.id
        });
      }
    }
  });

  return { allocations, updatedInventory: inventoryCopy };
};

// Bottleneck Detection Engine
export const detectBottlenecks = (orders, inventory, picking, packing, shipping) => {
  const bottlenecks = [];

  // Detect picking bottlenecks
  const pickingLoad = picking.filter((p) => p.status !== "Completed").length;
  const pendingOrders = orders.filter((o) => o.status === "Created").length;
  if (pendingOrders > pickingLoad * 2) {
    bottlenecks.push({
      type: "PICKING_BOTTLENECK",
      severity: "HIGH",
      message: `${pendingOrders} orders waiting, only ${pickingLoad} active picking tasks`,
      recommendation: "Assign more staff to picking"
    });
  }

  // Detect packing bottlenecks
  const packingLoad = packing.filter((p) => p.status !== "Packed").length;
  const pickedOrders = orders.filter((o) => o.status === "Picked").length;
  if (pickedOrders > packingLoad) {
    bottlenecks.push({
      type: "PACKING_BOTTLENECK",
      severity: "MEDIUM",
      message: `${pickedOrders} orders ready to pack, only ${packingLoad} packing tasks`,
      recommendation: "Prioritize packing queue"
    });
  }

  // Detect low stock
  const lowStock = inventory.filter((p) => p.stock > 0 && p.stock <= 5);
  if (lowStock.length > 0) {
    bottlenecks.push({
      type: "LOW_STOCK_WARNING",
      severity: "MEDIUM",
      items: lowStock,
      message: `${lowStock.length} products have low stock`,
      recommendation: "Initiate reorder requests"
    });
  }

  // Detect out of stock
  const outOfStock = inventory.filter((p) => p.stock === 0);
  if (outOfStock.length > 0) {
    bottlenecks.push({
      type: "OUT_OF_STOCK_ALERT",
      severity: "CRITICAL",
      items: outOfStock,
      message: `${outOfStock.length} products are out of stock`,
      recommendation: "Emergency reorder or customer notification"
    });
  }

  return bottlenecks;
};

// Fulfillment Rate Calculator
export const calculateMetrics = (orders) => {
  const total = orders.length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const inProgress = orders.filter(
    (o) => o.status === "Created" || o.status === "Picking" || o.status === "Packed"
  ).length;
  const urgent = orders.filter((o) => o.priority === "Urgent").length;
  const urgentDelivered = orders.filter(
    (o) => o.priority === "Urgent" && o.status === "Delivered"
  ).length;

  return {
    totalOrders: total,
    delivered,
    shipped,
    inProgress,
    fulfillmentRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : 0,
    urgentOrders: urgent,
    urgentFulfillment: urgent > 0 ? ((urgentDelivered / urgent) * 100).toFixed(1) : 0,
    onTimePercentage: ((delivered + shipped) / total * 100).toFixed(1) || 0
  };
};

// Reorder Recommendation Engine
export const getReorderRecommendations = (inventory) => {
  return inventory
    .filter((p) => p.stock <= 5)
    .map((p) => ({
      productId: p.id,
      name: p.name,
      currentStock: p.stock,
      recommendedQuantity: p.stock === 0 ? 50 : 25 - p.stock,
      urgency: p.stock === 0 ? "CRITICAL" : "HIGH"
    }));
};

// Exception Handler
export const handleOrderException = (orderId, exceptionType, inventory) => {
  const solutions = {
    DAMAGED_ITEM: {
      action: "REPLACE_FROM_STOCK",
      message: "Auto-allocate replacement from available stock"
    },
    MISSING_ITEM: {
      action: "PARTIAL_SHIPMENT",
      message: "Ship available items, notify customer of delay for missing item"
    },
    STOCK_CONFLICT: {
      action: "REALLOCATE",
      message: "Re-prioritize orders based on urgency and allocate stock accordingly"
    },
    DELAYED_PICKUP: {
      action: "ESCALATE",
      message: "Alert warehouse manager for manual intervention"
    }
  };

  return solutions[exceptionType] || { action: "MANUAL_REVIEW", message: "Requires manual review" };
};
