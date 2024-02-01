const bcrypt = require("bcryptjs");
const db = require("../models/db");

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, confirmPassword, email } = req.body;
    //validation
    if (!username && password && confirmPassword) {
      return next(new Error("Fulfill all input"));
    }
    if (confirmPassword !== password) {
      throw new Error("confirmPassword not match");
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    const data = {
      username,
      password: hashedPassword,
      email,
    };
    const rs = await db.user.create({ data });
    console.log(rs);
    // db.user.create({ data });
res.json({msg: ' Register successful'})
    // res.send("in Register...");
  } catch (err) {
    next(err);
  }
};
module.exports.login = (req, res, next) => {
  res.send("in Login...");
};
