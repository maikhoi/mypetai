import mongoose, { Schema, model, models } from "mongoose";

const menuSchema = new Schema({
  type: { type: String, enum: ["pet"], required: true },
  items: { type: Array, default: [] },
  lastBuilt: { type: Date, default: Date.now }
});

const Menu = models.Menu || model("Menu", menuSchema);
export default Menu;
