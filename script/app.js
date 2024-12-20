const courFolderId = '1BPRu2_p7-97SeFblvXEPgnGuwRmCt_Ue'; // l'ID du dossier "cour"
const apiKey = 'AIzaSyA9iP4e40wMljgbJe9YrN4QEltWzB8MJR0'; // Clé API

// Charger les données JSON
// fetch('./config.json')
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(`Erreur HTTP : ${response.status}`);
//         }
//         return response.json(); // Convertir la réponse en objet JSON
//     })
//     .then(data => {
//         // Accéder aux propriétés du JSON
//         const apiKey = data.apiKey;
//         const courFolderId = data.courFolderId;
//     })
//     .catch(error => {
//         console.error('Erreur lors du chargement de config.json:', error);
//     });

document.addEventListener('DOMContentLoaded', () => {

    // Zone d'affichage des Liste de fichiers
    // const SujetTDList = document.getElementById('SujetTDList');
    // const SujetTPList = document.getElementById('SujetTPList');

    const CMList = document.getElementById('CMList');
    const TDList = document.getElementById('TDList');
    const TPList = document.getElementById('TPList');

    // Nom des dossiers 
    // const metaElement = document.querySelector('meta[name="subfolder-name"]');
    const subfolderCM = 'CM';
    const subfolderTD = 'TD';
    const subfolderTP = 'TP';

    // Afficher les éléments dans la bonne matière
    const metaElement = document.querySelector('meta[name="subfolder-name"]');
    const matiere = metaElement ? metaElement.getAttribute('content') : 'algo'; // Valeur par défaut

    // Fonction pour récupérer l'ID du sous-dossier TP
    // A voir si on récupère pas directement l'id en brut :/
    function fetchSubfolderId(subfolder) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${courFolderId}'+in+parents+and+name='${subfolder}'+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id, name)`;

        return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.files.length > 0) {
                return data.files[0].id; // Retourner l'ID du sous-dossier
            } else {
                throw new Error(`Sous-dossier ${subfolder} introuvable`);
            }
        });
    }

    // Fonction pour lister les fichiers dans un dossier par rapport à l'ID du dossier et le type de cour
    function fetchFilesInSubfolder(subfolderId, listType) {
        const url = `https://www.googleapis.com/drive/v3/files?q="${subfolderId}"+in+parents&key=${apiKey}&fields=files(id, name, mimeType)`;

            fetch(url)
                .then(response => response.json())
                .then(data => {

                    // Vérifie le type de cour
                    let listElement;
                    if (listType === 'CM') {
                        listElement = CMList;
                    } else if (listType === 'TD') {
                        listElement = TDList;
                    } else if (listType === 'TP') {
                        listElement = TPList;
                    }

                    data.files.forEach(file => {
                        const li = document.createElement('li');
                        const fileLink = document.createElement('a');

                        fileLink.textContent = file.name;
                        fileLink.href = `https://drive.google.com/file/d/${file.id}/preview`; // Voir le PDF
                        fileLink.target = '_blank'; // Ouvrir dans un nouvel onglet

                        li.appendChild(fileLink);

                        // Vérification de la matière (traitement dynamique)
                        if (file.name.includes(`[${matiere}]`)) {
                            // Vérification du Type
                            if (file.name.startsWith('CM')) {
                                CMList.appendChild(li);
                            } else if (file.name.startsWith('TD')) {
                                TDList.appendChild(li);
                            } else if (file.name.startsWith('TP')) {
                                TPList.appendChild(li);
                            } else if (file.name.startsWith('Memo')) {
                                CMList.appendChild(li);
                            } else {
                                TDList.appendChild(li); // Valeur par défaut dans TD
                            }
                        }
                    });
                })
                .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));
            }

        // Appelle des fonctions
        fetchSubfolderId(subfolderCM)
            .then(subfolderId => {
                fetchFilesInSubfolder(subfolderId, 'CM'); // Lister les fichiers du sous-dossier CM
            })
            .catch(error => console.error('Erreur:', error));
        
        fetchSubfolderId(subfolderTD) // récupère l'ID
            .then(subfolderId => {
                fetchFilesInSubfolder(subfolderId, 'TD'); // Lister les fichiers du sous-dossier TD
            })
            .catch(error => console.error('Erreur:', error));
        
        fetchSubfolderId(subfolderTP)
            .then(subfolderId => {
                fetchFilesInSubfolder(subfolderId, 'TP'); // Lister les fichiers du sous-dossier TP
            })
            .catch(error => console.error('Erreur:', error));
    });