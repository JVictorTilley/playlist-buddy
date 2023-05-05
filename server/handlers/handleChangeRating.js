const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleChangeRating = async (req, res) => {
  const songId = req.params.songId;
  const songOid = new ObjectId(songId);

  const { tagId, rating, ratedBy = "default" } = req.body;
  const tagOid = new ObjectId(tagId);
  console.log(`Song: ${songId} Tag: ${tagOid} Rating: ${rating}`);

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const query = { _id: songOid };
    const filters = { arrayFilters: [{ "t.id": { $eq: tagOid } }] };

    const result = await db
      .collection("songs")
      .updateOne(
        query,
        {
          $inc: { "tags.$[t].score": rating },
          $addToSet: { "tags.$[t].ratedBy": ratedBy },
        },
        filters
      );

    client.close();

    if (result.matchedCount > 0) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Selected tag" });
    } else {
      res.status(404).json({ status: 404, message: "Tag not found", result });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleChangeRating };
