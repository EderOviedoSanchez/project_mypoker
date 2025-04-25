import scoremodel from '../models/score_model.js';

const postgame = async (req, res) => {
    try {
        const score = new scoremodel(req.body)
        await score.save()
        return res.status(201).json(score)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//Estructura para la prueba en el postman.

// const postgame = async (req, res) => {
//     console.log('Registrar datos de la partida.', req)
//     res.status(201).send('Registro exitoso.')
// }

export default {postgame}
