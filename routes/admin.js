const { response } = require("express");
var express = require("express");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");

/* GET admin listing. */
router.get("/", (req, res, next) => {
  productHelpers.getAllProducts().then((products) => {
    let i = 0,
      ln = products.length;
    for (i; i < ln; i++) {
      products[i].no = i + 1;
    }
    res.render("admin/view-products", {
      products,
      admin: true,
      bootstrap: true,
    });
  });
});

router.get("/add-product", (req, res) => {
  res.render("admin/add-product", { bootstrap: true, admin: true });
});

router.post("/api/add-product", (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/images/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.redirect("/admin");
      } else {
        console.log(err);
      }
    });
  });
});

router.get("/delete-product", (req, res) => {
  let proId = req.query.id;
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response) => {
    res.redirect("/admin/");
  });
});

router.get("/product-details", (req, res) => {
  let proId = req.query.id;
  productHelpers.getProductDetails(proId).then((product) => {
    console.log(product);
    res.render("admin/product-details", {
      product,
      bootstrap: true,
      admin: true,
    });
  });
});

router.get("/edit-product", (req, res) => {
  let proId = req.query.id;
  console.log(proId);
  productHelpers.getProductDetails(proId).then((product) => {
    res.render("admin/edit-product", {
      product,
      bootstrap: true,
      admin: true,
    });
  });
});

router.post("/api/edit-product", (req, res) => {
  let proId = req.query.id;
  productHelpers.updateProduct(req.body, proId).then(() => {
    if (req.files.image) {
      let image = req.files.image;
      image.mv("./public/images/product-images/" + proId + ".jpg");
    }
    res.redirect("/admin");
  });
});
module.exports = router;
