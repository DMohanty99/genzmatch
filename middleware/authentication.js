const {createToken,validateToken} =require("../Service/auth")


function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName]
        if(!tokenCookieValue){
            return next();
        }

        try {
            const userPayload= validateToken(tokenCookieValue)
            req.user=userPayload
        }catch(e){

        }
        return next();
    }
}

module.exports={checkForAuthenticationCookie}