import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      console.log('newItem', newItem)
      console.log('state.items', state)
      const existed = state.items.find((item) => item._id === newItem._id);
      if (!existed) {
        state.items.push({ ...newItem, quantity: newItem.quantity });
      } else {
        existed.quantity += newItem.quantity;
      }
    },
    increaseQuantity(state, action) {
      const productId = action.payload;
      const product = state.items.find((item) => item._id === productId);
      if (product && product.quantity < product.stock) {
        product.quantity++;
      }
    },
    decreaseQuantity(state, action) {
      const productId = action.payload;
      const product = state.items.find((item) => item._id === productId);
      if (product?.quantity > 1) {
        product.quantity--;
      }
    },
    removeFromCart(state, action) {
      const productId = action.payload;
      state.items = state.items.filter((item) => item._id !== productId);
    },
    clearCart(state, action) {
      state.items = [];
    }
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice;