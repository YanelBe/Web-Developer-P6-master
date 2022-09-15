//On définit une constante http pour écouter des requêtes
const http = require("http");
//On fait référence à notre fichier app.js comme condition
const app = require("./app");

//On définit le renvoi d'un port valide
const normalizePort = val => {
    const port = parseInt(val, 10);
    //Si le port est une valeur string, on la convertit en nombre
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//On créé une fonction qui recherche et répond aux différentes erreurs possibles
const errorHandler = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (error.code) {
      //Si l'accès n'est pas autorisé
      case "EACCES":
        console.error(bind + " requires elevated privileges.");
        process.exit(1);
        break;
      //Si le port est déjà utilisé
      case "EADDRINUSE":
        console.error(bind + " is already in use.");
        process.exit(1);
        break;
      default:
        throw error;
    }
};

//On créé un serveur grâce à express
const server = http.createServer(app);

//On enregistre la fonction qui gère les erreurs sur le serveur
server.on("error", errorHandler);
//On créé une écoute sur le port ouvert dont les évènements seront montrés sur la console
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);