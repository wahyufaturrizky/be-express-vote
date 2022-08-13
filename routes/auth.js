const { register, login } = require("../handlers/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;
