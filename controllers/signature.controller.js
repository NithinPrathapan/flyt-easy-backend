export const generateSignature = async (req, res) => {
  try {
    const { MerchantID, ApiKey, ClientID, Password, AgentCode, BrowserKey } =
      req.body;

    if (
      !MerchantID ||
      !ApiKey ||
      !ClientID ||
      !Password ||
      !AgentCode ||
      !BrowserKey
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const requiredFields = [
      "MerchantID",
      "ApiKey",
      "ClientID",
      "Password",
      "AgentCode",
      "BrowserKey",
    ];

    const missingFields = requiredFields.filter(
      (field) => !(field in req.body)
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    const signature = await fetchSignatureToken(req.body);

    res.status(200).json(signature);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to generate signature",
      error: error.message,
    });
  }
};
