import express from "express";

const app = express();
const PORT = 4000;

// middleware to convert every req to JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Welcome to Bookmark Server",
  });
});

app.get("/users", (req, res) => {
  res.send({
    success: true,
    users,
  });
});

app.post("/users", (req, res) => {
  // make sure to use app.use(express.json)
  const name = req.body.name;

  // error handeling here check for possible cause of error
  if (!name) {
    return res.send({
      success: false,
      message: "Name must be provided to create a user",
    });
  }

  const user = { id: users.length + 1, name, count: 0 };
  users.push(user);

  res.send({
    success: true,
    user,
  });
});

let users = [
  {
    id: 1,
    name: "David",
    count: 3,
  },
  {
    id: 2,
    name: "Tom",
    count: 2,
  },
  {
    id: 3,
    name: "John",
    count: 4,
  },
];

// at this point if user is requesting a route and its not showing up its definetly does not exist
app.use((req, res) => {
  res.send({
    success: false,
    message: "No route found",
  });
});

// handle error eg: typo error while sending req
app.use((error, req, res, next) => {
  res.send({
    success: false,
    error: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
