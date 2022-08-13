const {
  showPolls,
  createPoll,
  usersPolls,
  getPoll,
  deletePoll,
} = require("../handlers/poll");
const auth = require("../middlewares/auth");

const router = require("express").Router();

router.route("/").get(showPolls).post(auth, createPoll);

router.get("/user", auth, usersPolls);

router.route("/:id").get(getPoll).post().delete(auth, deletePoll);
module.exports = router;
