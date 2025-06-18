import express from 'express';
const app = express();
const PORT = 5000;

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => console.log(`Test server running on http://localhost:${PORT}`));
