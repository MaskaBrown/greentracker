// api/get-handicap.js
const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
    const { nombre, ap1, ap2 } = req.query;
    if (!nombre || !ap1 || !ap2) {
        return res.status(400).json({ error: "Faltan parámetros: nombre, ap1, ap2" });
    }

    const url = `https://rfegolf.es/PaginasServicios/ServicioHandicap.aspx?HNom=${nombre}&HAp1=${ap1}&HAp2=${ap2}`;

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Estos IDs son los estándares de la RFEG para esta consulta
        const handicap = $('#ContentPlaceHolder1_lblHandicap').text().trim();
        const licencia = $('#ContentPlaceHolder1_lblLicencia').text().trim();
        const estado = $('#ContentPlaceHolder1_lblEstado').text().trim();

        res.status(200).json({ handicap, licencia, estado });
    } catch (error) {
        res.status(500).json({ error: "Error al conectar con la RFEG" });
    }
}
