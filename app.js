const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/political-innovation', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    orgType: { type: String, required: true },
    description: { type: String, required: true },
    approved: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

// Register user
app.post('/api/register', async (req, res) => {
    const { username, password, orgType, description } = req.body;
    try {
        const user = new User({ username, password, orgType, description });
        await user.save();
        res.status(201).json({ message: 'User registered, awaiting approval' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Get pending applications
app.get('/api/admin/pending', async (req, res) => {
    try {
        const users = await User.find({ approved: false });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending users' });
    }
});

// Approve user
app.post('/api/admin/approve', async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findById(userId);
        user.approved = true;
        await user.save();
        res.json({ message: 'User approved' });
    } catch (error) {
        res.status(500).json({ error: 'Approval failed' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
