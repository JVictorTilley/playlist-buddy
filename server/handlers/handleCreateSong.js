const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleCreateSong = async (req, res) => {
  const { spotify_id = null, name, artists, tags = [] } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const newSong = {
      spotify_id,
      name,
      artists,
      tags,
    };

    const result = await db.collection("songs").insertOne(newSong);

    client.close();

    if (result !== null) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Song added." });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Could not add song to database." });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleCreateSong };
