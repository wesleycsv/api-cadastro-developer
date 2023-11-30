const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const port = 3001;

const app = express();
app.use(express.json());
app.use(cors());

const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params;

  const index = users.findIndex((usersId) => usersId.id === id);
  if (index < 0) {
    return response.status(404).json({ Erro: "Erro no index do usúario" });
  }

  request.userId = id;
  request.userIndex = index;
  next();
};

//GET USERS
app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

//POST USERS
app.post("/users", (request, response) => {
  try {
    const { name, email } = request.body;
    const newUser = {
      id: uuid.v4(),
      name,
      email,
    };
    users.push(newUser);

    return response.status(201).json(newUser);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

//PUT USERS
app.put("/users/:id", checkUserId, (request, response) => {
  const { name, email } = request.body;
  const id = request.userId;
  const UserIndex = request.userIndex;

  const userUpdate = { id, name, email };

  users[UserIndex] = userUpdate;
  return response.status(200).json(userUpdate);
});

//DELETE USERS
app.delete("/users/:id", checkUserId, (request, response) => {
  const UserIndex = request.userIndex;

  users.splice(UserIndex, 1);
  return response.status(204).json();
});

app.listen(port, (data) => {
  console.log(`Run Server in port ${port}`);
});
