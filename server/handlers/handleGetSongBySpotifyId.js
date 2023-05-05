const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetSongBySpotifyId = async (req, res) => {
  const spotId = req.params.spotId;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const query = { spotify_id: spotId };

    const result = await db
      .collection("songs")
      .findOne(query, { projection: { spotify_id: 1 } });

    client.close();

    if (result != null) {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Selected by Spotify ID.",
      });
    } else {
      res.status(404).json({ status: 404, message: "Song not in database." });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleGetSongBySpotifyId };
