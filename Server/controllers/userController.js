const User = require("../model/userModel");
const brcypt = require("bcrypt");

module.exports.register = async(req, res, next) => {
    try {
        const { Username, Email_ID, Password } = req.body;
        const UsernameCheck = await User.findOne({ Username });
        if (UsernameCheck)
            return res.json({ msg: "User already used", status: false });
        const emailCheck = await User.findOne({ Email_ID });
        if (emailCheck)
            return res.json({ msg: "Email already used", status: false });
        const hashedPassword = await brcypt.hash(Password, 10);
        const user = await User.create({
            Email_ID,
            Username,
            Password: hashedPassword,
        });
        delete user.Password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async(req, res, next) => {
    try {
        const { Username, Password } = req.body;
        const user = await User.findOne({ Username });
        if (!user)
            return res.json({ msg: "Incorrect Username or Password", status: false });
        const isPasswordValid = await brcypt.compare(Password, user.Password)
        if (!isPasswordValid)
            return res.json({ msg: "Incorrect Username or Password", status: false });
        delete user.Password;
        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.setAvatar = async(req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async(req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};