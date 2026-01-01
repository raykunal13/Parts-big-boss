import redisClient from "../db/redisClient.js";
import AppError from "../utils/appError.js";
import asyncHandler from "../utils/asyncHandler.js";

const getCartKey = (userId) => `cart:${userId}`;

export const getCart = asyncHandler(async (req, res) => {
  const cart = await redisClient.get(getCartKey(req.user.id));
  res.status(200).json(cart ? JSON.parse(cart) : []);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, price, title, image } = req.body;

  if (!quantity || Number(quantity) <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }
  const userId = req.user.id;
  const key = getCartKey(userId);

  let cart = await redisClient.get(key);
  cart = cart ? JSON.parse(cart) : [];

  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += Number(quantity);
  } else {
    cart.push({ productId, quantity: Number(quantity), price, title, image });
  }

  await redisClient.set(key, JSON.stringify(cart), "EX", 604800);
  res.status(200).json(cart);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.id;
  const key = getCartKey(userId);

  let cart = await redisClient.get(key);
  cart = cart ? JSON.parse(cart) : [];

  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex > -1) {
    cart.splice(itemIndex, 1);
  }

  await redisClient.set(key, JSON.stringify(cart), "EX", 604800);
  res.status(200).json(cart);
});

export const updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  if (!quantity || Number(quantity) <= 0) {
    throw new AppError("Quantity must be greater than 0", 400);
  }

  const userId = req.user.id;
  const key = getCartKey(userId);

  let cart = await redisClient.get(key);
  cart = cart ? JSON.parse(cart) : [];

  const itemIndex = cart.findIndex((item) => item.productId === productId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity = Number(quantity);
    await redisClient.set(key, JSON.stringify(cart), "EX", 604800);
    res.status(200).json(cart);
  } else {
    throw new AppError("Item not found in cart", 404);
  }
});
