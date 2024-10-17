const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('home', { superhero: null });
});

app.post('/superhero', async (req, res) => {
  const superheroId = req.body.id;
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`https://akabab.github.io/superhero-api/api/id/${superheroId}.json`);
    const superhero = await response.json();
    res.render('home', { superhero });
  } catch (error) {
    console.error('Error fetching superhero data:', error);
    res.render('home', { superhero: null });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
