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
  `Write a {lines}-lines haiku about {mood} using these words: {words}.`,
  `Create a {lines}-lines haiku inspired by {mood} with the words: {words}.`,
  `Compose a {lines}-lines haiku reflecting {mood} including: {words}.`,
  `Generate a {lines}-lines haiku themed around {mood}, using: {words}.`,
  `Write a {lines}-lines haiku expressing {mood} with these words: {words}.`,
  `Craft a {lines}-lines haiku about {mood} incorporating these words: {words}.`,
  `Pen a {lines}-lines haiku that captures {mood} using words: {words}.`,
  `Design a {lines}-lines haiku expressing {mood} and including: {words}.`,
  `Create a {lines}-lines haiku illustrating {mood} with the words: {words}.`,
  `Write a {lines}-lines haiku depicting {mood} and weaving in: {words}.`,
  `Formulate a {lines}-lines haiku about {mood} using the words: {words}.`,
  `Compose a {lines}-lines haiku that conveys {mood} with these words: {words}.`,
  `Write a {lines}-lines haiku inspired by {mood}, using: {words}.`,
  `Generate a {lines}-lines haiku expressing {mood} while including: {words}.`,
  `Create a {lines}-lines haiku capturing {mood} with words: {words}.`,
  `Design a {lines}-lines haiku reflecting {mood}, incorporating: {words}.`,
  `Write a {lines}-lines haiku portraying {mood} with these words: {words}.`,
  `Compose a {lines}-lines haiku about {mood} weaving in: {words}.`,
  `Craft a {lines}-lines haiku that embodies {mood} using words: {words}.`,
  `Generate a {lines}-lines haiku evoking {mood} and including: {words}.`,
  `Write a {lines}-lines haiku describing {mood} with these words: {words}.`,
  `Create a {lines}-lines haiku that mirrors {mood} and uses: {words}.`,
  `Compose a {lines}-lines haiku capturing the essence of {mood} with: {words}.`,
  `Write a {lines}-lines haiku portraying {mood} and weaving in: {words}.`,
  `Generate a {lines}-lines haiku reflecting {mood} and including these words: {words}.`
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
    console.log('Request received:', { mood, words, type, lines });
    console.log('Groq API Key loaded:', !!process.env.GROQ_API_KEY);
    
    const numLines = type === "haiku" ? (lines || 3) : null;

    // Pick a random template
    const templates = type === "haiku" ? haikuTemplates : freeVerseTemplates;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Replace placeholders with user input
    const prompt = randomTemplate
      .replace('{mood}', mood)
      .replace('{words}', words)
      .replace('{lines}', numLines);

    console.log('Prompt:', prompt);

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('Groq API response received');
    const poem = response.data?.choices?.[0]?.message?.content || "No poem generated";
    res.json({ poem });

  } catch (error) {
    console.error('❌ ERROR Details:');
    console.error('Message:', error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    res.status(500).json({ 
      error: "Failed to generate poem",
      details: error.response?.data?.error?.message || error.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
