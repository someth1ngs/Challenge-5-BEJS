const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

// Restrict for Authenticate
let restrict = (req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization || !authorization.split(" ")[1]) {
    res.status(400).json({
      status: false,
      message: "Token not provided",
      data: null,
    });
  }

  let token = authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      res.status(401).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    delete user.iat
    req.user = user;
  });
  next();
};

// Required Controller
const accountController = require("../../controller/v1/accountController.js");
const userController = require("../../controller/v1/userController.js");
const transactionsController = require("../../controller/v1/transactionsController.js");
const authController = require("../../controller/v1/authController.js");

// Directory Documentation API
const swagger_path = path.resolve(__dirname, "../../api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use(
  "/api/v1/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument)
);

// API Users + Profile //
router.post("/api/v1/users", userController.store);
router.get("/api/v1/users", userController.index);
router.get("/api/v1/users/:userId", userController.show);

// API Account //
router.post("/api/v1/accounts", accountController.store);
router.get("/api/v1/accounts", accountController.index);
router.get("/api/v1/accounts/:id", accountController.show);

// API Transaction //
router.post("/api/v1/transactions", transactionsController.store);
router.get("/api/v1/transactions", transactionsController.index);
router.get("/api/v1/transactions/:id", transactionsController.show);

// API Auth //
router.post("/api/v1/register", authController.register);
router.post("/api/v1/login", authController.login);
router.get("/api/v1/authenticate", restrict, authController.auth);

module.exports = router;
