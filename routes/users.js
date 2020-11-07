const { response } = require("express");
var express = require("express");
var router = express.Router();

var productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");

/* GET home page. */
router.get("/", (req, res, next) => {
  let user = req.session.user;
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
      passErr: req.session.passErr,
      noUser: req.session.noUser,
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
      req.session.passErr = true;
      res.redirect("/signin");
    } else if (response.noUser) {
      req.session.noUser = true;
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

router.get("/orders", (req, res) => {
  if (req.session.loggedIn) {
    res.render("users/orders");
  } else {
    res.redirect("/signin");
  }
});

module.exports = router;
