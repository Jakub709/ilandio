const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");

router.get("/", async (req, res, next) => {
  // const updatedUser = await User.findById(req.session.user._id);
  const bankCoins = {
    userLoggedIn: req.session.user,
    errorMessage: "",
  };
  res.status(200).send(bankCoins);
});

router.post("/", async (req, res, next) => {
  try {
    // Odesílatel/Příjemce
    const emailTransfer = req.body.emailTransfer;
    const senderEmail = req.session.user.email;
    const nameTransfer = req.body.nameTransfer.trim();
    const moneyTransfer = Math.abs(req.body.moneyTransfer.trim() * 1);
    const updatedSender = await User.findById(req.session.user._id);

    const receiverConfirmed = await User.findOne({ email: emailTransfer });
    if (!receiverConfirmed) {
      const noReceiver = {
        userLoggedIn: updatedSender,
        errorMessage: "Bankovní účet příjemce neexistuje",
        status: "fail",
      };
      res.status(200).send(noReceiver);
    } else if (!nameTransfer) {
      const noNameTransfer = {
        userLoggedIn: updatedSender,
        errorMessage: "Uveďte jméno příjemce",
        status: "fail",
      };
      res.status(200).send(noNameTransfer);
    } else if (!moneyTransfer) {
      const noMoneyTransfer = {
        userLoggedIn: updatedSender,
        errorMessage: "Uveďte prosím částku",
        status: "fail",
      };
      res.status(200).send(noMoneyTransfer);
    } else if (moneyTransfer > updatedSender.accountBalance * 1) {
      const noMoney = {
        userLoggedIn: updatedSender,
        errorMessage: "Bohužel nemáte na účtě dostatek Educoinů",
        status: "fail",
      };
      res.status(200).send(noMoney);
    } else {
      //Update databáze
      const receiverDB = await User.findOneAndUpdate(
        { email: emailTransfer },
        {
          $push: {
            moneyTransfer: moneyTransfer,
            nameTransfer: updatedSender.name,
            dateTransfer: new Date(),
            emailTransfer: senderEmail,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      const senderDB = await User.findOneAndUpdate(
        { email: senderEmail },
        {
          $push: {
            moneyTransfer: -moneyTransfer,
            nameTransfer: nameTransfer,
            dateTransfer: new Date(),
            emailTransfer: emailTransfer,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
      const success = {
        userLoggedIn: senderDB,
        errorMessage: "Platba proběhla v pořádku",
        status: "success",
      };
      req.session.user = senderDB;
      res.status(200).send(success);
    }
  } catch {
    const fail = {
      userLoggedIn: req.session.user,
      errorMessage: "Něco se pokazilo :-(",
      status: "fail",
    };
    res.status(200).send(fail);
  }
});

module.exports = router;
