import { Schema, model } from "mongoose";
import { Collection } from "../types";

const collectionSchema = new Schema<Collection>({
  address: { type: String, unique: true },
  owner: { type: String },
  name: { type: String },
  symbol: { type: String },
  image: { type: String },
  banner: { type: String },
  data: {},
  description: { type: String },
  discord: { type: String },
  telegram: { type: String },
  twitter: { type: String },
  website: { type: String },
});

export default model<Collection>("Collection", collectionSchema);
