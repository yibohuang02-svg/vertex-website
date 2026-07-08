const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache-busts /css and /js asset URLs so every deploy is immediately fresh
// for visitors, instead of waiting on browser cache heuristics to expire.
const BUILD_VERSION = Date.now();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Tab "pages" are all rendered from the same template — the client-side
// tab switcher reads the path to decide which panel to show.
app.get(['/', '/services', '/coverage', '/career', '/contact'], (req, res) => {
  res.render('index', { buildVersion: BUILD_VERSION });
});

// Only start the HTTP server when run directly (local dev).
// Vercel imports this file as a module and uses the exported app.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Vertex Service running at http://localhost:${PORT}`);
  });
}

module.exports = app;
