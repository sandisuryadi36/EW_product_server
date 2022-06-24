const User = require("./model")

const update = async (req, res, next) => {
    try {
        const id = req.user._id
        const payload = req.body
        const user = await User.findByIdAndUpdate(id, payload, { new: true })
        res.json({
            error: false,
            message: "Profile successfully updated",
            data: user
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    update
}