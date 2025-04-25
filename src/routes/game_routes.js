//Importar el móludo "router" desde el paquete "express".
import express from 'express';
//Creamos una nueva instancia del enrutador "express".
const router = express.Router();
//Importamos los métodos del controlador.
import gamecontroller from '../controllers/game_controller.js';
//Se crean las rutas de la API. "postgame" será la ruta para enviar la información de la partida.
router.post('/sing', gamecontroller.postgame);

//Estructura para hacer la prueba en el postman.

// router.post('/sing', (req, res) => {gamecontroller.postgame(req, res)});

//Se exporta el módulo "router".
export default router;
