const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Ruta GET inicial
app.get('/', (req, res) => {
  // Pasa un arreglo vacío en lugar de null
  res.render('home', { superheroes: [] });
});

// Ruta POST para buscar superhéroes
app.post('/superhero', async (req, res) => {
  const superheroName = req.body.name ? req.body.name.toLowerCase() : '';
  try {
    const response = await fetch('https://akabab.github.io/superhero-api/api/all.json');
    const superheroes = await response.json();

    // Filtra los superhéroes que coinciden con la búsqueda
    const matchedHeroes = superheroes.filter(hero =>
      hero.name.toLowerCase().includes(superheroName)
    );

    // Renderiza la vista con los superhéroes encontrados
    res.render('home', { superheroes: matchedHeroes });
  } catch (error) {
    console.error('Error fetching superhero data:', error);
    res.render('home', { superheroes: [] });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
