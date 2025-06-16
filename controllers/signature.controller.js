import { fetchSignatureToken } from "../utils/generateToken.js";

export const generateSignature = async (req, res) => {
  const requiredFields = [
    "MerchantID",
    "ApiKey",
    "ClientID",
    "Password",
    "AgentCode",
    "BrowserKey",
  ];

  // Check for missing fields
  const missingFields = requiredFields.filter((field) => !(field in req.body));
  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Missing required fields",
      missingFields,
    });
  }

  try {
    // Pass the fields from the request body to the token generator
    const tokenResponse = await fetchSignatureToken(req.body);
    res.status(200).json(tokenResponse);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch signature token",
      error: err.message,
    });
  }
};
