import jwt from "jsonwebtoken";

export const generateMuxToken = async (req, res) => {
  try {
    const { playbackId } = req.params;

    const privateKey = Buffer.from(
      process.env.MUX_SECRET_KEY,
      "base64"
    ).toString("utf-8");

    const token = jwt.sign(
      {
        sub: playbackId,
        aud: "v",
        exp: Math.floor(Date.now() / 1000) + 60 * 10,
      },
      privateKey,
      {
        algorithm: "RS256",
        keyid: process.env.MUX_KEY_ID,
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate Mux token" });
  }
};