const mapsIntegrate = (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  res.status(200).json({ mapsUrl: googleMapsUrl });
};
module.exports = mapsIntegrate;
