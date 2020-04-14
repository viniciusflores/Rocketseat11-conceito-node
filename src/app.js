const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  repositories.push({
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  });

  return response.json({
    message: `Foi adicionado o repositório ${title}`,
  });
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: `Repository not found` });
  }

  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.json({ message: `Repositório removido` });
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories[repositoryIndex].likes =
    (Number(repositories[repositoryIndex].likes) || 0) + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
