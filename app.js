const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Conecta a la base de datos 'musica'
mongoose.connect('mongodb://127.0.0.1:27017/musica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define el modelo de canciones
const Song = mongoose.model('Song', {
  title: String,
  artist: String,
  genre: String
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta para la página de entrada de datos
app.get('/', (req, res) => {
  res.render('input');
});

// Ruta para manejar el formulario de entrada de datos
app.post('/add-song', (req, res) => {
  const { title, artist, genre } = req.body;
  const song = new Song({ title, artist, genre });

  song.save()
    .then(() => {
      res.redirect('/list-songs');
    })
    .catch(err => {
      console.error(err);
      res.send('Error al guardar la canción.');
    });
});

// Ruta para mostrar la lista de canciones almacenadas
app.get('/list-songs', (req, res) => {
  Song.find()
    .then(songs => {
      res.render('list', { songs });
    })
    .catch(err => {
      console.error(err);
      res.send('Error al recuperar las canciones.');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 3000');
});
