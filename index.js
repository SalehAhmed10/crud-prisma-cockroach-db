import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 4000;

// prisma
const prisma = new PrismaClient();

// middleware to convert every req to JSON
app.use(express.json());

// higher order function to check if bookmark really exist in database or not
const checkIfBookmarkExists = async (bookmarkId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: bookmarkId,
    },
  });

  if (user) {
    return user;
  }
};

app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "Welcome to Bookmark Server",
  });
});

app.get("/users", async (req, res) => {
  // get the bookmark from db
  const users = await prisma.user.findMany();
  console.log(users);
  res.send({
    success: true,
    users,
  });
});

app.post("/users", async (req, res) => {
  // make sure to use app.use(express.json)
  //   const name = req.body.name;
  const { name, bookmark } = req.body;

  // error handeling here check for possible cause of error
  if (!name || !bookmark) {
    return res.send({
      success: false,
      message: "Name and Bookmark must be provided to create a user",
    });
  }

  //   const user = { id: users.length + 1, name, bookmark };
  //   users.push(user);

  const user = await prisma.user.create({
    data: {
      name: name,
      bookmark: bookmark,
    },
  });

  res.send({
    success: true,
    user,
    // user,
  });
});

// get bookmark by id

app.get("/users/:bookmarkId", async (req, res) => {
  const { bookmarkId } = req.params;

  try {
    // const user = await prisma.user.findFirst({
    //   where: {
    //     id: bookmarkId,
    //   },
    // });

    const user = await checkIfBookmarkExists(bookmarkId);
    console.log(user);

    if (user) {
      res.send({
        success: true,
        user,
      });
    } else {
      res.send({
        success: false,
        message: "could not find the bookmark with id",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Delete by Id
app.delete("/users/:bookmarkId", async (req, res) => {
  const { bookmarkId } = req.params;

  try {
    // const checkIfExist = await prisma.user.findUnique({
    //   where: {
    //     id: bookmarkId,
    //   },
    // });
    console.log(bookmarkId);
    const checkIfExist = await checkIfBookmarkExists(bookmarkId);
    console.log(checkIfExist);

    if (!checkIfExist) {
      return res.send({
        success: false,
        message: "Bookmark does not exist in database",
      });
    }

    if (!bookmarkId) {
      return res.send({
        success: false,
        error: error.message,
      });
    }

    const user = await prisma.user.delete({
      where: {
        id: bookmarkId,
      },
    });

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Patch By Id
app.patch("/users/:bookmarkId", async (req, res) => {
  const { bookmarkId } = req.params;

  const { name, bookmark } = req.body;

  if (!bookmark || !name) {
    return res.send({
      success: false,
      message: "name and bookmark value must be provided",
    });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: bookmarkId,
      },
      data: {
        name: name,
        bookmark: bookmark,
      },
    });

    res.send({
      success: true,
      user,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

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
