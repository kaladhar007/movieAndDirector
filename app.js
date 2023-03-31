const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at https//localhost:3000");
    });
  } catch (e) {
    console.log(`DBError:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//functons:
function snakeToCamel(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => snakeToCamel(item));
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );

    const value = obj[key];
    acc[camelKey] = snakeToCamel(value);

    return acc;
  }, {});
}
`
### API 1

#### Path: /movies/

#### Method: GET

#### Description:

Returns a list of all movie names in the movie table

#### Response

[
  {
    movieName: "Captain America: The First Avenger",
  },

  ...
]
`;
app.get("/movies/", async (request, response) => {
  const allMoviesQuery = `select movie_name from movie;`;
  const movieArray = await db.all(allMoviesQuery);
  console.log(movieArray);
  response.send(snakeToCamel(movieArray));
});
// `### API 2

// #### Path: /movies/

// #### Method: POST

// #### Description:

// Creates a new movie in the movie table. 'movie_id' is auto-incremented

// #### Request

// {
//   "directorId": 6,
//   "movieName": "Jurassic Park",
//   "leadActor": "Jeff Goldblum"
// }

// #### Response

// Movie Successfully Added`;
app.post("/movies/", async (request, response) => {
  const movie_details = request.body;
  console.log(movie_details);
  const { directorId, movieName, leadActor } = movie_details;
  const addMovieQuery = `INSERT INTO movie(director_id,movie_name,lead_actor) 
  values(${directorId},'${movieName}','${leadActor}');`;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});
// `### API 3

// #### Path: /movies/:movieId/

// #### Method: GET

// #### Description:

// Returns a movie based on the movie ID

// #### Response

// {
//   movieId: 12,
//   directorId: 3,
//   movieName: "The Lord of the Rings",
//   leadActor: "Elijah Wood",
// }
// `;
app.get("/movies/:movieId/", async (request, response) => {
  const idObj = request.body;
  const { movieId } = request.params;
  console.log(movieId);
  const getIdDetailsQuery = `SELECT * FROM 
                                    movie WHERE movie_id=${movieId};`;
  const dbResponse = await db.get(getIdDetailsQuery);
  response.send(snakeToCamel(dbResponse));
});
// `### API 4

// #### Path: /movies/:movieId/

// #### Method: PUT
// #### Description:

// Updates the details of a movie in the movie table based on the movie ID

// #### Request

// {
//   "directorId": 24,
//   "movieName": "Thor",
//   "leadActor": "Christopher Hemsworth"
// }

// #### Response

// Movie Details Updated

// `;
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const putQuery = `UPDATE movie 
                            SET 
                                director_id= ${directorId}, 
                                movie_name='${movieName}', 
                                lead_actor= '${leadActor}' 
                            WHERE 
                              movie_id=${movieId};`;

  const dbResponse = await db.run(putQuery);
  response.send("Movie Details Updated");
});
// `### API 5

// #### Path: /movies/:movieId/

// #### Method: DELETE
// #### Description:

// Deletes a movie from the movie table based on the movie ID

// #### Response

// Movie Removed
// `;
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM movie WHERE movie_id=${movieId};`;
  const dbResponse = await db.run(deleteQuery);
  response.send("Movie Removed");
});
// `### API 6

// #### Path: /directors/

// #### Method: GET
// #### Description:

// Returns a list of all directors in the director table

// #### Response

// [
//   {
//     directorId: 1,
//     directorName: "Joe Johnston",
//   },

//   ...
// ]
// `;
app.get("/directors/", async (request, response) => {
  const { directorId, directorName } = request.body;
  const getAllQuery = `select director_id as directorId, director_name as directorName from director;`;
  const dbResponse = await db.all(getAllQuery);
  response.send(dbResponse);
});
//### API 7

// #### Path: /directors/:directorId/movies/

// #### Method: GET
// #### Description:

// Returns a list of all movie names directed by a specific director

// #### Response

// [
//   {
//     movieName: "Captain Marvel",
//   },

//   ...
// ]
// `;

app.get("/directors/:directorId/movies/", async (request, response) => {
  const directorMovies = request.body;
  const { directorId } = request.params;
  const movieQuery = `SELECT movie.movie_name
FROM movie
JOIN director ON movie.director_id = director.director_id
WHERE director.director_id=${directorId};
`;
  const dbResponse = await db.all(movieQuery);
  response.send(snakeToCamel(dbResponse));
});
module.exports = app;
