import jwt from 'jsonwebtoken';


const createJWT = (payload) => {
    const token = jwt.sign({id: payload.id, email: payload.email}, process.env.JWT_SECRET);
    return token;
}

export default createJWT;