const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Route pour servir la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Lecture des données JSON
// app.get('script/config', (req, res) => {
//     const configPath = path.join(__dirname, 'config.json');
//     console.log('Chemin du fichier config:', configPath);  // Ajout du log

//     fs.readFile(configPath, 'utf8', (err, data) => {
//         if (err) {
//             return res.status(500).send('Erreur lors de la lecture du fichier de configuration.');
//         }
//         res.json(JSON.parse(data)); // Retourner les données JSON
//     });
// });

// Fonction pour obtenir les fichiers dans un sous-dossier donné
function getFilesFromSubfolder(subfolder, callback) {
    const folderPath = path.join(__dirname, 'cour', subfolder);
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, files);
    });
}

// Route dynamique pour récupérer les fichiers d'un sous-dossier
app.get('/files/:subfolder', (req, res) => {
    const subfolder = req.params.subfolder;
    getFilesFromSubfolder(subfolder, (err, files) => {
        if (err) {
            return res.status(500).send('Erreur lors de la lecture des fichiers.');
        }
        res.json(files); // Envoyer la liste des fichiers sous forme de JSON
    });
});

// Route pour afficher la page HTML spécifique
app.get('/pages/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, 'pages', `${page}.html`)); // Par exemple, /pages/r101 affiche r101.html
});

app.listen(port, () => {
    console.log(`Serveur ON sur http://localhost:${port}`);
});
