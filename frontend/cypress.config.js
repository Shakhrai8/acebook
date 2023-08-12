const { defineConfig } = require("cypress");
const { connect, disconnect } = require("./cypress/support/db");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },

  env: {
    baseUrl: "http://localhost:3000",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        async clearDb() {
          const db = await connect();
          const users = db.collection("users");
          const notifications = db.collection("notifications");
          const posts = db.collection("posts");
          const comments = db.collection("comments");
          const groups = db.collection("groups");

          console.log("clearing users");
          await users.deleteMany({});
          await users.dropIndexes();
          await notifications.deleteMany({});
          await notifications.dropIndexes();
          await posts.deleteMany({});
          await posts.dropIndexes();
          await comments.deleteMany({});
          await comments.dropIndexes();
          await groups.deleteMany({});
          await groups.dropIndexes();

          await disconnect();

          return null;
        },
      });
    },
    baseUrl: "http://localhost:3000",
  },
});
