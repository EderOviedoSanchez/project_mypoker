//Crear e importar el servidor de "express".
import express from 'express';
const app = express();
//Importar el "dotenv" para usar las variables de entorno.
import dotenv from 'dotenv';
dotenv.config();
//Instalación de los protocolos de seguridad "Cors".
import cors from 'cors';
app.use(cors());
//Se indica a la aplicación que las peticiones y respuestas serán en formato JSON.
app.use(express.json())
//Importamos el archivo de rutas de la API.
import api_routes from './api_routes.js';
app.use('/api/mypoker', api_routes);
//Importamos mongoose para conectarnos a la base de datos.
import mongoose from 'mongoose';
//Importamos la base de datos de Mongodb.
mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log('Conectado a la base de datos')})
.catch((error) => {console.log('Error al conectar a la base de datos:', error)})
//Inicializar el servidor con la variable de entorno "PORT".
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto:', process.env.PORT);
});
