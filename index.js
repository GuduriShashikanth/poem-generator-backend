// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 25 Haiku templates
const haikuTemplates = [
  `Write a {lines}-line haiku about {mood} using these words: {words}.`,
  `Create a {lines}-line haiku inspired by {mood} with the words: {words}.`,
  `Compose a {lines}-line haiku reflecting {mood} including: {words}.`,
  `Generate a {lines}-line haiku themed around {mood}, using: {words}.`,
  `Write a {lines}-line haiku expressing {mood} with these words: {words}.`,
  `Craft a {lines}-line haiku about {mood} incorporating these words: {words}.`,
  `Pen a {lines}-line haiku that captures {mood} using words: {words}.`,
  `Design a {lines}-line haiku expressing {mood} and including: {words}.`,
  `Create a {lines}-line haiku illustrating {mood} with the words: {words}.`,
  `Write a {lines}-line haiku depicting {mood} and weaving in: {words}.`,
  `Formulate a {lines}-line haiku about {mood} using the words: {words}.`,
  `Compose a {lines}-line haiku that conveys {mood} with these words: {words}.`,
  `Write a {lines}-line haiku inspired by {mood}, using: {words}.`,
  `Generate a {lines}-line haiku expressing {mood} while including: {words}.`,
  `Create a {lines}-line haiku capturing {mood} with words: {words}.`,
  `Design a {lines}-line haiku reflecting {mood}, incorporating: {words}.`,
  `Write a {lines}-line haiku portraying {mood} with these words: {words}.`,
  `Compose a {lines}-line haiku about {mood} weaving in: {words}.`,
  `Craft a {lines}-line haiku that embodies {mood} using words: {words}.`,
  `Generate a {lines}-line haiku evoking {mood} and including: {words}.`,
  `Write a {lines}-line haiku describing {mood} with these words: {words}.`,
  `Create a {lines}-line haiku that mirrors {mood} and uses: {words}.`,
  `Compose a {lines}-line haiku capturing the essence of {mood} with: {words}.`,
  `Write a {lines}-line haiku portraying {mood} and weaving in: {words}.`,
  `Generate a {lines}-line haiku reflecting {mood} and including these words: {words}.`
];

// 25 Free Verse templates
const freeVerseTemplates = [
  `Write a free verse poem about {mood} using these words: {words}.`,
  `Create a free verse poem inspired by {mood} with the words: {words}.`,
  `Compose a free verse poem reflecting {mood} including: {words}.`,
  `Generate a free verse poem themed around {mood}, using: {words}.`,
  `Write a free style poem expressing {mood} with these words: {words}.`,
  `Craft a free verse poem about {mood} incorporating these words: {words}.`,
  `Pen a free verse poem that captures {mood} using words: {words}.`,
  `Design a free style poem expressing {mood} and including: {words}.`,
  `Create a free verse poem illustrating {mood} with the words: {words}.`,
  `Write a free verse poem depicting {mood} and weaving in: {words}.`,
  `Formulate a free verse poem about {mood} using the words: {words}.`,
  `Compose a free verse poem that conveys {mood} with these words: {words}.`,
  `Write a free verse poem inspired by {mood}, using: {words}.`,
  `Generate a free verse poem expressing {mood} while including: {words}.`,
  `Create a free verse poem capturing {mood} with words: {words}.`,
  `Design a free verse poem reflecting {mood}, incorporating: {words}.`,
  `Write a free style poem portraying {mood} with these words: {words}.`,
  `Compose a free verse poem about {mood} weaving in: {words}.`,
  `Craft a free style poem that embodies {mood} using words: {words}.`,
  `Generate a free verse poem evoking {mood} and including: {words}.`,
  `Write a free verse poem describing {mood} with these words: {words}.`,
  `Create a free verse poem that mirrors {mood} and uses: {words}.`,
  `Compose a free style poem capturing the essence of {mood} with: {words}.`,
  `Write a free verse poem portraying {mood} and weaving in: {words}.`,
  `Generate a free verse poem reflecting {mood} and including these words: {words}.`
];

app.post('/generate-poem', async (req, res) => {
  const { mood, words, type, lines } = req.body;

  if (!mood || !words || !type) {
    return res.status(400).json({ error: "Please provide mood, words, and type of poem" });
  }

  try {
    const numLines = type === "haiku" ? (lines || 3) : null;

    // Pick a random template
    const templates = type === "haiku" ? haikuTemplates : freeVerseTemplates;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders with user input
    const prompt = randomTemplate
      .replace('{mood}', mood)
      .replace('{words}', words)
      .replace('{lines}', numLines);

    // Call Pollinations AI API
    const response = await axios.post(
      'https://text.pollinations.ai/openai',
      {
        model: "openai-large",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.POLLINATIONS_API_KEY}` // optional
        }
      }
    );

    const poem = response.data?.choices?.[0]?.message?.content || "No poem generated";
    res.json({ poem });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate poem" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
