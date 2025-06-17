import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const generateSignature = async () => {
  const signaturePayload = {
    MerchantID: process.env.MERCHANT_ID,
    ApiKey: process.env.API_KEY,
    ClientID: process.env.CLIENT_ID,
    Password: process.env.PASSWORD,
    AgentCode: process.env.AGENT_CODE,
    BrowserKey: process.env.BROWSER_KEY,
    Key: process.env.KEY,
  };

  const response = await axios.post(
    process.env.SIGNATURE_URL,
    signaturePayload
  );
  return response.data.token;
};

export const searchFlights = async (req, res) => {
  try {
    const { journeyType, segments, cabinClass = "1", paxInfo } = req.body;

    const token = await generateSignature();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const requestPayload = {
      JourneyType: journeyType.toString(), // '1', '2', or '3'
      Segments: segments.map((seg) => ({
        Origin: seg.origin,
        Destination: seg.destination,
        PreferredDepartureTime: `${seg.date}T00:00:00`,
      })),
      CabinClass: cabinClass, // '1' for economy
      PreferredAirline: "",
      Sources: null,
      PaxInfo: {
        ADULT: paxInfo?.ADULT || 1,
        CHILD: paxInfo?.CHILD || 0,
        INFANT: paxInfo?.INFANT || 0,
      },
      JourneyDetails: null,
      ChannelID: process.env.CHANNEL_ID,
    };

    const response = await axios.post(
      process.env.SEARCH_FLIGHT_URL,
      requestPayload,
      { headers }
    );

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Flight Search Error:",
      error?.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Flight search failed",
      error: error?.response?.data || error.message,
    });
  }
};
