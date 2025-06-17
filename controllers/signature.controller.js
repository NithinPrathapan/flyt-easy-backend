import axios from "axios";

export const generateToken = async (req, res) => {
  try {
    const payload = {
      MerchantID: process.env.MERCHANT_ID,
      ApiKey: process.env.API_KEY,
      ClientID: process.env.CLIENT_ID,
      Password: process.env.PASSWORD,
      AgentCode: "",
      BrowserKey: process.env.BROWSER_KEY,
      Key: process.env.KEY,
    };

    const response = await axios.post(process.env.SIGNATURE_API, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const token = response.data?.Token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not received" });
    }

    return res.status(200).json({ success: true, token });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate token",
      error: err.message,
    });
  }
};
