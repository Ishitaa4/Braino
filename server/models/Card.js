const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' },
  front: String,
  back: String,
  easeFactor: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 },
  repetitions: { type: Number, default: 0 },
  nextReview: { type: Date, default: Date.now },
  mastered: { type: Boolean, default: false }
});

module.exports = mongoose.model('Card', CardSchema);