<<<<<<< HEAD
// import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";

export const register = async(req, res) => {
    try {
        const { name, email, password} = req.body;

        console.log(name, email, password);

        // Check if any required field is missing
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Required All Fileds",
=======
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Log incoming data
        console.log("Incoming Data:", { name, email, password });

        // Validate fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required.",
>>>>>>> 50dd188 (Initial commit)
                success: false,
            });
        }

<<<<<<< HEAD

        // let profilePhotoUrl = null;
        // const file = req.file;
        // if (file) {
        //     const fileUri = getDataUri(file);
        //     const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        //     profilePhotoUrl = cloudResponse.secure_url;
        // }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
=======
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
>>>>>>> 50dd188 (Initial commit)
                success: false,
            });
        }

<<<<<<< HEAD
        const hashedPassword = await bcrypt.hash(password, 10);

=======
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
>>>>>>> 50dd188 (Initial commit)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
<<<<<<< HEAD
           
            // profile: {
            //     profilePhoto: profilePhotoUrl,
            // },
        });

=======
        });

        console.log("user", newUser);

        // Python Backend Communication
        let pythonResponseData = { message: "Failed to communicate with Python backend.", success: false };
        try {
            const pythonResponse = await fetch("http://localhost:5000/start-capture", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: newUser._id.toString() }),
            });

            if (pythonResponse.ok) {
                pythonResponseData = await pythonResponse.json();
            } else {
                throw new Error("Python backend returned an error.");
            }
        } catch (error) {
            console.error("Python Backend Error:", error.message);
        }

        // Final Response
>>>>>>> 50dd188 (Initial commit)
        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email,
<<<<<<< HEAD
                phoneNumber: newUser.phoneNumber,
                
                // profilePhoto: newUser.profile.profilePhoto,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
            error: error.message,
            false: error
=======
                id: newUser._id,
            },
            pythonResponse: pythonResponseData,
        });
    } catch (error) {
        console.error("Register Error:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
>>>>>>> 50dd188 (Initial commit)
        });
    }
};

<<<<<<< HEAD
export const login = async(req, res) => {
    try {
        console.log("Request body received:", req.body);

        const { email, password } = req.body;

        if (!email || !password ) {
            console.log("Validation failed: Missing fields");
            return res.status(400).json({
                message: "Something is missing",
=======
// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required.",
>>>>>>> 50dd188 (Initial commit)
                success: false,
            });
        }

<<<<<<< HEAD
        console.log("Checking user existence");
        let user = await User.findOne({ email });
        if (!user) {
            console.log("User not found for email:", email);
=======
        // Check user existence
        const user = await User.findOne({ email });
        if (!user) {
>>>>>>> 50dd188 (Initial commit)
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

<<<<<<< HEAD
        console.log("Comparing passwords");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log("Password mismatch for email:", email);
=======
        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
>>>>>>> 50dd188 (Initial commit)
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

<<<<<<< HEAD
        console.log("Checking user role");

        console.log("Generating JWT");
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        console.log("Returning success response");
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'None', 
=======
        // Generate JWT
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Set cookie and respond
        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "None",
>>>>>>> 50dd188 (Initial commit)
                secure: true,
            })
            .json({
                message: `Welcome back ${user.name}`,
                user,
                success: true,
            });
    } catch (error) {
<<<<<<< HEAD
        console.error("Error in login route:", {
            message: error.message,
            stack: error.stack,
        });

        // Send detailed error in response
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message, // Add error details here
            success: false,
=======
        console.error("Login Error:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message,
>>>>>>> 50dd188 (Initial commit)
        });
    }
};

<<<<<<< HEAD
export const logout = async(req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
=======
// Logout Controller
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};
>>>>>>> 50dd188 (Initial commit)
