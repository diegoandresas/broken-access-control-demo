const express = require('express');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'demo_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('User not found');
        }
    });
});

app.put('/profile/:id', (req, res) => {
    const userId = req.params.id;
    const authenticatedUserId = req.header('user-id');

    if (userId !== authenticatedUserId) {
        return res.status(403).send('Forbidden: You are not allowed to update this profile');
    }

    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';

    db.query(query, [name, email, userId], (err, result) => {
        if (err) throw err;
        res.send('User updated successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
