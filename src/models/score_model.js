//Importamos la librería de Mongodb.
import mongoose from "mongoose";
const Schema = mongoose.Schema
//Creamos el Schema.
const scoreschema = new Schema({
    dealercards:{
        type: [String],
        required: true,
    },
    playercards:{
        type: [String],
        required: true,
    },
    playerresult:{
        type: String,
        required: true,
    }
});
//Exportamos el modelo.
export default mongoose.model('gamemypoker', scoreschema);
