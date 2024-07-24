'use strict';


const mongoose = require('mongoose');
const publicacion = require('../models/publicacion.model');
const axios = require('axios');

try {

        mongoose.connect(`mongodb://MQVSDB01:27017/mq_publicaciones`); 

} catch (error) {
    console.log('error:: ',error);
}


/**
 * ## Obtiene las publicaciones de www.mq.cl/get
 * @returns 
 */
async function getPublicacionsFromHost() {
    try {
        
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://www.mq.cl/get',
            headers: { }
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            let resp = await insertDataHost(data);
            return {
                status: resp.status,
                message:resp.message
            }   
            
        })
        .catch(function (error) {
            return {
                status: false,
                message : error.message
            }
        });

        return {
            status: ax.status,
            message : ax.message
        }


    } catch (error) {

        return {
            status : false,
            message : error.message        
        }
        
    }
}


/**
 * ### Guarda las publicaciones
 * @param {* Objeto con las publicaciones} xdata 
 * @returns 
 */
async function insertDataHost(xdata)
{
    try {
        
        if(xdata)
        {           

            let rspPublic = await publicacion.deleteMany({});

            for(let row in xdata) {            

                await publicacion.create(xdata[row]);                            
            }

            return {
                status: true,
                message:'insertDataHost -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHost -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHost :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}


/**
 * Retorna todas la publicaciones guardadas en BBDD local
 */
async function getPublicaciones()
{
    try {

        let publ = await publicacion.find({});

        return {
            status : true,
            data : publ,
            message : 'getPublicaciones -> Correcto !'
        }

    } catch (error) {

        console.log('Error: getPublicaciones :', error.message);
        return {
            status: false,
            message : error.message
        }
    }
    
}

module.exports = {
    getPublicaciones,
    getPublicacionsFromHost
}




