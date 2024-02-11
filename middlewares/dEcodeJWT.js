const jwt = require('jsonwebtoken')

module.exports = async (token,next) => {
  try {
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
        const userId = decodedToken.user_id;
        return userId;
  }catch(err) {
    console.error("Error decoding JWT:", error.message);
        return null;
  }

}