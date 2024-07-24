const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoints CRUD
app.get('/employees', async (req, res) => {//tabela employees
    try {
        const result = await db.query('SELECT * FROM employees');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/employees', async (req, res) => {
    const { name, email, position } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO employees (name, email, position) VALUES ($1, $2, $3) RETURNING *',
            [name, email, position]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, position } = req.body;
    try {
        const result = await db.query(
            'UPDATE employees SET name = $1, email = $2, position = $3 WHERE id = $4 RETURNING *',
            [name, email, position, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM employees WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
