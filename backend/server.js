const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).send("Unauthorized: Invalid token");
    }
};

app.post('/api/save-user-data', verifyToken, (req, res) => {
    console.log("------------------------------------------------");
    console.log("🚀 NEW USER ACTIVITY DETECTED");
    console.log("📧 Email:", req.body.email);
    console.log("👤 Username:", req.body.username);
    console.log("------------------------------------------------");

    res.json({ message: "Backend received user data successfully" });
});

app.listen(5000, () => console.log("🚀 Server running on my server"));