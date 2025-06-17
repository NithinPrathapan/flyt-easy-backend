// controllers/flightController.js
import axios from "axios";

export const expressSearchFlights = async (req, res) => {
  try {
    const {
      tripType, // 'oneway', 'round', 'multi'
      from,
      to,
      departure,
      returnDate,
      segments, // for multi-city: [{ from, to, date }]
      adults,
      children,
      infants,
      cabin, // 'E', 'B', etc.
      directOnly,
      refundableOnly,
      airlines = ""
    } = req.body;

    // Get the decoded clientID from middleware (from signature token)  no middleware yet
    // const clientID = req.user?.client_id;
    const clientID = req.body.ClientID || req.headers['clientid'];  //temporary fix

    if (!clientID) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing ClientID" });
    }

    // Construct trip segments based on tripType
    let Trips = [];

    if (tripType === "oneway") {
      Trips.push({
        From: from,
        To: to,
        OnwardDate: departure,
        TUI: ""
      });
    } else if (tripType === "round") {
      Trips.push(
        {
          From: from,
          To: to,
          OnwardDate: departure,
          TUI: ""
        },
        {
          From: to,
          To: from,
          OnwardDate: returnDate,
          TUI: ""
        }
      );
    } else if (tripType === "multi" && Array.isArray(segments)) {
      Trips = segments.map((seg) => ({
        From: seg.from,
        To: seg.to,
        OnwardDate: seg.date,
        TUI: ""
      }));
    } else {
      return res.status(400).json({ success: false, message: "Invalid tripType or segments" });
    }

    // Compose ExpressSearch payload
    const payload = {
      ADT: adults,
      CHD: children,
      INF: infants,
      Cabin: cabin,
      Source: "CF",
      Mode: "AS",
      ClientID: clientID,
      TUI: "",
      FareType: "ON",
      Trips,
      Parameters: {
        Airlines: airlines,
        GroupType: "",
        Refundable: refundableOnly || false,
        IsDirect: directOnly || false,
        IsStudentFare: false,
        IsNearbyAirport: false
      }
    };

    // Make the external API call
    const response = await axios.post(
      `${process.env.FLIGHT_URL}${process.env.EXPRESS_SEARCH_PATH}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${req.user?.token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Express Search Results Retrieved",
      data: response.data
    });

  } catch (error) {
    console.error("ExpressSearch Error:", error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "ExpressSearch failed",
      error: error?.response?.data || error.message
    });
  }
};
