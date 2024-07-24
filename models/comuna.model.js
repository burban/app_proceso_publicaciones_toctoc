const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const comunaSchema =  new Schema(
    {
        idComuna : String,
        descripcion : String,
        abreviacion : String
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const comuna = mongoose.model('cities',comunaSchema);

module.exports = comuna;