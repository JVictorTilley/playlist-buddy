const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetAllPosts = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const result = await db
      .collection("posts")
      .find()
      .sort({ ts: -1 })
      .toArray();

    if (result.length) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected posts." });
    } else {
      res.status(404).json({ status: 404, message: "No posts available." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetAllPosts };
