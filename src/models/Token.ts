import { Schema, model } from "mongoose";
import { Token } from "../types";

const tokenSchema = new Schema<Token>({
  address: { type: String, unique: true },
  owner: { type: String },
  name: { type: String },
  symbol: { type: String },
  mintable: { type: Boolean },
  burnable: { type: Boolean },
  image: { type: String },
});

export default model<Token>("Token", tokenSchema);
