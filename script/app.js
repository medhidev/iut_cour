const courFolderId = '1BPRu2_p7-97SeFblvXEPgnGuwRmCt_Ue'; // l'ID du dossier "cour"
const apiKey = 'AIzaSyA9iP4e40wMljgbJe9YrN4QEltWzB8MJR0'; // Clé API

document.addEventListener('DOMContentLoaded', () => {

    // Zone d'affichage des Liste de fichiers
    // const SujetTDList = document.getElementById('SujetTDList');
    // const SujetTPList = document.getElementById('SujetTPList');

    const CMList = document.getElementById('CMList');
    const TDList = document.getElementById('TDList');
    const TPList = document.getElementById('TPList');

    // Nom des dossiers 
    // const metaElement = document.querySelector('meta[name="subfolder-name"]');
    // const subfolderCM = 'CM';
    const subfolderTD = 'TD';
    // const subfolderTP = 'TP';


    // Fonction pour récupérer l'ID du sous-dossier TP
    // A voir si on récupère pas directement l'id en brut :/
    function fetchSubfolderId(subfolderTD) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${courFolderId}'+in+parents+and+name='${subfolderTD}'+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id, name)`;

        return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.files.length > 0) {
                return data.files[0].id; // Retourner l'ID du sous-dossier
            } else {
                throw new Error(`Sous-dossier ${subfolderTD} introuvable`);
            }
        });
    }

    // A faire la même choses pour les autres sous dossier CM et TP

    // Fonction pour lister les fichiers dans le sous-dossier
    function fetchFilesInSubfolder(subfolderId) {
        const url = `https://www.googleapis.com/drive/v3/files?q="${subfolderId}"+in+parents&key=${apiKey}&fields=files(id, name, mimeType)`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    CMList.innerHTML = ''; // Réinitialiser la liste des fichiers
                    TDList.innerHTML = '';
                    TPList.innerHTML = '';

                    data.files.forEach(file => {
                        const li = document.createElement('li');
                        const fileLink = document.createElement('a');

                        fileLink.textContent = file.name;
                        fileLink.href = `https://drive.google.com/file/d/${file.id}/preview`; // Voir le PDF
                        fileLink.target = '_blank'; // Ouvrir dans un nouvel onglet

                        li.appendChild(fileLink);

                        // Vérifier si le nom des fichiers
                        if (file.name.startsWith('CM')) {
                            CMList.appendChild(li);
                        } else if (file.name.startsWith('TD')) {
                            TDList.appendChild(li);
                        } else if (file.name.startsWith('TP')) {
                            TPList.appendChild(li);
                        } else if (file.name.startsWith('Memo')) {
                            CMList.appendChild(li);
                        } else {
                            TDList.appendChild(li); // Valeur par défaut
                        }
                    });
                })
                .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));
            }

        // Récupérer les fichiers du sous-dossier correspondant (ex: R101)
        fetchSubfolderId(subfolderTD)
            .then(subfolderId => {
                fetchFilesInSubfolder(subfolderId); // Lister les fichiers du sous-dossier
            })
            .catch(error => console.error('Erreur:', error));
    });