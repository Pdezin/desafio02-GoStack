const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) return response.status(400).json({ error: "Id not found" });
  next();
}

app.use("/repositories/:id", validateId);

//GET
app.get("/repositories", (request, response) => {
  response.json(repositories);
});

//POST
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repository);
  response.json(repository);
});

//PUT
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0)
    return response.status(404).json({ error: "Not found" });

  const modifiedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[indexRepository].likes,
  };
  repositories[indexRepository] = modifiedRepository;

  response.json(modifiedRepository);
});

//DELETE
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0)
    return response.status(404).json({ error: "Not found" });
  repositories.splice(indexRepository, 1);
  return response.status(204).send();
});

//POST LIKE
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (indexRepository < 0)
    return response.status(404).json({ error: "Not found" });
  repositories[indexRepository].likes =
    Number(repositories[indexRepository].likes) + 1;
  return response.json(repositories[indexRepository]);
});

module.exports = app;
