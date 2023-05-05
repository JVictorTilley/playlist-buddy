const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleRatePost = async (req, res) => {
  const { rating, ratedBy } = req.body;
  const postId = req.params.postId;

  const postOid = new ObjectId(postId);
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const postQuery = { _id: postOid };

    const result = await db.collection("posts").updateOne(postQuery, {
      $inc: {
        rating: rating,
      },
      $addToSet: {
        ratedBy: ratedBy,
      },
    });

    if (result !== null) {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Rated post.",
      });
    } else {
      console.log(result);
      res.status(400).json({ status: 400, message: "Could not rate post." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleRatePost };
