const jwt = require('jsonwebtoken');

function getUserIdFromJWT(token) {
    try {
        console.log('form decodeJWT',token)
        // Verify the JWT token
        const splitToken = token.split(' ')[1]
        const decodedToken = jwt.verify(splitToken,process.env.JWT_SECRET)

        // Extract and return the user_id from the decoded token
        return decodedToken.id;
    } catch (error) {
        // Handle any errors (e.g., invalid token, expired token, etc.)
        console.error('Error decoding JWT token:', error.message);
        return null;
    }
}

module.exports = getUserIdFromJWT;