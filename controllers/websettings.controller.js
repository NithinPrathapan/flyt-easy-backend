import axios from 'axios';

export const getWebSettings = async (req, res) => {
  try {
    const { TUI, ClientID } = req.body;
    const payload = { TUI, ClientID };

    const { data } = await axios.post(`${process.env.UTILS_URL}/Utils/WebSettings`, payload);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch web settings', error: err.message });
  }
};
    