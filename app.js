const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, orgType, description, approved: false });
        await user.save();
        res.status(201).json({ message: 'User registered, awaiting approval' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        if (!user.approved) return res.status(400).json({ error: 'User not approved' });

        const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
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

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

app.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-login.html'));
});

app.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-dashboard.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
