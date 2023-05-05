const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleCreateTag = async (req, res) => {
  const { name, type } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const newTag = {
      name,
      type,
    };

    const result = await db.collection("tags").insertOne(newTag);

    client.close();

    if (result !== null) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Tag added." });
    } else {
      res.status(401).json({ status: 401, message: "Could not add tag." });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleCreateTag };
