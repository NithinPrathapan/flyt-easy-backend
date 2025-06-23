// controllers/flightController.js
import axios from "axios";

export const expressSearchFlights = async (req, res) => {
  try {
    const {
      ADT,
      CHD,
      INF,
      Cabin,
      Source,
      Mode,
      TUI,
      FareType,
      Trips,
      Parameters,
    } = req.body;
    console.log(req.body, "body");

    if (!req.clientId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing ClientID or Token",
      });
    }

    const payload = {
      ADT,
      CHD,
      INF,
      Cabin,
      Source: Source || "CF",
      Mode: Mode || "AS",
      ClientID: req.clientId,
      TUI: TUI || "",
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
    };

    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: req.token,
          ClientID: req.clientId,
          TUI: TUI || "",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response, "response");

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
  const clientId = req.clientId;
  const payload = {
    TUI,
    ClientID: clientId,
  };
  console.log(TUI, clientId, "TUI");

  try {
    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: req.token,
          ClientID: req.clientId,
        },
      }
    );
    console.log(response, "response");
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
