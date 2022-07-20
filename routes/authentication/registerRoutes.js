const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../../schemas/UserSchema");

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
    const seznamDomen = ["seznam.cz", "is.muni.cz"];
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
    res.status(404).render("register", payload);
  }
});
module.exports = router;
