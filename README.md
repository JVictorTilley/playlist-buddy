# playlist-buddy

John Victor Tilley
Demo link: https://drive.google.com/file/d/12oSoMj7jvVsaMKnYeVbMD-uuLwOGv9v0/view?usp=sharing

A way to find new music and playlists for Spotify. The idea is to have a more user-driven music-finding experience, similar to something like Letterboxd for movies or Steam's user-created tags.

## Spotify Usage

Spotify is used for the vast majority of the content, besides the tagging and post features. The package spotify-web-api-node is used to format the calls: https://www.npmjs.com/package/spotify-web-api-node

API calls are used per-page to request the current logged-in user, profile info, all playlist data, and (almost) all song data.

## Client

### Authentication

The app uses Spotify's OAuth 2.0 login system and most things besides the homepage require logging in. The login button sends the user to a Spotify login page. The user allows the app access to some basic info about their profile (like their public and private playlists). A token is then stored in session storage, and this token is used by the client-side components that need to make Spotify API calls.

A "UseAuth" hook grabs the user's Spotify profile per-page and provides it to components which call it. This is used for stuff like the username and profile picture.

### Homepage

The homepage offers a feed of the latest activities (currently, these are when tags are added, and when a new user joins.) These posts are shown to all users, and users can leave comments on the activity, or press "WOW!" to like the post.

### Tagging

Songs can be tagged with different properties, including:

- Genre
- Vocals (male/female/instrumental, for example)
- Instruments used
- More vague "Vibe" tags.

The idea is that users apply these tags to a song so other users can find them more easily. Each tag has a rating system so users can rate whether the tag is a good fit.

The song needs to be registered in the database before it can be tagged.

### Profile

The first time a Spotify account logs into the site, a document is made to store the username, a link to their full Spotify profile, and the user's tagged songs.

On the profile page, the app fetches the user's image, country code, and playlists from the Spotify API.

### Playlists

Playlist pages fetch the playlist data from Spotify to show the playlist image and the tracklist. The app automatically checks each track with the MongoDB database to see if the song has been registered yet. If a playlist has any songs that aren't registered, there will be a button to "import" the missing tracks.

## MongoDB

The app uses MongoDB to store:

- Usernames with a reference to the full Spotify profile;
- Song names and artists (for searching) with a reference to the spotify ID;
- All tag info;
- All post info.

### Posts

- \_id: ObjectID
- content: The main post content.
- type: Dype of post (New user, added tag, etc.)
- author: Post author.
- date: Date/time posted.
- comments: Array of comments:
  - id: Comment ID.
  - content: Main comment content.
  - author: Comment poster.
  - date: Date/time commented.
- relatedArtist/Playlist/Song/Tag: IDs for post metadata.
- rating: Current score.
- ts: A nicer timestamp for sorting.
- ratedBy: Array of userIDs of people who rated the post.

### Songs

- \_id: ObjectID
- spotify_id: ID to cross-reference the Spotify info.
- name: Track title.
- artists: Array of artist names (some places will only show the first).
- tags: Array of tags:
  - id: Tag ObjectID for joining.
  - name: Tag name.
  - type: Tag type (genre, instruments, vocals, vibe, etc.)
  - score: how good a fit this tag is for the song.
  - addedBy: Who added the tag initially.
  - ratedBy: Who's voted on this tag.

### Tags

- \_id: ObjectID
- name: Tag name.
- type: Tag type (genre, instruments, vocals, vibe, etc.)

### Users

- \_id: Spotify ID.
- name: Display name.
- addedTags: Tags created by the user (can only make tags in the backend right now)

## Server

The server is a RESTful backend which serves two main purposes:

- To securely deliver the access token to the client;
- To handle all MongoDB operations.

The server has the Spotify app's secret key so it can't be accessed from the browser.
The secret key is needed for getting access tokens.

| Method | Query                      | Description                                          | Input                                   |
| ------ | -------------------------- | ---------------------------------------------------- | --------------------------------------- |
| GET    | /tag/:tagId                | Get tag by ID                                        | Params                                  |
|        | /allTags                   | Get array of all tags.                               | 🚫                                      |
|        | /song/recent               | Get the last 4 songs added.                          | 🚫                                      |
|        | /song/:songId              | Get song by DB ID.                                   | Params                                  |
|        | /song/bySpotifyId/:spotId  | Get song's database ID.                              | Params                                  |
|        | /song/byTag/:tagId         | Get all songs with a certain tag.                    | Params                                  |
|        | /profile/:profileId/tagged | Get songs tagged by user.                            | Params                                  |
|        | /profile/:profileId        | Get user's MongoDB profile.                          | Params                                  |
|        | /allPosts                  | Get the full post feed.                              | 🚫                                      |
| POST   | /refresh                   | Refresh access token.                                | refreshToken                            |
|        | /login                     | Grants access token, refresh token, and expire time. | authCode                                |
|        | /tag/create                | Create a new tag.                                    | name, type                              |
|        | /song/create               | Imports a song to the DB.                            | spotify_id(?), name, artists, tags(?)   |
|        | /profile/create            | Imports a Spotify user.                              | spotify_id, name, addedTags(?)          |
|        | /post/create               | Makes a new post.                                    | content, type, author, related(...)     |
| PATCH  | /song/:songId/changeRating | Upvotes/Downvotes a song's tag.                      | songId (Params), tagId, rating, ratedBy |
|        | /song/:songId/addTag       | Attaches a tag to a song.                            | songId (Params), tagId, addedBy         |
|        | /post/:postId/comment      | Comments on a post.                                  | postId (Params), content, author        |
|        | /post/:postId/rate         | Rates a post.                                        | postId (Params), rating, ratedBy        |
