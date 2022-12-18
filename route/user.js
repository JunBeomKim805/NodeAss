const { User } = require("../model/user");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await User.find();

  if (!userList) {
    res.status(500).json({ success: false });
  }
  return res.send(userList);
});
router.post("/", async (req, res) => {
  let user = new User({
    firstName: req.body.firstName,
    lastName: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    IDNumber: req.body.IDNumber,
    email: req.body.email,
    accountNumber: req.body.accountNumber,
    bank: req.body.bank,
  });

  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  return res.send(user);
});

module.exports = router;
