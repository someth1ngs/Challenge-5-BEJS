const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");

const accountController = require("../../controller/v1/accountController.js");
const userController = require("../../controller/v1/userController.js");
const transactionsController = require("../../controller/v1/transactionsController.js");

const swagger_path = path.resolve(__dirname, "../../api-docs.yaml");
const file = fs.readFileSync(swagger_path, "utf-8");

// API Docs
const swaggerDocument = YAML.parse(file);
router.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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

module.exports = router;
