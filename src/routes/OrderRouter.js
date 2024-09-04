const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require("../middleware/authMiddleware");

router.post('/create',  OrderController.createOrder)
router.get('/get-all-order/:id', OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails)
router.get('/get-all-order', OrderController.getAllOrder)
router.get('/get-order-details/:id', OrderController.getDetailsOrder)
router.post('/delete-many-order',  OrderController.deleteManyOrder)
router.put('/update/:id', OrderController.updateOrder)

module.exports = router