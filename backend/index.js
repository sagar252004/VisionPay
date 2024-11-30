import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import walletRoute from "./routes/wallet.route.js"
// import companyRoute from "./routes/company.route.js";
// import jobRoute from "./routes/job.route.js";
// import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// Middleware
app.use(cookieParser());

// Update CORS configuration to allow multiple origins
const corsOptions = {
    origin: 'http://localhost:5173', // Allowed origins
    credentials: true, // Allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
app.use(cors(corsOptions)); // Use CORS middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/v1/user", userRoute);
app.use('/api/v1/wallet', walletRoute);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});