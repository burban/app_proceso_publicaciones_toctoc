const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let hoy = new Date();
let dd = hoy.getDate();
let mm = hoy.getMonth() + 1;
let yyyy = hoy.getFullYear();            
let fc = `${dd}-${(mm < 10) ? '0'+mm : mm}-${yyyy}`;

const publicacionSchema =  new Schema(
    {
        codigoPropiedad : String,
        operacion : String,
        comuna : String,
        sector : String,
        tipoMoneda: String,
        precio:  String,
        tipoPropiedad:  String,
        superficieConstruida:  String,
        superficieTerreno:  String,
        dormitorios:  String,
        dormitoriosDeServicio: Boolean,
        banos:   String,
        descripcion:   String,
        codigoSucursal:   String,
        imagenes : [],
        url:   String,
        mapa:   String,
        latitud:   String,
        longitud:   String,
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
const publicacion = mongoose.model('publicacion',publicacionSchema);

module.exports = publicacion;