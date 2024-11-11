const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

// Cors configuration - Allows requests from localhost:4200
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

// Use cors middleware
app.use(cors(corsOptions));

app.use(express.json());

// signup
app.post('/users/signup', (req, res) => {

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const user = jsonData.users.find(user => user.username === req.body.username);

    const { username, password, phone } = req.body

    
    if (user != null) {
        res.status(400).send('Username already in existed');
        return;
    }

    if (username != "" && password != "" && phone != "" && username != null && password != null && phone != null) {

      newItem = {
        username, password, phone
      }

      jsonData.users.push(newItem);

      fs.writeFile("users.json", JSON.stringify(jsonData), (err) => {
        if (err) {
          console.log(err);
          res.status(500).send("Internal Server Error");
          return;
        }

        res.status(201).json(newItem);
      });
    } else {
      res.status(400).send("Invalid sign up information")
      return;
    }

  });
})

// login
app.post('/users/login', (req, res) => {

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const user = jsonData.users.find(user => user.username === req.body.username);

    if (user == null) {
      res.status(400).send('Invalid username or password');
      return;
    }

    if (user.password === req.body.password) {
      res.status(200).json({
        user
      });
    } else {
      res.status(400).send('Invalid username or password');
      return;
    }
  });
})

// users
app.get("/users", (req, res) => {

  fs.readFile("users.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    res.status(200).json({
      users: jsonData.users,
    });
  });
});

// articles
app.get("/articles", (req, res) => {
  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    console.log("Data read from file:", data); // Add this line for debugging

    const jsonData = JSON.parse(data);

    res.status(200).json({
      articles: jsonData.articles,
    });
  });
});

//posts
app.post("/posts", (req, res) => {
  const {author, media, status, pfp} = req.body;

  fs.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );

    const newItem = {
      id: maxId + 1,
      author,
      media,
      status, pfp
    };

    jsonData.items.push(newItem);

    fs.writeFile("posts.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

app.get("/posts", (req, res) => {
  fs.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    res.status(200).json({
      posts: jsonData.posts, // Correct key for the 'posts' array
    });
  });
});


app.put("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { author, media, status, pfp  } = req.body;

  fs.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items[index] = {
      id,
      author, media, status, pfp
    };

    fs.writeFile("posts.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json(jsonData.items[index]);
    });
  });
});

app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("posts.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items.splice(index, 1);

    fs.writeFile("posts.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(204).send();
    });
  });
});


const port = process.env.PORT || 1500

app.listen(port, () => { console.log("Server is running"); });
