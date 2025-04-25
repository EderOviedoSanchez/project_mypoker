//Importamos la librería de Mongodb.
import mongoose from "mongoose";
const Schema = mongoose.Schema

const scoreschema = new Schema({
    scorejugador:{
        type: Number,
        required: true,
    },
});
//Exportar Schema.
export default mongoose.model('gamemypoker', scoreschema);