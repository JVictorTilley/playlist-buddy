const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetProfileBySpotifyId = async (req, res) => {
  const profileId = req.params.profileId;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const query = { _id: profileId };

    const result = await db.collection("users").findOne(query);

    if (result != null) {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Selected user by Spotify ID.",
      });
    } else {
      res.status(404).json({ status: 404, message: "Song not in database." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetProfileBySpotifyId };
