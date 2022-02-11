'use strict';

//here we can manage token(decrypt it & validate ) and retrive email from it 
const checkAuthToken =async(ctx,next)=>{
    if("email" in ctx.request.headers){
        const userEmail = ctx.request.headers.email;
        if(!userEmail){
            ctx.throw(400,"Invalid email token");
        }
        ctx.state.user={email:userEmail};
    }
    return next();
}

module.exports = checkAuthToken;