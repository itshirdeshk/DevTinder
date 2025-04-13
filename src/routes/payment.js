const express = require('express');
const router = express.Router();
const razorpayInstance = require("../utils/razorpay")
const Payment = require("../models/payment");
const User = require("../models/user");
const { membershipAmount } = require("../utils/constants")
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

// Payment route
router.post("/create", userAuth, async (req, res) => {
    const { membershipType } = req.body;
    const { firstName, lastName } = req.user;
    try {
        const order = await razorpayInstance.orders.create({
            amount: membershipAmount[membershipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                firstName: firstName,
                lastName: lastName,
                membershipType: membershipType,
            }
        })

        // Save the order in the database
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            status: order.status,
            currency: order.currency,
            amount: order.amount,
            receipt: order.receipt,
            notes: order.notes,
        })

        const savedPayment = payment.save();

        // Send the order to the client
        return res.status(200).json({
            ...savedPayment.toJSON(), keyId: "YOUR_KEY_ID",
        })
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.post('/webhook', async (req, res) => {
    try {
        const webhookSignature = req.headers['X-Razorpay-Signature'];
        const isWebhookValid = validateWebhookSignature(req.body, webhookSignature, "YOUR_WEBHOOK_SECRET");

        if (!isWebhookValid) {
            return res.status(400).json({ msg: "Invalid webhook signature" });
        }

        // Update the payment in the database
        const paymentDetails = req.body.payload.payment.entity;
        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findById(payment.userId);

        if (req.body.event === "payment.captured") {

            user.isPremium = true;
            user.membershipType = payment.notes.membershipType;
            await user.save();
        }

        if (req.body.event === "payment.failed") {

        }

        return res.status(200).json({ msg: "Webhook received successfully" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.get('/verify', userAuth, async (req, res) => {
    const user = req.user.toJSON();
    if(user.isPremium) {
        return res.json({isPremium: true});
    }
    return res.json({isPremium: false});
})

module.exports = router;