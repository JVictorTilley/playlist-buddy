const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleAddTag = async (req, res) => {
  const { tagId, addedBy = "default" } = req.body;
  const songId = req.params.songId;

  const tagOid = new ObjectId(tagId);
  const songOid = new ObjectId(songId);

  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db();

    const tagQuery = { _id: tagOid };
    const tagResult = await db.collection("tags").findOne(tagQuery);
    if (tagResult != null) {
      const songQuery = { _id: songOid };

      const finalResult = await db.collection("songs").updateOne(songQuery, {
        $addToSet: {
          tags: {
            id: tagResult._id,
            name: tagResult.name,
            type: tagResult.type,
            addedBy: addedBy,
            ratedBy: [addedBy],
            score: 1,
          },
        },
      });

      if (finalResult !== null) {
        return res.status(200).json({
          status: 200,
          data: finalResult,
          message: "Added tag to song.",
        });
      } else {
        res.status(404).json({ status: 404, message: "Song not found." });
      }
    } else {
      return res.status(404).json({ status: 404, message: "Tag not found." });
    }
  } catch (error) {
    console.log(error);
  } finally {
    client.close();
  }
};

module.exports = { handleAddTag };
