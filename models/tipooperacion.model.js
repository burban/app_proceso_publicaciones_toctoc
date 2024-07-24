const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const tipooperacionSchema =  new Schema(
    {
        idTipoOperacion : String,
        descripcion : String        
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const TipoOperacion = mongoose.model('TOperation',tipooperacionSchema);

module.exports = TipoOperacion;