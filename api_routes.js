//Importamos el módulo "router" desde el paquete "express".
import express from 'express';
//Creamos una instancia del enrutador de "express" para definir rutas específicas y luego integrarlas en la aplicación principal.
const router = express.Router();
//Especificamos las rutas para el controlador del juego.
import gamerouter from './src/routes/game_routes.js';
router.use('/game', gamerouter);
//Exportamos el enrutador para que pueda ser utilizado en la aplicación principal.
export default router;
