/*const express = require('express');
require('dotenv').config();

class Application {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  use(middleware) {
    this.app.use(middleware);
  }

  addRouter(router) {
    this.app.use(router);
  }

  listen(port, callback) {
    this.app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(err.status || 500).json({ message: err.message || 'Ошибка сервера' });
    });

    const SERVER_PORT = port || process.env.PORT || 5000;
    this.app.listen(SERVER_PORT, callback);
  }
}

module.exports = Application;*/