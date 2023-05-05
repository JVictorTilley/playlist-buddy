"use strict";

const express = require("express");
const morgan = require("morgan");
const { handleLogin } = require("./handlers/handleLogin");
const { handleRefresh } = require("./handlers/handleRefresh");
const { handleGetTag } = require("./handlers/handleGetTag");
const { handleGetSongTags } = require("./handlers/handleGetSongTags");
const { handleCreateTag } = require("./handlers/handleCreateTag");
const { handleCreateSong } = require("./handlers/handleCreateSong");
const { handleChangeRating } = require("./handlers/handleChangeRating");
const {
  handleGetSongBySpotifyId,
} = require("./handlers/handleGetSongBySpotifyId");
const { handleGetSongsWithTag } = require("./handlers/handleGetSongsWithTag");
const { handleAddTag } = require("./handlers/handleAddTag");
const {
  handleGetProfileBySpotifyId,
} = require("./handlers/handleGetProfileBySpotifyId");
const { handleCreateProfile } = require("./handlers/handleCreateProfile");
const { handleGetAllTags } = require("./handlers/handleGetAllTags");
const { handleCreatePost } = require("./handlers/handleCreatePost");
const { handleGetAllPosts } = require("./handlers/handleGetAllPosts");
const { handleAddComment } = require("./handlers/handleAddComment");
const { handleRatePost } = require("./handlers/handleRatePost");
const {
  handleGetTaggedFromUser,
} = require("./handlers/handleGetTaggedFromUser");
const { handleGetLatestSongs } = require("./handlers/handleGetLatestSongs");

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))

  // REST endpoints

  .get("/tag/:tagId", handleGetTag)
  .get("/allTags", handleGetAllTags)
  .get("/song/recent", handleGetLatestSongs)
  .get("/song/:songId", handleGetSongTags)
  .get("/song/bySpotifyId/:spotId", handleGetSongBySpotifyId)
  .get("/song/byTag/:tagId", handleGetSongsWithTag)
  .get("/profile/:profileId/tagged", handleGetTaggedFromUser)
  .get("/profile/:profileId", handleGetProfileBySpotifyId)
  .get("/allPosts", handleGetAllPosts)

  .post("/refresh", handleRefresh)
  .post("/login", handleLogin)
  .post("/tag/create", handleCreateTag)
  .post("/song/create", handleCreateSong)
  .post("/profile/create", handleCreateProfile)
  .post("/post/create", handleCreatePost)

  .patch("/song/:songId/changeRating", handleChangeRating)
  .patch("/song/:songId/addTag", handleAddTag)
  .patch("/post/:postId/comment", handleAddComment)
  .patch("/post/:postId/rate", handleRatePost)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
