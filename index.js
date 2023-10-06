import express from "express";
import axios from "axios";
import _ from "lodash";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("<h1>Harish Selvaraj</h1>");
});

app.get("/api/blog-stats", (req, res) => {
  async function getBlogs() {
    try {
      const headers = {
        "x-hasura-admin-secret":
          "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
      };
      const response = await axios.get(
        "https://intent-kit-16.hasura.app/api/rest/blogs",
        { headers }
      );
      if (!response) {
        res.status(500).send(error + ": Error occured during API fetch");
      }
      const allBlogs = response.data.blogs;
      const totalBlogs = _.size(allBlogs);
      const longestBlog = _.maxBy(response.data.blogs, "title.length").title;
      const blogsWithPrivacyTitle = _.filter(response.data.blogs, (blog) =>
        _.includes(blog.title.toLowerCase(), "privacy")
      ).length;
      const uniqueTitles = _.uniqBy(response.data.blogs, "title").map(
        (blog) => blog.title
      );
      const answer = {
        NumberOfBlogs: totalBlogs,
        LongestBlogTitle: longestBlog,
        BlogsWithPrivacy: blogsWithPrivacyTitle,
        UniqueTitles: uniqueTitles,
      };
      res.json(answer);
    } catch (error) {
      res.status(500).send(error + ": Sorry, unexpected error!");
    }
  }
  getBlogs();
});

app.get("/api/blog-search", (req, res) => {
  const query = req.query.query;
  if (!query) {
    res
      .status(400)
      .send(
        "Query parameter missing. Please enter at the end of URL like localhost:3000/api/blog-search?query=YourQuery"
      );
  }
  async function searchBlogs() {
    try {
      const headers = {
        "x-hasura-admin-secret":
          "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
      };
      const response = await axios.get(
        "https://intent-kit-16.hasura.app/api/rest/blogs",
        { headers }
      );
      if (!response) {
        res.status(500).send(error + ": Error occured during API fetch");
      }
      const matchingBlogs = response.data.blogs.filter((blog) =>
        blog.title.toLowerCase().includes(query.toLowerCase())
      );

      res.json(matchingBlogs);
    } catch (error) {
      res.status(500).send(error + ": Error occured while searching");
    }
  }
  searchBlogs();
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
