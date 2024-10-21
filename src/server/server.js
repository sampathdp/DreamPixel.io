require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const AdmZip = require('adm-zip');
const mysql = require('mysql2');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security headers
app.use(morgan('combined')); // Logging

// Rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', apiLimiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure upload directories exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folderPath;

        if (file.mimetype.startsWith('image/')) {
            folderPath = path.join(__dirname, 'uploads/images');
        } else if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
            folderPath = path.join(__dirname, 'uploads/games');
        } else {
            return cb(new Error('Unsupported file format'), false);
        }

        ensureDirectoryExistence(folderPath);
        cb(null, folderPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype.startsWith('image/') ||
            file.mimetype === 'application/zip' ||
            file.mimetype === 'application/x-zip-compressed'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    }
});

// MySQL connection pool
const pool = mysql.createPool({
    host: "sql304.infinityfree.com",
    user: "if0_37557751",
    password: "Surage991028",
    database: "if0_37557751_DreamPixel"
});

// Function to insert a new game
const insertGame = (gameName, description, thumbnailUrl, gameUrl, categoryId, callback) => {
    pool.query(
        'INSERT INTO games (name, description, thumbnailUrl, gameUrl, category_id) VALUES (?, ?, ?, ?, ?)',
        [gameName, description, thumbnailUrl, gameUrl, categoryId],
        (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results.insertId);
        }
    );
};

// Route to handle game upload
app.post('/api/upload-game', upload.fields([{ name: 'thumbnail' }, { name: 'webglFolder' }]), [
    body('gameName').optional().notEmpty().withMessage('Game name should be a non-empty string'),
    body('description').optional().isString().withMessage('Description should be a string'),
    body('categoryId').optional().isInt().withMessage('Category ID must be a number')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }

        // Extract WebGL folder if provided
        if (req.files['webglFolder']) {
            const zipPath = req.files['webglFolder'][0].path;
            const extractPath = path.join(__dirname, 'uploads/games', path.basename(zipPath, path.extname(zipPath)));
            ensureDirectoryExistence(extractPath);
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            fs.unlinkSync(zipPath); // Remove the uploaded ZIP file after extraction
        }

        // Get game details from the request
        const gameName = req.body.gameName || 'Unknown Game';
        const description = req.body.description || 'No description provided';
        const thumbnailUrl = req.files['thumbnail'] ? `/uploads/images/${req.files['thumbnail'][0].filename}` : '';
        const gameUrl = req.files['webglFolder'] ? `/uploads/games/${path.basename(req.files['webglFolder'][0].path, path.extname(req.files['webglFolder'][0].path))}` : '';
        const categoryId = req.body.categoryId || null;

        // Insert game details into the database
        insertGame(gameName, description, thumbnailUrl, gameUrl, categoryId, (err, gameId) => {
            if (err) {
                console.error('Error inserting game into database:', err);
                return res.status(500).json({ message: 'Failed to save game details.' });
            }

            res.json({
                message: 'Game uploaded, extracted, and saved successfully!',
                files: req.files,
                gameId: gameId
            });
        });
    } catch (error) {
        console.error('Error uploading and extracting game:', error);
        res.status(500).json({ message: 'Failed to upload and extract game.' });
    }
});

// Route to add a new category
app.post('/api/add-category', [
    body('categoryName').notEmpty().withMessage('Category name is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const categoryName = req.body.categoryName;

    const insertCategory = (name, callback) => {
        pool.query('INSERT INTO categories (name) VALUES (?)', [name], (error, results) => {
            if (error) {
                return callback(error);
            }
            callback(null, results.insertId);
        });
    };

    insertCategory(categoryName, (err, categoryId) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to add category' });
        }

        res.json({ message: 'Category added successfully', categoryId });
    });
});

// Route to get all games
app.get('/api/games', (req, res) => {
    pool.query('SELECT * FROM games', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to retrieve games.' });
        }
        res.json({ games: results });
    });
});

// Route to get all categories
app.get('/api/categories', (req, res) => {
    pool.query('SELECT * FROM categories', (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to retrieve categories.' });
        }
        res.json({ categories: results });
    });
});

// Route to get games by category
app.get('/api/games/category/:categoryId', (req, res) => {
    const { categoryId } = req.params;

    pool.query('SELECT * FROM games WHERE category_id = ?', [categoryId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to retrieve games for the category.' });
        }
        res.json({ games: results });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
