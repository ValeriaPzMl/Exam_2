const express = require('express');
const https = require('https'); // Importamos el módulo https de Node.js
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// Ruta GET inicial que muestra todos los superhéroes
app.get('/', (req, res) => {
  const url = 'https://akabab.github.io/superhero-api/api/all.json';

  // Realizamos la solicitud GET usando el módulo https
  https.get(url, (response) => {
    let data = '';


    // Recibimos los datos por fragmentos
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Una vez que se ha recibido toda la respuesta, procesamos los datos
    response.on('end', () => {
      try {
        const superheroes = JSON.parse(data);
        res.render('home', { superheroes });
      } catch (error) {
        res.render('home', { superheroes: [] });
      }
    });
  }).on('error', (error) => {
    console.error('Error al realizar la solicitud HTTPS:', error);
    res.render('home', { superheroes: [] });
  });
});

// Ruta POST para buscar superhéroes
app.post('/superhero', (req, res) => {
  const superheroName = req.body.name ? req.body.name.toLowerCase() : '';
  const url = 'https://akabab.github.io/superhero-api/api/all.json';

  // Realizamos la solicitud GET usando el módulo https
  https.get(url, (response) => {
    let data = '';

    // Verifica si la respuesta fue exitosa
    if (response.statusCode !== 200) {
      console.error(`Error: Failed to fetch data. Status Code: ${response.statusCode}`);
      res.render('home', { superheroes: [] });
      return;
    }

    // Recibimos los datos por fragmentos
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Una vez que se ha recibido toda la respuesta, procesamos los datos
    response.on('end', () => {
      try {
        const superheroes = JSON.parse(data);

        // Filtra los superhéroes que coinciden con la búsqueda
        const matchedHeroes = superheroes.filter(hero =>
          hero.name.toLowerCase().includes(superheroName)
        );

        res.render('home', { superheroes: matchedHeroes });
      } catch (error) {
        console.error('Error al analizar los datos de los superhéroes:', error);
        res.render('home', { superheroes: [] });
      }
    });
  }).on('error', (error) => {
    console.error('Error al realizar la solicitud HTTPS:', error);
    res.render('home', { superheroes: [] });
  });
});

// Ruta GET para mostrar el perfil detallado de un superhéroe específico por nombre
app.get('/superhero/:id', (req, res) => {
  const superheroId = parseInt(req.params.id); // Asegúrate de que es un número
  const url = 'https://akabab.github.io/superhero-api/api/all.json';

  https.get(url, (response) => {
    let data = '';

    if (response.statusCode !== 200) {
      console.error(`Error: Failed to fetch data. Status Code: ${response.statusCode}`);
      res.render('stats', { superhero: null });
      return;
    }

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        const superheroes = JSON.parse(data);

        // Encuentra el superhéroe actual
        const superhero = superheroes.find(hero => hero.id === superheroId);
        const currentIndex = superheroes.findIndex(hero => hero.id === superheroId);

        // Calcula el índice del héroe anterior y siguiente de forma cíclica
        const previousHero = superheroes[(currentIndex - 1 + superheroes.length) % superheroes.length];
        const nextHero = superheroes[(currentIndex + 1) % superheroes.length];

        if (superhero) {
          res.render('stats', { superhero, previousHero, nextHero });
        } else {
          res.render('stats', { superhero: null });
        }
      } catch (error) {
        console.error('Error al analizar los datos de los superhéroes:', error);
        res.render('stats', { superhero: null });
      }
    });
  }).on('error', (error) => {
    console.error('Error al realizar la solicitud HTTPS:', error);
    res.render('stats', { superhero: null });
  });
});




// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
