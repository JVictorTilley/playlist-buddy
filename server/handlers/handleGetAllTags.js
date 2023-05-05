const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetAllTags = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const result = await db.collection("tags").find().toArray();

    if (result.length) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected tag" });
    } else {
      res.status(404).json({ status: 404, message: "Tag not found" });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetAllTags };
