import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", async (req, res) => {
  let URL = [];
  let selected = req.query.type || "random";
  try {
    const response = await axios.get(`https://api.nekosia.cat/api/v1/images/${selected}?count=10&rating=safe`);
    for (let i = 0; i < response.data.images.length; i++) {
      URL.push(response.data.images[i].image.compressed.url);
    }
    res.render("index.ejs", { imgURL: URL, type: selected });
    //error handler
  } catch (error) {
    console.log(error.message);
    if (error.response) {
      res.status(error.response.status).render("error.ejs", {
        status: error.response.status,
        message: "Unable to fetch images. Please try a different category or try again later.",
      });
    } else if (error.request) {
      res.status(503).render("error.ejs", {
        status: 503,
        message: "Server is currently unavailable. Please try again later or check your internet connection.",
      });
    } else {
      res.status(500).render("error.ejs", {
        status: 500,
        message: "Something went wrong. Please try again later",
      });
    }
  }
});

app.post("/", (req, res) => {
  let selected = req.body.type || "random";
  res.redirect(`/?type=${selected}`);
});

app.use((req, res) => {
  res.status(404).render("error.ejs", {
    status: 404,
    message: "Page not found! The route you're looking for doesn't exist."
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
