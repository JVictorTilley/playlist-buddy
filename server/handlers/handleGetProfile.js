const { user } = require("../dummyData/user");

const handleGetProfile = (req, res) => {
  return res.status(200).json({
    status: 200,
    data: user,
  });
};

module.exports = { handleGetProfile };
