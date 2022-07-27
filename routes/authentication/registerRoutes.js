const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../../schemas/UserSchema");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

app.use(bodyParser.urlencoded({ extended: false }));

// Stránka s registrací
router.get("/", async (req, res, next) => {
  res.status(200).render("register", {
    errorMessage: "",
    name: "",
    username: "",
    email: "",
  });
});

// Registrace
router.post("/", async (req, res, next) => {
  try {
    // Potřebné proměnné
    const username = req.body.username.trim();
    const email = req.body.email.trim();
    const emailDomena = email.split("@").pop();
    const seznamDomen = ["seznam.cz", "is.muni.cz", "gmail.com"];
    const password = req.body.password;
    const passwordConf = req.body.passwordConf;
    const passwordLength = password.length;
    const payload = req.body;
    payload.counter = "";

    // Validace hesla
    if ((password === passwordConf) & (passwordLength >= 6)) {
      // Zjištění již existujícího uživatele
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      }).catch((error) => {
        payload.errormessage = "⚠ Něco se pokazilo :-(. Zkuste to znovu :-).";
        res.status(200).render("register", payload);
      });
      if (seznamDomen.includes(emailDomena)) {
        if (user == null) {
          // Uživatel nenalezen
          const data = req.body;
          data.password = await bcrypt.hash(password, 10);

          const emailText = `<b>iLandio Tě vítá!</b> <br><br> Stačí kliknout na tento <a href=https://ilandio.herokuapp.com/account-confirmed/${email}> odkaz</a> a tvůj účet bude aktivován. <br><br>Krásný den přeje <br> <b>Jakub</b>`;

          // Nodemailer - odeslání potvrzovacího emailu
          require("dotenv").config();
          const transporter = nodemailer.createTransport({
            host: "smtp.seznam.cz",
            auth: {
              user: "info@ilandio.cz",
              pass: process.env.PASSWORD,
            },
          });

          const mailOptions = {
            from: "info@ilandio.cz",
            to: email,
            subject: "Vítej v iLandiu ",
            html: emailText,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          User.create(data).then((user) => {
            req.session.user = user;
            return res.redirect("/after-reg");
          });
        } else {
          // Uživatel nalezen
          const email = req.body.email.trim();
          let errorMessage;
          if (email == user.email) {
            payload.errorMessage = "⚠ Email se již používá";
          } else {
            payload.errorMessage = "⚠ Uživatelské jméno se již používá";
          }
          res.status(200).render("register", payload);
        }
      } else {
        payload.errorMessage =
          "⚠ Uveďte email vaší instituce, která je do Elandia zapojena.";
        res.status(200).render("register", payload);
      }
    } else {
      payload.errorMessage = "⚠ Hesla se musí shodovat a mít minimálně 6 znaků";
      res.status(200).render("register", payload);
    }
  } catch (err) {
    res.status(404).render("error");
  }
});
module.exports = router;
