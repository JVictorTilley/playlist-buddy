const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetSongsWithTag = async (req, res) => {
  const tagId = req.params.tagId;
  const oid = new ObjectId(tagId);

  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const query = { tags: { $elemMatch: { id: oid } } };

    const result = await db.collection("songs").find(query).toArray();

    if (result.length > 0) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected song" });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "No songs with selected ID." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetSongsWithTag };
