const db = require("../models");

exports.showPolls = async (req, res, next) => {
  try {
    const polls = await db.Poll.find().populate("user", ["username", "id"]);

    res.json(polls);
  } catch (error) {
    error.status = 400;

    next(error);
  }
};

exports.createPoll = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const user = await db.User.findById(id);

    const { question, options } = req.body;
    const poll = await db.Poll.create({
      question,
      user,
      options: options.map((option) => ({ option, votes: 0 })),
    });

    user.polls.push(poll._id);
    await user.save();

    res.status(201).json({ ...poll._doc, user: user._id });
  } catch (error) {
    error.status = 400;

    next(error);
  }
};

exports.usersPolls = async (req, res, next) => {
  try {
    const { id } = req.decoded;

    const user = await db.User.findById(id).populate("polls");

    res.json(user.polls);
  } catch (error) {
    error.status = 400;

    next(error);
  }
};

exports.getPoll = async (req, res, next) => {
  try {
    const { id } = req.params;

    const poll = await db.Poll.findById(id).populate("user", [
      "username",
      "id",
    ]);

    if (!poll) {
      throw new Error("No poll found");
    }

    res.json(poll);
  } catch (error) {
    error.status = 400;

    next(error);
  }
};

exports.deletePoll = async (req, res, next) => {
  try {
    const { id: pollId } = req.params;
    const { id: userId } = req.decoded;

    const poll = await db.Poll.findById(pollId);

    if (!poll) {
      throw new Error("No poll found");
    }

    if (poll.user.toString() !== userId) {
      throw new Error("Unauthorized access");
    }
    await poll.remove();

    res.json({ message: "Success delete poll " + pollId });
  } catch (error) {
    error.status = 400;

    next(error);
  }
};

exports.vote = async (req, res, next) => {
  try {
    const { id: pollId } = req.params;
    const { id: userId } = req.decoded;
    const { answer } = req.body;

    if (answer) {
      const poll = await db.Poll.findById(pollId);

      if (!poll) {
        throw new Error("No poll found");
      }

      const vote = poll.options.map((option) => {
        if (option.option === answer) {
          console.log("@option", option);
          return {
            ...option,
            votes: option.votes + 1,
          };
        } else {
          return option;
        }
      });
      console.log("@vote", vote);

      if (poll.voted.filter((user) => user.toString() === userId).length <= 0) {
        poll.voted.push(userId);
        poll.options = vote;
        await poll.save();

        res.status(201).json({ poll, message: "success voted", success: true });
      } else {
        throw new Error("Already voted");
      }
    }
  } catch (error) {
    error.status = 400;

    next(error);
  }
};
