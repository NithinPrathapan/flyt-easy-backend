// controllers/flightController.js
import axios from "axios";

export const expressSearchFlights = async (req, res) => {
  console.log('callingggg ===============================5');
  
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
    };

    console.log('Payload sent to upstream:', payload);

    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: req.token,
          ClientID: req.clientId,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data, "response");

    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
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

export const getExpSearchFlights = async (req, res) => {
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
          Authorization: req.token,
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
