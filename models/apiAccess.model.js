// api access model

import mongoose from "mongoose";

const apiAccessSchema = new mongoose.Schema({
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
});

const ApiAccess = mongoose.model("ApiAccess", apiAccessSchema);

export default ApiAccess;