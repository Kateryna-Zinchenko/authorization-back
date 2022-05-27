import jwt from "jsonwebtoken";
import tokenModel from "../models/tokenModel.js";

class tokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SK, {expiresIn: '10s'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SK, {expiresIn: '30s'})
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SK);
            return userData;
        } catch (e) {
            return null
        }
    }
    
    validateRefreshToken (token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SK);
            return userData;
        } catch (e) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }
    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }
}

export default new tokenService();