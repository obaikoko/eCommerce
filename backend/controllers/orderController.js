import Order from '../models/orderModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// @desc Create new Order
// @route OOST /api/orders
// @privacy Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No Ordered Items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201);
    res.json(createOrder);
  }
});

// @desc Get logged in users orders
// @route GET /api/orders/mine
// @privacy Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200);
  res.json(orders);
});

// @desc Get order by ID
// @route GET /api/orders/:id
// @privacy Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'firstName lastName email'
  );

  if (order) {
    res.status(200);
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc  update order to paid
// @route PUT /api/orders/:id/pay
// @privacy Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updateOrder = await order.save();

    res.status(200);
    res.json(updateOrder);
  } else {
    res.status(404);
    throw new Error('Not Found!');
  }
});

// @desc  update order to delivered
// @route PUT /api/orders/:id/deliver
// @privacy Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc Get all orders
// @route GET /api/orders
// @privacy Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate(
    'user',
    'id firstName lastName email'
  );
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
