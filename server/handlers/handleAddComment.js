const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const format = require("date-fns/format");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleAddComment = async (req, res) => {
  const { content, author } = req.body;
  const postId = req.params.postId;

  const postOid = new ObjectId(postId);
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db();

    const postQuery = { _id: postOid };

    const result = await db.collection("posts").updateOne(postQuery, {
      $addToSet: {
        comments: {
          id: new ObjectId(),
          content,
          author,
          date: format(new Date(), "MMMM dd, yyyy h:mm a"),
        },
      },
    });

    if (result !== null) {
      return res.status(200).json({
        status: 200,
        data: result,
        message: "Added comment to post.",
      });
    } else {
      console.log(result);
      res.status(400).json({ status: 400, message: "Could not add comment." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleAddComment };
