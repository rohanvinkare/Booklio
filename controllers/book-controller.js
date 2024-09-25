const mongoose = require('mongoose');

const Adventure = require('../models/adventure-model');
const Biography = require('../models/biography-model');
const Children = require('../models/children-model');
const Fable = require('../models/fable-model');
const Fantasy = require('../models/fantasy-model');
const Fiction = require('../models/fiction-model');
const General = require('../models/general-model')
const History = require('../models/history-model');
const Horror = require('../models/horror-model');
const Mystery = require('../models/mystery-model');
const Nonfiction = require('../models/nonfiction-model');
const Poetry = require('../models/poetry-model');
const Romance = require('../models/romance-model');
const Satire = require('../models/satire-model');
const Sciencefiction = require('../models/sciencefiction-model');
const Thriller = require('../models/thriller-model');
const Travel = require('../models/travel-model');

const modelMap = {
    adventure: Adventure,
    biography: Biography,
    children: Children,
    fable: Fable,
    fantasy: Fantasy,
    fiction: Fiction,
    general: General,
    history: History,
    horror: Horror,
    mystery: Mystery,
    nonfiction: Nonfiction,
    poetry: Poetry,
    romance: Romance,
    satire: Satire,
    sciencefiction: Sciencefiction,
    thriller: Thriller,
    travel: Travel
};

const booksSearch = async (req, res) => {
    const genre = req.params.genre && modelMap[req.params.genre.toLowerCase()] ? req.params.genre.toLowerCase() : 'general';
    const Model = modelMap[genre];

    console.log(Model)

    if (!Model) {
        return res.status(404).json({
            success: false,
            msg: `Genre "${genre}" not found`,
        });
    }

    try {
        const books = await Model.find({});

        return res.status(200).json({
            success: true,
            data: books
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || 'An error occurred',
        });
    }
};

const getBookData = async (req, res) => {

    const key = req.params.key;
    const url = `https://openlibrary.org/works/${key}.json`;
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();

        return res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: error.message || 'An error occurred',
        });
    }
}

module.exports = {
    booksSearch,
    getBookData
};