const mongoose = require("mongoose");

const mysterySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    AuthorName: { type: String, default: 'Anonymous' },
    AuthorImageOLID: { type: String, default: 'NA' },
    BookTitle: { type: String, required: true },
    BookCoverPage: { type: String, default: 'NA' },
    BookDescription: { type: String, default: 'NA' },
    Genre: { type: String, default: 'mystery' },
    Star: { type: Number, default: 'NA' },
    TotalRatings: { type: Number, default: 0 },
    Ratings1: { type: Number, default: 0 },
    Ratings2: { type: Number, default: 0 },
    Ratings3: { type: Number, default: 0 },
    Ratings4: { type: Number, default: 0 },
    Ratings5: { type: Number, default: 0 },
    ISBN: { type: String, default: 'NA', unique: true }
});

module.exports = mongoose.model("Mystery", mysterySchema);
