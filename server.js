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
    const superheroName = req.body.name ? req.body.name.toLowerCase() : '';
    try {
      const response = await fetch('https://akabab.github.io/superhero-api/api/all.json');
      const superheroes = await response.json();
  
      // Filter superheroes by name (case-insensitive partial match)
      const matchedHeroes = superheroes.filter(hero =>
        hero.name.toLowerCase().includes(superheroName)
      );
  
      res.render('home', { superheroes: matchedHeroes });
    } catch (error) {
      console.error('Error fetching superhero data:', error);
      res.render('home', { superheroes: [] });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
