const z = require("zod"); // Zod para validaciones

const movieSchema = z.object({
  title: z
    .string({
      required_error: "El título es requerido",
      invalid_type_error: "El título debe ser una cadena de texto",
    })
    .min(1, "El título es requerido"),
  year: z.number().int().min(1888, "El año debe ser un número válido"),
  director: z.string().min(1, "El director es requerido"),
  duration: z.number().int().positive(),
  poster: z.string().url({
    message: "La URL del poster debe ser válida",
  }),
  genre: z
    .string()
    .toLowerCase()
    .pipe(
      z.enum(["action", "comedy", "drama", "horror", "sci-fi", "romance"]),
      {
        required_error: "El género es requerido",
        invalid_type_error: "El género debe ser una cadena de texto",
      }
    ),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie (object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = { validateMovie, validatePartialMovie };
