require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminComboRouter = require("./routes/admin/combo-routes");
const adminUserRouter = require("./routes/admin/user-routes");
const adminRatingRouter = require("./routes/admin/rating.routes");
const adminRevenueRouter = require("./routes/admin/revenue-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
.connect("mongodb+srv://nguyenquanghaidang2311:Dangdeptrai2311@food-ordering-managemen.2osml.mongodb.net/?retryWrites=true&w=majority&appName=food-ordering-management")
    // .connect("mongodb+srv://trankhanhhgvt:rwRKpbZCWCuot4pN@cluster0.ssefj.mongodb.net/")
    

    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log(error));

const app = express();
const PORT = 5000; //process.env.PORT || 5000;

// Middleware để log các request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/combo", adminComboRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/admin/ratings", adminRatingRouter);
app.use("/api/admin/revenue", adminRevenueRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));