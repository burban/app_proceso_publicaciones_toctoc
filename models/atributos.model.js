const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tipoAtributoSchema = new Schema(
    {
        idAtributo : String,
        descripcion : String,
        esEspacioComun : Boolean
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const atributo = mongoose.model('tAtributo',tipoAtributoSchema);

module.exports = atributo;