const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/contact', (req, res) => {
  const { name, email, company, service, message } = req.body;
  console.log('Contact form submission:', { name, email, company, service, message });
  res.json({ success: true, message: 'Thank you. We will be in touch within 24 hours.' });
});

// Only start the HTTP server when run directly (local dev).
// Vercel imports this file as a module and uses the exported app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vertex Services running at http://localhost:${PORT}`);
  });
}

module.exports = app;
