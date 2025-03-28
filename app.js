const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const ejs = require('ejs');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

const guestSchema = new mongoose.Schema({
    firstName: String,
});

const Pridu = mongoose.model('pridu', guestSchema);
const NePridu = mongoose.model('nepridu', guestSchema);

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/rsvp', async (req, res) => {
    try {
        const { firstName, status} = req.body;
        
        if (!firstName) {
            return res.status(400).send('Имя и фамилия обязательны');
        }

        const rsvpData = { firstName };

        if (status === 'pridu') {
            await new Pridu(rsvpData).save();
        } else if (status === 'nepridu') {
            await new NePridu(rsvpData).save();
        } else {
            return res.status(400).send('Неверный статус');
        }

        res.status(201).send('Подтверждено!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при сохранении RSVP');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
