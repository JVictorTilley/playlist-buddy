const { MongoClient, Timestamp } = require("mongodb");
require("dotenv").config();
const format = require("date-fns/format");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleCreatePost = async (req, res) => {
  const {
    content,
    type,
    author,
    relatedSong,
    relatedTag,
    relatedPlaylist,
    relatedArtist,
  } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const newPost = {
      content,
      type,
      author,
      date: format(new Date(), "MMMM dd, yyyy h:mm a"),
      comments: [],
      relatedArtist,
      relatedPlaylist,
      relatedSong,
      relatedTag,
      rating: 0,
      ts: new Timestamp(),
    };

    const result = await db.collection("posts").insertOne(newPost);

    client.close();

    if (result !== null) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "Post added." });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Could not add post to database." });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleCreatePost };
