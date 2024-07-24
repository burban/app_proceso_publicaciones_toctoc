const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1;
let yyyy = hoy.getFullYear();            
let fc = `${dd}-${(mm < 10) ? '0'+mm : mm}-${yyyy}`;

const responseToctocErrorSchema = new Schema(
    {
        success: Boolean,
        code:   Number,
        message:   String,
        errorsrsp :    Array,
        idpublicacion: String,
        idintento : Number,
        fc : {
            type : String,
            default : fc
        },
        objpublicacion : Array
    }
);

//Creamos el Modelo
const responsetoctocError = mongoose.model('responsetoctoc_errors',responseToctocErrorSchema);

module.exports = responsetoctocError;