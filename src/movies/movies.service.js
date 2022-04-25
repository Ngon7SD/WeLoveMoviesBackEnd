const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

function list() {
  return knex("movies").select("*");
}

function read(movieId) {
  return knex("movies")
  .select("*")
  .where({ movie_id: movieId })
  .first();
}

function readReviews(movie){
    return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select("r.*", "c.*")
    .where({"r.movie_id": movie.movie_id })
    .then(reviews => reviews.map(review => addCritics(review)))
}

function readTheaters(movieId){
    return knex("movies as m")
      .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
      .join("theaters as t", "t.theater_id", "mt.theater_id")
      .select("t.*", "mt.*")
      .where({ "m.movie_id": movieId.movie_id });
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "mt.movie_id", "m.movie_id")
    .select("m.*")
    .where({ is_showing: true })
    .groupBy("m.movie_id");
}

module.exports = {
  list,
  listShowing,
  read,
  readReviews,
  readTheaters,
};
