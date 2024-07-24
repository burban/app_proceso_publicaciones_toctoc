'use strict';

const nodeoutlook = require('nodemailer');
const configmail = require('../configmail');

const transporter = nodeoutlook.createTransport({
    host: configmail.hostmail,
    port: configmail.portmail,
    secure: false,
    auth: {
        user: configmail.usermail,
        pass: configmail.passmail
    },
    tls: {
		rejectUnauthorized: false
	}
});


/**
 * 
 * @param {* Json con Nombre y ruta de los archivos a Adjuntar.} attach 
 * @returns 
 */
async function sendMail(attach,xsuccess,xfails) {
    try {        
        
        if(attach.length > 0)
        {        

            let stable = '';

            for(let row in attach) {

                stable += ` 
                    <tr>
                        <td style="padding: 4px 8px;border-left: 1px solid rgba(0,0,0,0.2);border-right: 1px solid rgba(0,0,0,0.2);">
                            ${attach[row].idprop}
                        </td> 
                        <td style="padding: 4px 8px;border-left: 1px solid rgba(0,0,0,0.2);border-right: 1px solid rgba(0,0,0,0.2);">
                            ${attach[row].title}
                        </td>
                    </tr> ` ;

            }


            let rs = await transporter.sendMail({
                from: configmail.usermail,
                to: configmail.mailto,
                cc:configmail.mailcc,
                subject: 'Publicaciones - TOC TOC',
                html:  `<!doctype html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <p>Estimados,<br>
                            Publicaciones con error al intentar enviar a TOC TOC - API
                            <br>
                            <p><b> Correctos : ${xsuccess} </b></p>
                            <p><b> Con Error : ${xfails} </b></p>

                            <p>Detalle: <br></p>

                            <table style="border-collapse: collapse;">
                                <thead>
                                <tr>
                                    <th style="padding: 4px 8px;border-bottom: 1px solid #000000;border-left: 1px solid rgba(0,0,0,0.2);border-right: 1px solid rgba(0,0,0,0.2);">
                                        Cod. Publicación
                                    </th>
                                    <th style="padding: 4px 8px;border-bottom: 1px solid #000000;border-left: 1px solid rgba(0,0,0,0.2);border-right: 1px solid rgba(0,0,0,0.2);">
                                        Título
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                    ${stable}
                                </tbody>
                            </table>

                            
                            <p>Saludos,</p>

                        </body>
                        </html>
                `
            });

            return {
                status : true,
                message : 'ok'
            }
        }
        else
        {
            return {
                status : false,
                message : 'No existen archivos para enviar...'
            }
        }

    } catch (error) {

        return {
            status : false,
            message : error.message
        }

    }
}


module.exports = {

    sendMail

}