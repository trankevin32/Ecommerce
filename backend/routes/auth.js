const express = require("express");
const { body } = require("express-validator/check");

const User = require("../models/user");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("name")
      .custom((value, { req }) => {
        return User.findOne({ Name: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("Username already exists!");
          }
        });
      })
      .trim()
      .isLength({ max:25 })
      .not()
      .isEmpty(),

    body("password")
      .trim()
      .isLength({ min: 8, max: 25 })
      .not()
      .isEmpty(),
    
    body("firstname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("lastname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("address1")
      .isLength({ max: 100 })
      .not()
      .isEmpty(),

    body("address2")
      .isLength({ max: 100 }),
    
    body("city")
      .isLength({ max:100 })
      .not()
      .isEmpty(),

    body("state")
      .isLength({ max:2, min:2 })
      .not()
      .isEmpty(),

    body("zipcode")
      .isLength({ min: 5, max: 9 })
      .not()
      .isEmpty()

  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/user-profile", isAuth, authController.showUserProfile);

router.put(
  "/update-profile",isAuth,
  [
    body("name")
      .custom((value, { req }) => {
        return User.findOne({ Name: value })
        .then(userDoc => {
          if (userDoc && req.userId!=userDoc.id) {
            return Promise.reject("Someone with this name already exists!");
          }
        });
      })
      .trim()
      .isLength({ max:25 })
      .not()
      .isEmpty(),
    
    body("firstname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("lastname")
      .trim()
      .isLength({ max: 25 })
      .not()
      .isEmpty(),

    body("address1")
      .isLength({ max: 100 })
      .not()
      .isEmpty(),

    body("address2")
      .isLength({ max: 100 }),
    
    body("city")
      .isLength({ max:100 })
      .not()
      .isEmpty(),

    body("state")
      .isLength({ max:2, min:2 })
      .not()
      .isEmpty(),

    body("zipcode")
      .isLength({ min: 5, max: 9 })
      .not()
      .isEmpty()

  ],
  authController.updateProfile
);


module.exports = router;