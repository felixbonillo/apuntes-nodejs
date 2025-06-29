const express = require("express"); // Importa el módulo Express para crear el servidor
const movies = require("./movies.json"); // Carga el archivo JSON con las películas
const crypto = require("node:crypto"); // Importa el módulo crypto para generar identificadores únicos
const { validateMovie } = require("./schemas/movies"); // Importa la función de validación de películas

const app = express(); // Crea una instancia de la aplicación Express
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
app.disable("x-powered-by"); // Desactiva el encabezado "X-Powered-By" por seguridad

// Ruta raíz que responde con un mensaje de prueba
app.get("/", (req, res) => {
  res.json({ message: "Hola Mundo" }); // Responde con un objeto JSON
});

// Ruta para obtener todas las películas
app.get("/movies", (req, res) => {
  const { genre } = req.query; // Obtiene el parámetro de consulta "genre"

  if (genre) {
    // Filtra las películas por género si se proporciona el parámetro
    const filteredMovies = movies.filter(
      (movie) =>
        movie.genre.some( g => g.toLowerCase() === genre.toLowerCase()) // Compara ignorando mayúsculas/minúsculas
    );
    return res.json(filteredMovies); // Responde con las películas filtradas
  }

  res.json(movies); // Si no hay filtro, responde con todas las películas
});

// Ruta para obtener una película por su ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params; // Obtiene el parámetro de ruta "id"
  const movie = movies.find((movie) => movie.id === id); // Busca la película por su ID
  if (movie) return res.json(movie); // Si se encuentra, responde con la película

  res.status(404).json({ message: "Pelicula no encontrada" }); // Si no se encuentra, responde con un error 404
});

// Ruta para manejar la creación de nuevas películas
app.post("/movies", (req, res) => {
  // Validar los datos enviados en el cuerpo de la solicitud
  const result = validateMovie(req.body);

  // Si hay errores de validación, responder con un código de estado 400 (Bad Request)
  if (result.error) {
    return res.status(400).json({
      message: "Error de validación", // Mensaje genérico de error
      errors: JSON.parse(result.error.message), // Detalles específicos de los errores
    });
  }

  // Crear un nuevo objeto de película con un ID único y los datos validados
  const newMovie = {
    id: crypto.randomUUID(), // Generar un identificador único para la película
    ...result.data // Usar los datos validados
  };

  // Agregar la nueva película al arreglo en memoria
  movies.push(newMovie);

  // Responder con un código de estado 201 (Created) y la película creada
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params; // Obtiene el parámetro de ruta "id"
  const movieIndex = movies.findIndex((movie) => movie.id === id); // Busca el índice de la película por su ID

} // Ruta para manejar la actualización de una película existente


// Definir el puerto en el que el servidor escuchará (por defecto 1234 si no está definido en las variables de entorno)
const PORT = process.env.PORT || 1234;

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`); // Mensaje de confirmación en la consola
});

// Nota: Este enfoque no sigue los principios REST completamente,
// ya que el estado de la aplicación se guarda en memoria y no en una base de datos.
