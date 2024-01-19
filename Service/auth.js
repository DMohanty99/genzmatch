const jwt= require("jsonwebtoken")

const secretKey="mysecret@123"

function createToken(user){
    const payload={
        _id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        age:user.age,
        email:user.email,
        profileImageUrl:user.profileImageUrl,
        role:user.role
    }
    const token =jwt.sign(payload,secretKey);
    return token;
}

function validateToken(token){
    const payload=jwt.verify(token,secretKey);
    return payload;
}

module.exports={createToken,validateToken};