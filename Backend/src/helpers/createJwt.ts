import jwt from 'jsonwebtoken';


interface Payload {
    id: number;
    email: string;
}

interface Response {
    cookie: (name: string, value: string, options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'strict';
        maxAge: number;
    }) => void;
}

const createJWT = (res: Response, payload: Payload) => {
    const token = jwt.sign({ id: payload.id, email: payload.email }, process.env.JWT_SECRET as string, {
        expiresIn: '1d'
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400 * 1000, // 1 day in milliseconds
    });

    return token;
}

export default createJWT;