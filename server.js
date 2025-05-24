const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();

app.use(express.json());

// YouTube Download Endpoint
app.post('/download/youtube', async (req, res) => {
  const { url } = req.body;
  try {
    if (ytdl.validateURL(url)) {
      const info = await ytdl.getInfo(url);
      const downloadUrl = ytdl.chooseFormat(info.formats, { quality: 'highest' }).url;
      res.json({ downloadUrl });
    } else {
      res.json({ error: 'Invalid YouTube URL' });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

// Social Media Download Endpoint (Facebook, Instagram, TikTok)
app.post('/download/social', async (req, res) => {
  const { url } = req.body;
  try {
    // Example: Use a third-party API like SnapSave
    const response = await axios.post('https://snapsave.app/action.php', { url });
    res.json({ downloadUrl: response.data.download_url });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));