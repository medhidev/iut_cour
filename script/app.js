const courFolderId = '1BPRu2_p7-97SeFblvXEPgnGuwRmCt_Ue'; // l'ID du dossier "cour"
const apiKey = 'AIzaSyA9iP4e40wMljgbJe9YrN4QEltWzB8MJR0'; // Clé API

document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('fileList');
    const exoFicheList = document.getElementById('ExoFicheList');
    const exoSujetList = document.getElementById('ExoSujetList');
    const memoList = document.getElementById('MemoList');

    // Récupérer la valeur de subfolderName depuis la balise <meta>
    const metaElement = document.querySelector('meta[name="subfolder-name"]');
    const subfolderName = metaElement ? metaElement.getAttribute('content') : 'R101'; // Valeur par défaut si non trouvée

    // Fonction pour récupérer l'ID du sous-dossier par son nom
    function fetchSubfolderId(subfolderName) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${courFolderId}'+in+parents+and+name='${subfolderName}'+and+mimeType='application/vnd.google-apps.folder'&key=${apiKey}&fields=files(id, name)`;

        return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.files.length > 0) {
                return data.files[0].id; // Retourner l'ID du sous-dossier
            } else {
                throw new Error(`Sous-dossier ${subfolderName} introuvable`);
            }
        });
    }

    // Fonction pour lister les fichiers dans le sous-dossier
    function fetchFilesInSubfolder(subfolderId) {
        const url = `https://www.googleapis.com/drive/v3/files?q='${subfolderId}'+in+parents&key=${apiKey}&fields=files(id, name, mimeType)`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    fileList.innerHTML = ''; // Réinitialiser la liste des fichiers
                    data.files.forEach(file => {
                        const li = document.createElement('li');
                        const fileLink = document.createElement('a');

                        fileLink.textContent = file.name;
                        fileLink.href = `https://drive.google.com/uc?export=view&id=${file.id}`;
                        fileLink.target = '_blank'; // Ouvrir dans un nouvel onglet

                        li.appendChild(fileLink);

                        // Vérifier si le nom des fichiers
                        if (file.name.startsWith('Exo')) {
                            exoFicheList.appendChild(li); // Ajouter à la liste ExoFicheList
                        } else if (file.name.startsWith('Sujet')) {
                            exoSujetList.appendChild(li);
                        } else if (file.name.startsWith('Memo')) {
                            memoList.appendChild(li);
                        } else {
                            fileList.appendChild(li); // Ajouter à la liste générale fileList
                        }
                    });
                })
                .catch(error => console.error('Erreur lors de la récupération des fichiers:', error));
            }

        // Récupérer les fichiers du sous-dossier correspondant (ex: R101)
        fetchSubfolderId(subfolderName)
            .then(subfolderId => {
                fetchFilesInSubfolder(subfolderId); // Lister les fichiers du sous-dossier
            })
            .catch(error => console.error('Erreur:', error));
    });