const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleCreateProfile = async (req, res) => {
  const { spotify_id, name, addedTags = [] } = req.body;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db();

    const newProfile = {
      _id: spotify_id,
      name,
      addedTags,
    };

    const result = await db.collection("users").insertOne(newProfile);

    client.close();

    if (result !== null) {
      return res
        .status(200)
        .json({ status: 200, data: result, message: "User added." });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "Could not add user to database." });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleCreateProfile };
