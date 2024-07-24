
'use strict';
const mongoose = require('mongoose');

const publicacionControllers = require('./controllers/publicacion.controllers');
const tiposControllers = require('./controllers/tipos.controllers');
const toctocPublicacionControllers = require('./controllers/toctocpublicacion.controllers');

try {

    mongoose.connect(`mongodb://192.168.1.26:27017/mq_publicaciones`);

} catch (error) {
    console.log('tipos.controllers error:: ',error);
}

async function main() {

    //######################
    // ####  TIPOS
    //######################

    console.log('Get tipo propiedades');
    let rspTipoProp = await tiposControllers.getTipoPropFromTocToc();
    console.log('rspTipoProp::',rspTipoProp);

    console.log('Get tipo operacion');
    let rspTipoOper = await tiposControllers.getTipoOperFromTocToc();
    console.log('rspTipoOper::',rspTipoOper);
    
    console.log('Get comunas');
    let rspComuna = await tiposControllers.getComunaFromTocToc();
    console.log('rspComuna::',rspComuna);

    console.log('Get tipo monedas');
    let rspMoneda = await tiposControllers.getMonedaFromTocToc();
    console.log('rspMoneda::',rspMoneda);

    console.log('Get tipo orientacion');
    let rspOrientacion = await tiposControllers.getOrientacionFromTocToc();
    console.log('rspOrientacion::',rspOrientacion);

    // //######################
    // // ####  PUBLICACIONES
    // //######################

    console.log('Get Publicaciones www.mq.cl');
    let respHost = await publicacionControllers.getPublicacionsFromHost();    

    if(respHost.status)
    {
        let resp = await publicacionControllers.getPublicaciones();

        console.log('Enviando publicaciones a Toc Toc');
        let rspTocToc = await toctocPublicacionControllers.main_PublicacionTOCTOC(resp.data);
        console.log('Enviando publicaciones a Toc Toc::',rspTocToc);
    }
    else
    {
        console.log('Problemas al obtener las propiedades desde www.mq.cl : ',respHost);
    }

    

    //  let rspsa =  await toctocPublicacionControllers.eliminaPublicados_TocToc();
    //  console.log('rspsa::',rspsa); 
    
    
    console.log('Terminamos ejecucion!!');
    process.exit(1);

}


main();






