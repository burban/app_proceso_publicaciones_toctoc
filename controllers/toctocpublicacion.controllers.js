'use strict';


const mongoose = require('mongoose');
const axios = require('axios');
var fs = require('fs');
var util = require('util');

const atrModel = require('../models/atributos.model');
const comuModel = require('../models/comuna.model');
const tipMonedaModel = require('../models/tipomoneda.model');
//const tipOperacionModel = require('../models/tipooperacion.model');
//const tipOrientacionModel = require('../models/tipoorientacion.model');
const tipPropiedadModel = require('../models/tipopropiedad.model');
const responsetoctocModel = require('../models/respuestatoctoc.model');
const responsetoctocErrorModel = require('../models/respuestatoctocError.model');

const enviarMailCtrl = require('../controllers/enviamail.controllers');

try {

    mongoose.connect(`mongodb://192.168.1.26:27017/mq_publicaciones`); 

} catch (error) {
    console.log('error:: ',error);
}


let bufferFile = '';

async function main_PublicacionTOCTOC(xObjPublicacion) {
    try {
                
        // ELiminamos los registros de publicaciones con error
        await responsetoctocErrorModel.deleteMany({});

        let tipoPropiedadObj = await tipPropiedadModel.find({},{idTipoPropiedad:1,descripcion:1});
        let comunaObj = await comuModel.find({},{idComuna:1,descripcion:1});

        // Obtenemos Tipo Propiedad (UNICOS)
        let publicacionTipoPropiedad = xObjPublicacion.map(item => item.tipoPropiedad.toLowerCase())
                                                      .filter((value,index,self) => self.indexOf(value) === index);

        //CODIFICAMOS TIPO PROPIEDAD
        let objTipoPropiedadCodificada = [];
        for (let i in publicacionTipoPropiedad) {
            
            let obj = tipoPropiedadObj.find(o => o.descripcion.trim().toLowerCase() === publicacionTipoPropiedad[i].trim().toLowerCase());
            if(typeof obj  !== 'undefined')
                objTipoPropiedadCodificada.push({ id:obj.idTipoPropiedad , descrip : obj.descripcion });

        }

        // OBTENEMOS COMUNAS (UNICAS)
        let publicacionComuna = xObjPublicacion.map(item => item.comuna.toLowerCase())
        .filter((value,index,self) => self.indexOf(value) === index);

        //CODIFICAMOS COMUNAS
        let objComunaPropiedadCodificada = [];
        for (let i in publicacionComuna) {
            
            let objC = comunaObj.find(o => o.descripcion.replace(/\s/g, '').toLowerCase() === publicacionComuna[i].replace(/\s/g, '').toLowerCase());
            if(typeof objC  !== 'undefined')
                objComunaPropiedadCodificada.push(objC);

        }

        //CASOS EXCEPCIONALES
        objComunaPropiedadCodificada.push({
            _id: 120,
            idComuna: '61',
            descripcion: 'llaillay'
        });

        //ELIMINAMOS LAS PUBLICACIONES ACTUALES DE TOCTOC
        let rspDelpublicados = await eliminaPublicados_TocToc();

        //LIMPIAMOS LA COLLECTIONS DE RESPONSE
        let rspResponse = await responsetoctocModel.deleteMany({});
        console.log('Eliminamos Collections rspResponse::',rspResponse);

        //Control de estados
        let num_success = 0;
        let num_fails = 0;
        let con_erros = [];        
        
        //PREAPARAMOS LAS PUBLICACIONES
        for(let row in xObjPublicacion) {

            //if(row == 4) {
                // Enviamos el obj de la publicacion para dar formato de acuerdo al 
                let rspObjPrepare = await prepare_PublicacionTOCTOC(xObjPublicacion[row],objComunaPropiedadCodificada,objTipoPropiedadCodificada);
                //console.log('PUBLICACION ENVIADA TOCTOC ::', rspObjPrepare);

                let respTocToc = await pushPublicacion_TocToc(rspObjPrepare.data);
                console.log('respTocToc::' , respTocToc);                

                if(parseInt(respTocToc.code) == 0) {
                    
                    num_success = num_success + 1;
					
					let rspResponse = [
						{
							success : respTocToc.status,
							code : respTocToc.code,
							message : respTocToc.message,
							data: respTocToc.data,
							errorsrsp: respTocToc.errors,
							idpublicacion : xObjPublicacion[row].codigoPropiedad
						}
					];

                    let rspSaveResponse = await insertDataResponse_TocToc(rspResponse);
                    console.log('rspSaveResponse::',rspSaveResponse);
                }
                else
                {
                    num_fails = num_fails + 1;
					
                    let objSaveError = [
                        {
                            success : respTocToc.status,
                            code : respTocToc.code,
                            message : respTocToc.message,
                            errorsrsp: respTocToc.errors,
                            idpublicacion : xObjPublicacion[row].codigoPropiedad,
                            idintento : 1,
                            objpublicacion : rspObjPrepare.data
                        }
                    ];

                    // Guardamos las respuestas con ERROR, para reintentar la publicación
                    await insertDataResponse_Error_TocToc(objSaveError);
                }                

                //PARA ESCRIBIR EN TXT
                // let writeFile = util.promisify(fs.writeFile);
                // await writeFile('objEnvioTOCTOC.txt', JSON.stringify(rspObjPrepare.data) );
            //}

        }

        let collecErrorTocToc = await responsetoctocErrorModel.find({},{objpublicacion:1});

        for(let row in collecErrorTocToc) {

            let idpublic = collecErrorTocToc[row].objpublicacion[0]["integratorPropertyID"];
            let titulo =  collecErrorTocToc[row].objpublicacion[0]["title"];

            let respTocTocTwo = await pushPublicacion_TocToc(collecErrorTocToc[row].objpublicacion);
            console.log('respTocTocTwo::' , respTocTocTwo);            

            if(parseInt(respTocTocTwo.code) == 0 ) {

                num_success = num_success + 1;
                num_fails = num_fails - 1;
				
				let rspResponseTwo = [
					{
						success : respTocTocTwo.status,
						code : respTocTocTwo.code,
						message : respTocTocTwo.message,
						data: respTocTocTwo.data,                    
						idpublicacion : idpublic
					}
				];
				
                let rspSaveResponseTwo = await insertDataResponse_TocToc(rspResponseTwo);
                console.log('rspSaveResponseTwo::',rspSaveResponseTwo);
            }
            else
            {

                con_erros.push({ idprop:idpublic , title : titulo });

                let objSaveErrorTwo = [
                    {
                        success : respTocTocTwo.status,
                        code : respTocTocTwo.code,
                        message : respTocTocTwo.message,
                        idpublicacion : idpublic,
                        idintento : 2,
                        objpublicacion : collecErrorTocToc[row].objpublicacion
                    }
                ];

                // Guardamos las respuestas con ERROR, para reintentar la publicación
                await insertDataResponse_Error_TocToc(objSaveErrorTwo);

            }

        }
        //console.log(collecErrorTocToc[0].objpublicacion);
        // console.log('collecErrorTocToc:',collecErrorTocToc);

        await enviarMailCtrl.sendMail(con_erros,num_success,num_fails);

        return {
            status : true,
            message : 'Proceso Correcto ( main_PublicacionTOCTOC ) !!'
        }

    } catch (error) {

        console.log('Error : main_PublicacionTOCTOC : ', error);

        return {
            status : false,
            message : error.message        
        }
        
    }
}


/**
 * ## Prepara Json para enviar a TOC TOC
 * @param {* Publicación} xObj 
 * @returns Obj para enviar a TOC TOC
 */
async function prepare_PublicacionTOCTOC(xPublicacion,xComunas,xTipoPropiedad) {
    try {        
        // console.log('xTipoPropiedad::',xTipoPropiedad.length);
        // console.log('xComunas::',xComunas);
        //console.log('xPublicacion::',xPublicacion);
        console.log(' CODE ',xPublicacion.codigoPropiedad);

        let monedaPublicacion = 1; /** POR DEFECTO, TODAS LAS PUBLICACIONES SON EN PESO */        
        let tOperacion = (xPublicacion.operacion.toLowerCase() == 'arriendo'? 11 : 9);
        let sectorObj = xPublicacion.sector.split(',');

        // IMAGENES
        // ACEPTA UN MINIMO DE 3 IMAGENES, EN CASO DE TENER EL MINIMO, SE AGREGA LA IMAGEN DE www.mq.cl hasta completar la cantidad
        let fotosObj = [];
        if(xPublicacion.imagenes.length > 2 )
        {        
            for(let row in xPublicacion.imagenes) {

                fotosObj.push({"file": xPublicacion.imagenes[row],
                    "sequenceNumber": ( parseInt(row) + 1),
                    "imageName": "",
                    "isPrincipal" : false
                });
            }
        }
        else if(xPublicacion.imagenes.length == 2) {

            for(let row in xPublicacion.imagenes) {

                fotosObj.push({"file": xPublicacion.imagenes[row],
                    "sequenceNumber": ( parseInt(row) + 1),
                    "imageName": "",
                    "isPrincipal" : false
                });
            }
//https://www.mq.cl/wp-content/themes/mq2018/images/MQ.png
            fotosObj.push({"file": "https://mq.cl/wp-content/uploads/2023/12/MQ-LOGO.jpg",
                    "sequenceNumber": 3,
                    "imageName": "",
                    "isPrincipal" : false
                });
            
        }
        else {

            fotosObj.push({"file": "https://mq.cl/wp-content/uploads/2023/12/MQ-LOGO.jpg",
                "sequenceNumber": 1,
                "imageName": "",
                "isPrincipal" : false
            });

            fotosObj.push({"file": "https://mq.cl/wp-content/uploads/2023/12/MQ-LOGO.jpg",
                "sequenceNumber": 2,
                "imageName": "",
                "isPrincipal" : false
            });

            fotosObj.push({"file": "https://mq.cl/wp-content/uploads/2023/12/MQ-LOGO.jpg",
                "sequenceNumber": 3,
                "imageName": "",
                "isPrincipal" : false
            });

        }
        

        //COMUNA
        let comunaString = xPublicacion.comuna.trim();        
        let objCom = xComunas.find(o => o.descripcion.replace(/\s/g, '').trim().toLowerCase() === comunaString.replace(/\s/g, '').toLowerCase());        
        let idTipoComuna = objCom.idComuna;   

        //TIPO PROPIEDAD        
        let tpPropiedad = xPublicacion.tipoPropiedad.trim();
        let objTP = xTipoPropiedad.find(o => o.descrip.replace(/\s/g, '').trim().toLowerCase() === tpPropiedad.replace(/\s/g, '').toLowerCase());
        let idTipoPropiedad = objTP.id;

        // OBJETO FORMATEADO PARA -> TOC TOC
        let obj = {
            "integratorPropertyID": xPublicacion.codigoPropiedad,
            "integratorSalesAssociateID": "1318",
            "transactionType": tOperacion,
            "propertyType": parseInt(idTipoPropiedad), /** TIPO PROPIEDAD */
            "title": (sectorObj[0].length < 6 ? sectorObj[0]+ ' '+ sectorObj[1] : sectorObj[0]),
            "propertyDescription": xPublicacion.descripcion,
            "streetNumber": "00",
            "streetName": "av.",
            "apartmentNumber": "",
            "floorLevel": 0,
            "cityID": parseInt(idTipoComuna), /** ID COMUNA */
            "longitude": parseFloat(xPublicacion.longitud),
            "latitude": parseFloat(xPublicacion.latitud),
            "currentListingPrice": parseFloat(xPublicacion.precio),
            "currentListingCurrencyID": monedaPublicacion,
            "specification": {
              "lotSize": parseInt((xPublicacion.superficieTerreno.length < 1 ? 0 : xPublicacion.superficieTerreno)), /* 0 Si no corresponde */
              "availSize": 0,
              "buildArea": parseInt((xPublicacion.superficieConstruida.length < 1 ? 0 : xPublicacion.superficieConstruida)), /* 0 Si no corresponde */
              "balconyArea": 0,
              "numberOfBathrooms": parseInt(xPublicacion.banos),
              "numberOfBedrooms": parseInt(xPublicacion.dormitorios),
              "numberOfFloors": 0,
              "orientationID": 0
            },
            "environment": {
              "store": 0,
              "parkingStore": 0,
              "furnished": false
            },
            "facility": {
              "berbecue": false,
              "pool": false,
              "elevator": false
            },
            "attributes": [],
            "regReference": "",
            "images": fotosObj,
            "multimedia": []
          }          
        
        return {
            data : obj,
            status : true
        }

    } catch (error) {

        console.log('Error : prepare_PublicacionTOCTOC : ', error);

        return {
            status : false,
            message : error.message        
        }        
    }
}

/**
 * ## ENVIAMOS LAS PUBLICACIONES A TOC TOC
 * @returns response de la API Toc Toc
 */
async function pushPublicacion_TocToc(xObjPublicacion) {
    try {

        let vKeyCliente = '36b2eb88-9887-47e9-a4b5-63e2f85ecf9c';
        let vKeyIntegrador = 'b83158a3-b107-4c5a-b0f7-c4c16bb0d8df';
        let urlPush = 'https://api.toctoc.com';
        
        let data = JSON.stringify(xObjPublicacion);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `https://api.toctoc.com/api/v1/private/publish/used`,
            headers: { 
                'KeyCliente': vKeyCliente, 
                'KeyIntegrador': vKeyIntegrador, 
                'Content-Type': 'application/json'
            },
            data : data
        };

        let ax = await axios(config)
        .then(async function (response) {
            // console.log(JSON.stringify(response.data));

             ////PARA ESCRIBIR EN TXT
            // let writeFile = util.promisify(fs.writeFile);
            // await writeFile('rspApiTocToc.txt', JSON.stringify(response.data) ); 

            let data = response.data;
            //let resp = await insertDataResponse_TocToc(data);
            return {
                status: data.success,
                message:data.message,
                data:data.data,
                code:data.code
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
            message : ax.message,
            data:ax.data,
            code :ax.code
        }


    } catch (error) {

        return {
            status : false,
            message : error.message        
        }
        
    }
}


// CREAR FUNCION PARA GIARDAR EL RESPONSE
/**
 * ### Guarda el response de toctoc,
 * @param {* Respuesta de API toc toc} xObj 
 * @returns 
 */
async function insertDataResponse_TocToc(xObj)
{
    try {
        
        if(xObj)
        {
            let rspSaveResponse = await responsetoctocModel.create(xObj);

            return {
                status: true,
                message:'insertDataResponse_TocToc -> Correcto !!',
                
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataResponse_TocToc -> No existen registros para insertar'
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
 * 
 * @param {* Publicacion con error, } xObj 
 *  ## Guarda las publicaciones que no fueron publicadas correctamente, 
 */
async function insertDataResponse_Error_TocToc(xObj)
{
    try {
        
        if(xObj)
        {
            let rspSaveResponse = await responsetoctocErrorModel.create(xObj);

            return {
                status: true,
                message:'insertDataResponseError_TocToc -> Correcto !!',
                
            }
        }
        else
        {
            return {
                status: false,
                message:'insertDataResponseError_TocToc -> No existen registros para insertar'
            }
        }
        
    } catch (error) {

        console.log('Error : insertDataResponse_Error_TocToc() : insertDataHost :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



/**
 * ## Para eliminar las publicaciones en TOC TOC 
 */
async function eliminaPublicados_TocToc()
{
    try {

        let rspPublicados = await responsetoctocModel.find({});
        // console.log('rspPublicados::',rspPublicados);
        for(let row in rspPublicados)
        {
            let rspDel = await deletePublicacion_TocToc(rspPublicados[row].idpublicacion);
            console.log('rspPublicados[row].idpublicacion::',rspPublicados[row].idpublicacion ,' pppp:',rspDel);
            
        }

        return {
            status : true,            
            message : 'eliminaPublicados_TocToc -> Correcto !'
        }

    } catch (error) {

        console.log('Error: eliminaPublicados_TocToc :', error.message);
        return {
            status: false,
            message : error.message
        }
    }
    
}


/**
 *  ## Despublica todas las propiedades en TOC TOC 
 * @returns 
 */
async function deletePublicacion_TocToc(xIdPublicacion)
{
    try {

        let hoy = new Date();
        let dd = hoy.getDate();
        let mm = hoy.getMonth() + 1;
        let yyyy = hoy.getFullYear();            
        let fc = `${dd}-${(mm < 10) ? '0'+mm : mm}-${yyyy}`;
        let commentTocToc = ` ${fc} - Elimina Publicación Montalva Quindos`;
        
        let vKeyCliente = '36b2eb88-9887-47e9-a4b5-63e2f85ecf9c';
        let vKeyIntegrador = 'b83158a3-b107-4c5a-b0f7-c4c16bb0d8df';
        let urlPushs = 'https://api.toctoc.com';

        if(xIdPublicacion)
        {
            let data = JSON.stringify({
                "integratorPropertyID": xIdPublicacion,
                "integratorSalesAssociateID": "1318",
                "comment": commentTocToc
              });

              console.log('Info para despublicar:',data);
              
              let config = {
                    method: 'delete',
                    maxBodyLength: Infinity,
                    url: `https://api.toctoc.com/api/v1/private/publish/used`,                    
                    headers: { 
                        'KeyCliente': vKeyCliente, 
                        'KeyIntegrador': vKeyIntegrador, 
                        'Content-Type': 'application/json'
                    },
                    data : data
                };
              
             let ax = await axios(config)
                .then(async function (response) {
                    // console.log(JSON.stringify(response.data));

                    ////PARA ESCRIBIR EN TXT
                    // let writeFile = util.promisify(fs.writeFile);
                    // await writeFile('rspApiTocToc.txt', JSON.stringify(response.data) ); 

                    let data = response.data;
                    //let resp = await insertDataResponse_TocToc(data);
                    return {
                        status: data.success,
                        message:data.message,                        
                        code:data.code
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
                message : ax.message,                
                code :ax.code
            }

        }
        else
        {
            return {
                status: false,
                message:'deletePublicacion_TocToc -> Sin registros para eliminar...'
            }
        }
        
    } catch (error) {

        console.log('Error : deletePublicacion_TocToc :', error.message);
        return {
            status: false,
            message : error.message
        }

    }
}



module.exports = {
    main_PublicacionTOCTOC,
    eliminaPublicados_TocToc
}