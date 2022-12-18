const { Transaction } = require("../model/transaction");
const express = require("express");
const router = express.Router();
const { User } = require("../model/user");

router.get("/", async (req, res) => {
  let transactionList = await Transaction.find({ status: { $ne: "PENDING" } })
    .populate("sender", "firstName lastName dateOfBirth IDNumber")
    .populate("recipient", "firstName lastName email accountNumber bank")
    .sort({ date: -1 });

  if (!transactionList) {
    res.status(500).json({ success: false });
  }

  return res.send(transactionList);
});
router.post("/", async (req, res) => {
  const sender = await User.findById(req.body.sender)
    .populate()
    .select("firstName lastName dateOfBirth IDNumber");

  if (!sender) return res.status(404).send("Sender Id is not founded!");

  const recipient = await User.findById(req.body.recipient)
    .populate()
    .select("firstName lastName email accountNumber bank");
  if (!recipient) return res.status(404).send("Recipient Id is not founded!");

  let transaction = new Transaction({
    sender,
    recipient,
    amount: req.body.amount,
    currencyCd: req.body.currencyCd,
    comments: req.body.comments,
    status: req.body.status,
  });

  transaction = await transaction.save();

  if (!transaction)
    return res.status(400).send("the Transaction cannot be created!");

  return res.send(transaction);
});

router.get("/sortby", async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  let transactionList = await Transaction.find({
    date: {
      $gte: new Date(startDate).setHours(0, 0, 0, 0),
      $lte: new Date(endDate).setHours(23, 59, 59, 999),
    },
  })
    .select("id date comments")
    .sort({ date: -1 });
  if (!transactionList) {
    res.status(500).json({ success: false });
  }

  return res.send(transactionList);
});

module.exports = router;
