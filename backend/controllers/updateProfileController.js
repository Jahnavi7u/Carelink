const userModel = require("../database/models/userModel");
const doctorModel = require("../database/models/doctorModel");

const updateProfileController = async (req, res) => {
    try {
        const userId = req.body.userId;
        const updateData = { ...req.body };
        delete updateData.userId; // Don't update the userId field itself
        delete updateData.password; // Don't allow password change through this endpoint
        delete updateData.email; // Don't allow email change
        delete updateData.role; // Don't allow role change

        // Try to find user first, then doctor
        let user = userModel.findById(userId);
        if (user) {
            const updated = userModel.update(userId, updateData);
            return res.status(200).send({
                success: true,
                message: "Profile updated successfully",
                user: updated,
            });
        }

        let doctor = doctorModel.findById(userId);
        if (doctor) {
            const updated = doctorModel.update(userId, updateData);
            return res.status(200).send({
                success: true,
                message: "Profile updated successfully",
                user: updated,
            });
        }

        return res.status(404).send({
            success: false,
            message: "User not found",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error updating profile",
            error: error.message,
        });
    }
};

module.exports = updateProfileController;
