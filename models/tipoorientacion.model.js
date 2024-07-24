

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tipoOrientacionSchema = new Schema(
    {
        idTipoOrientacion : String,
        descripcion : String
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const orientacion = mongoose.model('orientacion',tipoOrientacionSchema);

module.exports = orientacion;