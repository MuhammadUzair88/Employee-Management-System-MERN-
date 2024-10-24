import User from "../models/User.js";
import Jwt from 'jsonwebtoken';

const verifyUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(404).json({ success: false, error: "Token Not Provided" });
        }

        const decoded = Jwt.verify(token, process.env.JWT_KEY);
        if (!decoded) {
            return res.status(404).json({ success: false, error: "Token Not valid" });
        }

        const user = await User.findById(decoded._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: "User Not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ success: false, error: "Server Side Error" });
    }
};

export default verifyUser;