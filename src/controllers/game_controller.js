import scoremodel from '../models/score_model.js';

const postgame = async (req, res) => {
    try {
        /**const score = new scoremodel(req.body)
        await score.save()
        return res.status(201).json(score)*/
        console.log('Controlador funcionando')
        res.status(200).send('¡Hola desde el controlador!')
    } catch (error) {
        console.log(res.status(500).json({error: error.message}))
    }
}

export default {postgame};
