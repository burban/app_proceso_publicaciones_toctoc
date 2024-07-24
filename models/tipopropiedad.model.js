const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const tipopropiedadSchema =  new Schema(
    {
        idTipoPropiedad : String,
        descripcion : String,
        idTipoPropiedadFamilia: Number
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const TipoPropiedad = mongoose.model('TPropertie',tipopropiedadSchema);

module.exports = TipoPropiedad;