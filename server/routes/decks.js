const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const Deck = require('../models/Deck');
  
const Card = require('../models/Card');

const upload = multer({ storage: multer.memoryStorage() });
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });


router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.slice(0, 8000);

    const message = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `You are an expert teacher creating flashcards. Read the following text and generate 20 high-quality flashcards.

Rules:
- Cover key concepts, definitions, relationships, and examples
- Questions should test understanding, not just memorization
- Keep answers concise but complete
- Return ONLY a JSON array, no extra text, no markdown
-- Include at least 2 definition cards, 2 relationship cards, 2 example-based cards
Format:
[{"front": "question here", "back": "answer here"}]

Text:
${text}`
      }]
    });

    const raw = message.choices[0].message.content;
    const cards = JSON.parse(raw);

    const deck = await Deck.create({
      title: req.file.originalname.replace('.pdf', ''),
      sourceFile: req.file.originalname
    });

    const cardDocs = cards.map(c => ({ ...c, deckId: deck._id }));
    await Card.insertMany(cardDocs);

    res.json({ deck, cardCount: cards.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
r
router.get('/', async (req, res) => {
  const decks = await Deck.find().sort({ createdAt: -1 });
  res.json(decks);
});


router.get('/:deckId/cards', async (req, res) => {
  const cards = await Card.find({ deckId: req.params.deckId });
  res.json(cards);
});


router.get('/:deckId/due', async (req, res) => {
  const cards = await Card.find({
    deckId: req.params.deckId,
    nextReview: { $lte: new Date() }
  });
  res.json(cards);
});
outer.patch('/cards/:cardId/review', async (req, res) => {
  const { rating } = req.body;
  const card = await Card.findById(req.params.cardId);

  let { easeFactor, interval, repetitions } = card;

  if (rating < 2) {
    repetitions = 0;
    interval = 1;
    repetitions++;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  }

  easeFactor = Math.max(1.3, easeFactor + 0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02));

  const nextReview = new Date();
 nextReview.setSeconds(nextReview.getSeconds() + 5);
  const mastered = repetitions >= 2 && rating >= 2;

  const updated = await Card.findByIdAndUpdate(req.params.cardId, {
    easeFactor, interval, repetitions, nextReview, mastered
  }, { new: true });

  res.json(updated);
});

router.delete('/:deckId', async (req, res) => {
  await Card.deleteMany({ deckId: req.params.deckId })
  await Deck.findByIdAndDelete(req.params.deckId)
  res.json({ message: 'Deleted' })
})

module.exports = router;