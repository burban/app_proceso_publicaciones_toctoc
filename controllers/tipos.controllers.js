'use strict';


const axios = require('axios');

const tipoOperacion = require('../models/tipooperacion.model');
const tipoPropiedad = require('../models/tipopropiedad.model');
const comuna = require('../models/comuna.model');
const tipoMoneda = require('../models/tipomoneda.model');
const tipoOrientacion = require('../models/tipoorientacion.model');
const atributo = require('../models/atributos.model');




//##########################################
// ########  Tipo Propiedad
//##########################################
/**
 * ## Obtiene los tipos dede toc toc
 * @returns 
 */
async function getTipoPropFromTocToc() {
    try {
        
        let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/tipopropiedad';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostTipoProp(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {
                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getTipoPropFromTocToc) !!'
                }
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
 * ### Guarda los tipos de propiedad
 * @param {* Objeto con los tipos de propiedad } xdata 
 * @returns 
 */
async function insertDataHostTipoProp(xdata)
{
    try {
        
        if(xdata)
        {           
            //Eliminamos los registros de la BBDD
            let rspDe = await tipoPropiedad.deleteMany({});
            // console.log('tipoPropiedad rspDe::', rspDe);

            for(let row in xdata) {            

                await tipoPropiedad.create(xdata[row]);                            
            }

            return {
                status: true,
                message:'insertDataHostTipoProp -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostTipoProp -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostTipoProp :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



//##########################################
// ########  Tipo Operacion
//##########################################
/**
 * ## Obtiene los tipos desde toc toc
 * @returns 
 */
async function getTipoOperFromTocToc() {
    try {
        let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/tipooperacion';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostTipoOper(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {

                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getTipoOperFromTocToc) !!'
                }
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
 * ### Guarda los tipos operacion
 * @param {* Objeto con los tipos operacion } xdata 
 * @returns 
 */
async function insertDataHostTipoOper(xdata)
{
    try {
        
        if(xdata)
        {           

            //Eliminamos los registros de la BBDD
            let rspDeOpe = await tipoOperacion.deleteMany({});
            // console.log('tipoOperacion rspDeOpe::', rspDeOpe);

            for(let row in xdata) {            

                await tipoOperacion.create(xdata[row]);
            }

            return {
                status: true,
                message:'insertDataHostTipoOper -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostTipoOper -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostTipoOper :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



//##########################################
// ########  Comunas
//##########################################
/**
 * ## Obtiene los tipos desde toc toc
 * @returns 
 */
async function getComunaFromTocToc() {
    try {
        
		let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/comunas';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostComuna(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {

                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getComunaFromTocToc) !!'
                }
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
 * ### Guarda las comunas
 * @param {* Objeto con las comunas } xdata 
 * @returns 
 */
async function insertDataHostComuna(xdata)
{
    try {
        
        if(xdata)
        {

            //Eliminamos los registros de la BBDD
            let rspComu = await comuna.deleteMany({});
            // console.log('comuna rspComu::', rspComu);

            for(let row in xdata) {

                await comuna.create(xdata[row]);
            }

            return {
                status: true,
                message:'insertDataHostComuna -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostComuna -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostComuna :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



//##########################################
// ########  MONEDA
//##########################################
/**
 * ## Obtiene los tipos desde toc toc
 * @returns 
 */
async function getMonedaFromTocToc() {
    try {
        
		let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/tipomoneda';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostTMoneda(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {

                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getMonedaFromTocToc) !!'
                }
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
 * ### Guarda los tipos de moneda
 * @param {* Objeto con las comunas } xdata 
 * @returns 
 */
async function insertDataHostTMoneda(xdata)
{
    try {
        
        if(xdata)
        {
            //Eliminamos los registros de la BBDD
            let rspTipMone = await tipoMoneda.deleteMany({});
            // console.log('tipoMoneda rspTipMone::', rspTipMone);

            for(let row in xdata) {

                await tipoMoneda.create(xdata[row]);
            }

            return {
                status: true,
                message:'insertDataHostTMoneda -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostTMoneda -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostTMoneda :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}


//##########################################
// ########  ORIENTACION
//##########################################
/**
 * ## Obtiene los tipos desde toc toc
 * @returns 
 */
async function getOrientacionFromTocToc() {
    try {
        
		let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/tipoorientacion';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostTOrientacion(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {

                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getOrientacionFromTocToc) !!'
                }
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
 * ### Guarda los tipos de orientacion
 * @param {* Objeto con las comunas } xdata 
 * @returns 
 */
async function insertDataHostTOrientacion(xdata)
{
    try {
        
        if(xdata)
        {
            //Eliminamos los registros de la BBDD
            let rspTipOrin = await tipoOrientacion.deleteMany({});
            // console.log('tipoOrientacion rspTipOrin::', rspTipOrin);

            for(let row in xdata) {

                await tipoOrientacion.create(xdata[row]);
            }

            return {
                status: true,
                message:'insertDataHostTOrientacion -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostTOrientacion -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostTOrientacion :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



//##########################################
// ########  ATRIBUTO
//##########################################
/**
 * ## Obtiene los tipos desde toc toc
 * @returns 
 */
async function getAtributoFromTocToc() {
    try {
        
		let urlbase = process.env.URL_BASE_TOCTOC;
        let url = 'https://api.toctoc.com/api/v1/public/atributos';

        let config = {
                method: 'get',
                url: url
            };
            
        let ax = await axios(config)
        .then(async function (response) {
            //console.log(JSON.stringify(response.data));
            let data = response.data;
            if(data.success) {

                let resp = await insertDataHostAtributo(data.data);
                return {
                    status: resp.status,
                    message:resp.message
                }   
            }
            else
            {

                return {
                    status: false,
                    message : 'Problemas al obtener los datos (getOrientacionFromTocToc) !!'
                }
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
 * ### Guarda los tipos Atributos
 * @param {* Objeto con las comunas } xdata 
 * @returns 
 */
async function insertDataHostAtributo(xdata)
{
    try {
        
        if(xdata)
        {
            //Eliminamos los registros de la BBDD
            let rspAtri = await atributo.deleteMany({});
            // console.log('atributo rspAtri::', rspAtri);

            for(let row in xdata) {

                await atributo.create(xdata[row]);
            }

            return {
                status: true,
                message:'insertDataHostAtributo -> Correcto !!'
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataHostAtributo -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataHostAtributo :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}

module.exports = {
    getTipoPropFromTocToc,
    getTipoOperFromTocToc,
    getComunaFromTocToc,
    getMonedaFromTocToc,
    getOrientacionFromTocToc,
    getAtributoFromTocToc
}