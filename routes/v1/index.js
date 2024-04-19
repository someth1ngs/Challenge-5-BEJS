const router = require("express").Router();

const accountController = require("../../controller/v1/accountController.js");
const userController = require("../../controller/v1/userController.js");
const transactionsController = require("../../controller/v1/transactionsController.js");

// API Users + Profile //
router.post("/users", userController.store);
router.get("/users", userController.index);
router.get("/users/:userId", userController.show);

// API Account //
router.post("/accounts", accountController.store);
router.get("/accounts", accountController.index);
router.get("/accounts/:id", accountController.show);

// API Transaction //
router.post("/transactions", transactionsController.store);
router.get("/transactions", transactionsController.index);
router.get("/transactions/:id", transactionsController.show);

module.exports = router;
