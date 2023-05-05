const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetLatestSongs = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const result = await db
      .collection("songs")
      .find()
      .sort({ _id: -1 })
      .limit(4)
      .toArray();

    if (result.length) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected songs." });
    } else {
      res.status(404).json({ status: 404, message: "No songs available." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetLatestSongs };
