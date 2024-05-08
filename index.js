import express from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import _ from 'lodash';
import chalk from 'chalk';

const app = express(); //middleware
const PORT = process.env.PORT || 3000;
let usuariosRegistrados = [];

//ejercicio axios para recordar:
//axios
//   .get("https://rickandmortyapi.com/api/character/1")
//   .then((data) => {
//       const name = data.data.name; console.log(name)
//       const gender = data.data.gender; console.log(gender)
//   })
//   .catch((e) => {
//       console.log(e)
//   })

app.get('/registrar-usuario', async (req, res) => {
    try {
        //Solicitud a la API Randomuser:
        const response = await axios.get('https://randomuser.me/api/');
        const userData = response.data.results[0];
        const userId = uuidv4();
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        userData.timestamp = timestamp;
        userData.id = userId;
        usuariosRegistrados.push(userData);

        res.json({
            id: userId,
            nombre: userData.name.first,
            apellido: userData.name.last,
            género: userData.gender,
            hora_Registro: timestamp
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta q consulta los usuarios registrados:
//app.get('/usuarios_por_genero', (req, res) => {
//    const usuariosPorSexo = _.groupBy(usuariosRegistrados, 'gender');
//Separados por género:
//    res.json(usuariosPorSexo);
//});

app.get('/usuarios_por_genero', (req, res) => {
    //Separando con _.partition de lodash:
    const [usuariosMasculinos, usuariosFemeninos] = _.partition(usuariosRegistrados, { gender: 'male' });
    //Usuarios separados:
    const usuariosFormateadosMasculinos = usuariosMasculinos.map(usuario => ({
        id: usuario.id,
        nombre: usuario.name.first,
        apellido: usuario.name.last,
        género: usuario.gender,
        hora_Registro: usuario.timestamp
    }));

    const usuariosFormateadosFemeninos = usuariosFemeninos.map(usuario => ({
        id: usuario.id,
        nombre: usuario.name.first,
        apellido: usuario.name.last,
        género: usuario.gender,
        hora_Registro: usuario.timestamp
    }));

    res.json({
        femeninos: usuariosFormateadosFemeninos,
        masculinos: usuariosFormateadosMasculinos
    });

    console.log(chalk.blue.bgWhite.bold('Femeninos:', JSON.stringify(usuariosFormateadosFemeninos, null, 2)));
    console.log(chalk.blue.bgWhite.bold('Masculinos:', JSON.stringify(usuariosFormateadosMasculinos, null, 2)));
});


app.get('/inicio', (req, res) => {
    res.send('hola mundo desde el servidor 3000');
});

app.listen(PORT, console.log(`🔥Server on 🔥 http://localhost:${PORT}`));