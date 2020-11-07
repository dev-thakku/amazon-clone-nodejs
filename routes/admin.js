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
    console.log(products);
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

router.post("/add-product", (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    let image = req.files.image;
    image.mv("./public/images/product-images/" + id + ".jpg", (err, done) => {
      if (!err) {
        res.render("admin/add-product");
      } else {
        console.log(err);
      }
    });
  });
});

module.exports = router;
