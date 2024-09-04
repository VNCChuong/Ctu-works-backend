const DiscountService = require('../services/DiscountServvice')
const Discount = require("../models/DiscountModel")
const Product = require("../models/ProductModel")

const createDiscount = async (req, res) => {
    try {
        const { discount, startAt, endAt, description } = req.body
        if (!discount || !startAt || !endAt || !description) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await DiscountService.createDiscount(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllDiscountDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await DiscountService.getAllDiscountDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsDiscount = async (req, res) => {
    try {
        const discountId = req.params.id
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await DiscountService.getDiscountDetails(discountId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const deleteDiscount = async (req, res) => {
    try {
        const discountId = req.params.id
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            })
        }
        const response = await DiscountService.deleteDiscount(discountId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const getAllDiscount = async (req, res) => {
    try {
        const data = await DiscountService.getAllDiscount()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const deleteManyDiscount = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await DiscountService.deleteManyDiscount(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const updateDiscount = async (req, res) => {
    try {
        const discountId = req.params.id
        const data = req.body
        if (!discountId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The discountId is required'
            })
        }
        const response = await DiscountService.updateDiscount(discountId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
const checkStatusDiscount = async (req, res) => {
    try {
        const data = await DiscountService.checkStatusDiscount()
        const today = new Date();
        data?.data?.map(async (item) => {
            const endDay = new Date(item.endAt)
            if (endDay < today && item.status == true) {
                item.discountItems.map(async (item1) => {
                    await Product.findByIdAndUpdate(
                        {
                            _id: item1,
                        },
                        { $set: { discount: 0 } },
                        { new: true }
                    )
                })
                await Discount.findByIdAndUpdate(
                    {
                        _id: item._id,
                    },
                    { $set: { status: false, discountItems: [] } },
                    { new: true }
                )
            }
        })
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}
module.exports = {
    createDiscount,
    updateDiscount,
    getAllDiscountDetails,
    getDetailsDiscount,
    deleteDiscount,
    getAllDiscount,
    deleteManyDiscount,
    checkStatusDiscount
}