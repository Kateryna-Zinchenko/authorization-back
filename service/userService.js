import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import tokenService from "./tokenService.js";
import UserDto from "../dtos/userDto.js";

class userService {
    async signup(email, password) {
        const candidate = await userModel.findOne({email})
        if (candidate) {
            throw new Error(`User with email ${email} already exist`)
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await userModel.create({email, password: hashPassword});

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async login(email, password) {
        const user = await userModel.findOne({email})
        if (!user) {
            throw new Error("User with this email doesn't exist")
        }
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            throw new Error("Invalid password")
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if(!refreshToken) {
            throw new Error('Unauthorized error')
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const dbToken = tokenService.findToken(refreshToken);
        if (!userData || !dbToken) {
            throw new Error('Unauthorized error')
        }
        const user = await userModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const users = await userModel.find()
        return users;

    }
}

export default new userService();