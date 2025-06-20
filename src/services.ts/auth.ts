import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User";
import { LoginInput } from "../validators/auth";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET not defined');

export const authenticateUser = async ({email, password}: LoginInput) => {
    const user = await User.findOne({email: email.toLowerCase()}).lean();
    if(!user || !user.password) throw new Error ("Invalid credentials");

    const isMatch = bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({userId: user.id, email: user.email}, JWT_SECRET, {expiresIn: '7d'});

    const userPayload = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar ?? null
    }

    return {token, user: userPayload}
}