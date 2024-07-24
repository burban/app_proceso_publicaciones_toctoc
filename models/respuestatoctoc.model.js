const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1;
let yyyy = hoy.getFullYear();            
let fc = `${dd}-${(mm < 10) ? '0'+mm : mm}-${yyyy}`;

const responseToctocSchema =  new Schema(
    {        
        success: Boolean,
        code:   Number,
        message:   String,        
        data : {
            id : Number,
            url : String
        },
        idpublicacion: String,
        fc : {
            type : String,
            default : fc
        }        
    },
    { 
        timestamps: true 
    }
);


//Creamos el Modelo
const responsetoctoc = mongoose.model('responsetoctoc',responseToctocSchema);

module.exports = responsetoctoc;