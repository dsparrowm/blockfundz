import bcrypt from 'bcrypt';

const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}

export default comparePassword;
