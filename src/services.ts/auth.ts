import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User";
import { LoginInput, registerInput, pseudonymousInput } from "../validators/auth";
import Session from '../models/Session';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET! || '1234567890qwerty';
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
};

export const registerUser = async ({email, password, nickname}: registerInput) => {
    const isExistingUser = await User.findOne({email: email.toLowerCase()}).lean();
    if(!isExistingUser) throw new Error("Email already in use")
     const hashedPassword = await bcrypt.hash(password, 12);
     const user = await User.create({
         email: email.toLowerCase(),
         password: hashedPassword,
         nickname: nickname.trim()
       })
    const token = jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {expiresIn: '7d'})

    return {token, user}
};

export const pseudonymousUser = async ({nickname} : pseudonymousInput) => {
    const isExistingGuestUser = await Session.findOne({nickname: nickname.toLowerCase()}).lean();
    if(isExistingGuestUser) throw new Error("Nickname already in use");
    const token = uuidv4();
    const guestUser = Session.create({
        nickname: nickname.trim()
    })

    return {token, guestUser}
}