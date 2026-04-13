const mongoose = require('mongoose');

const DeckSchema = new mongoose.Schema({
  title: String,
  sourceFile: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deck', DeckSchema);