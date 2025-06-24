// controllers/flightController.js
import axios from "axios";

export const expressSearchFlights = async (req, res) => {
  console.log('=== EXPRESS SEARCH DEBUG ===');
  console.log('Request body:', req.body);
  console.log('Client ID:', req.clientId);
  console.log('Token:', req.token ? 'Present' : 'Missing');
  console.log('Environment variables:');
  console.log('- FLIGHT_URL:', process.env.FLIGHT_URL);
  console.log('- EXPRESS_SEARCH_PATH:', process.env.EXPRESS_SEARCH_PATH);
  
  try {
    const {
      ADT,
      CHD,
      INF,
      Cabin,
      Source,
      Mode,
      FareType,
      Trips,
    } = req.body;
    console.log(req.body, "body");

    if (!req.clientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing ClientID or Token",
      });
    }

    // Only send required fields to upstream API
    const payload = {
      ADT,
      CHD,
      INF,
      Cabin,
      Source: Source || "CF",
      Mode: Mode || "SY",
      ClientID: req.clientId,
      FareType: FareType || "ON",
      Trips,
      Parameters: {
        Airlines: Parameters?.Airlines || "",
        GroupType: Parameters?.GroupType || "",
        Refundable: Parameters?.Refundable || false,
        IsDirect: Parameters?.IsDirect || false,
        IsStudentFare: Parameters?.IsStudentFare || false,
        IsNearbyAirport: Parameters?.IsNearbyAirport || false,
      },
      TUI: TUI || "",

    };

    console.log('Final payload:', payload);
    console.log('Upstream URL:', `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`);
    console.log('Headers:', {
      Authorization: `Bearer ${req.token}`,
      ClientID: req.clientId,
      "Content-Type": "application/json",
    });

    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log('Upstream response:', response.data);
    
    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
      data: response.data,
    });
  } catch (error) {
    console.error('=== UPSTREAM API ERROR ===');
    console.error('Status:', error?.response?.status);
    console.error('Status Text:', error?.response?.statusText);
    console.error('Response Data:', error?.response?.data);
    console.error('Request URL:', error?.config?.url);
    console.error('Request Method:', error?.config?.method);
    console.error('Request Headers:', error?.config?.headers);
    console.error('Request Data:', error?.config?.data);
    
    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message,
      details: {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        url: error?.config?.url
      }
    });
  }
};

export const getExpSearchFlights = async (req, res) => {
  console.log('callingggg ===============================5 get exp search');
  
  const { TUI } = req.body;
  console.log(TUI, "TUI======================");
  
  const clientId = req.clientId;
  const payload = {
    TUI,
    ClientID: clientId,
  };
  console.log(TUI, clientId, "TUI");

  try {
    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.GET_EXP_SEARCH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.token}`,
          ClientID: req.clientId,
        },
      }
    );
    // console.log(response, "response");
    return res.status(200).json({
      success: true,
      message: "ExpressSearch Results Retrieved",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "ExpressSearch Error:",
      error?.response?.data || error.message
    );
    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message,
    });
  }
};
