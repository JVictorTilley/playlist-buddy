const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetSongTags = async (req, res) => {
  const songId = req.params.songId;
  const oid = new ObjectId(songId);

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const query = { _id: oid };

    const result = await db.collection("songs").findOne(query);

    client.close();

    if (result !== null) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected song" });
    } else {
      res.status(404).json({ status: 404, message: "Song not found" });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleGetSongTags };
