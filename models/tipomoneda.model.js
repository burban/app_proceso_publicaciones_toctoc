

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tipoMonedaSchema = new Schema(
    {
        idTipoMoneda : String,
        descripcion : String
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const moneda = mongoose.model('moneda',tipoMonedaSchema);

module.exports = moneda;