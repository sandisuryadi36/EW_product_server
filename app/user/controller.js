const User = require("./model")

const update = async (req, res, next) => {
    try {
        const id = req.user._id
        const payload = req.body
        const user = await User.findOneAndUpdate({_id: id}, payload, { new: true, runValidators: true })
        res.json({
            error: false,
            message: "Profile successfully updated",
            data: user
        })
    } catch (err) {
        if (err && err.name === "ValidationError") {
            return res.json({
                error: true,
                message: err.message,
                fields: err.errors
            })
        }
        next(err)
    }
}

module.exports = {
    update
}