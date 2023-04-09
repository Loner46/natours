const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../Models/tourModel');
const User = require('./../../Models/userModel');
const Review = require('./../../Models/reviewModel');

dotenv.config({ path: './starter/config.env' });

const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('Db connected successfully!'))

// READ JSAON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

// DELETE ALL DATA FROM BD
const deleteData = async() => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data delete successfully!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

// IMPORT DATA TO DB
const importData = async() => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data loaded successfully!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
}

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
} else if (process.argv[2] === '--delete_import') {
    deleteData();
    importData();
}

console.log(process.argv);