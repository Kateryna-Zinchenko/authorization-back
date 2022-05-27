import tokenService from "../service/tokenService.js";

const authMiddleware = (req, res, next) => {
    try {
       const authorizationHeader = req.headers.authorization;
       if(!authorizationHeader) {
           return res.status(401).json({message: 'Unauthorized user'});
       }

       const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({message: 'Access Token error'});
        }

        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return res.status(401).json({message: 'Access Token error'});
        }

        req.user = userData;
        next();
    }
    catch (e) {
        return res.status(401).json({message: `${e}`})
    }
}
export default authMiddleware;
