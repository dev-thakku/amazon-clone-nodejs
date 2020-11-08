const { response } = require("express");
var express = require("express");
var router = express.Router();

var productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

const verifyLogin = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
};

/* GET home page. */
router.get("/", (req, res, next) => {
  let user = req.session.user;
  console.log("session.user>>>>> ");
  console.log(user);
  productHelpers.getAllProducts().then((products) => {
    let i = 0,
      ln = products.length;
    for (i; i < ln; i++) {
      products[i].no = i + 1;
    }
    res.render("users/view-products", {
      products,
      user,
      home: true,
    });
  });
});

router.get("/signin", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("users/login", {
      loginErr: req.session.loginErr,
      login: true,
      bootstrap: true,
    });
    req.session.passErr = false;
    req.session.noUser = false;
  }
});

router.post("/api/signin", (req, res) => {
  userHelpers.doSignin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/");
    } else if (response.wrongPass) {
      req.session.loginErr = "Invalid Password";
      res.redirect("/signin");
    } else if (response.noUser) {
      req.session.loginErr = "E-Mail not Exists";
      res.redirect("/signin");
    }
  });
});

router.get("/create-account", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
  } else {
    res.render("users/signup", {
      login: true,
      bootstrap: true,
    });
  }
});

router.post("/api/signup", (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/orders", verifyLogin, (req, res) => {
  let user = req.session.user;
  res.render("users/orders", { user });
});

router.get("/cart", verifyLogin, (req, res) => {
  let user = req.session.user;
  res.render("users/cart", { user });
});

module.exports = router;
