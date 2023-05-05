const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleGetTaggedFromUser = async (req, res) => {
  const profileId = req.params.profileId;
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const query = { tags: { $elemMatch: { addedBy: profileId } } };

    const result = await db.collection("songs").find(query).toArray();

    if (result.length > 0) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected songs" });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "No songs tagged by user." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleGetTaggedFromUser };
