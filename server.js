const http = require('http');   //import du package http - https requiert un certificat SSL à obtenir avec un nom de domaine
const app = require('./app');   //import de app pour utilisation de l'application sur le serveur
require('dotenv').config();

//normalizePort renvoie un port valide
const normalizePort = val => {
  const port = parseInt(val, 10); //analyse de l'argument passé, valeur obtenue assigné à une constante "port"
  if (isNaN(port)) {              //si la constante "port" n'est pas un Nombre (isNaN) 
    return val;                   //renvoie de l'argument qui passé à la fonction
  }
  if (port >= 0) {
    return port;                  //si la valeur de la constante "port" est supérieur à zéro de donc valide: la fonction renvoie la consante port
  }
  return false;                   //sinon (port<0) la fonction renvoie alors false
};

//ajout du port de connection si celui-ci n'est pas declarer par l environnement
//si aucun port n'est fourni on écoutera sur le port 8080
const port = normalizePort(process.env.port || '8080');
app.set('port', port);

//la fonction errorHandler recherche les différentes erreurs et les gère de manière appropriée
//pour ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':            //EACCES : permission denied
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':        //EADDRINUSE : port already in use
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//créer un serveur avec express qui utilise app
//création d'une constante pour les appels serveur (requetes et reponses)
const server = http.createServer(app);  //https requiert un certificat SSL à obtenir avec un nom de domaine

//gestions des évenements serveur pour un retour console
//lance le serveur et affiche sur quel port se connecter ou gère les erreurs s'il y en a
server.on('error', errorHandler);
server.on('listening', () => {  //un écouteur d'évènements qui enregistre le port nommé sur lequel le serveur s'exécute dans la console
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
server.on('request', () => {
    let objDate = new Date();
    console.log("A request from the application has been received ! ("
    +objDate.getDate()+"/"+(objDate.getMonth()+1)+"/"+objDate.getFullYear()+" at "
    +objDate.getHours()+":"+objDate.getMinutes()+":"+objDate.getSeconds()+")");
});

//le serveur écoute le port définit plus haut
server.listen(port);