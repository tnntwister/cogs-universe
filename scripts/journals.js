export const createLaunchJournal = function (moduleId) {
    let journalEntry = game.journal.getName(moduleId); // Assurez-vous que MODULE_ID est bien défini

    if(journalEntry) {
        journalEntry.sheet.render(true);
    } else {
        let journalData = {
            name: moduleId, // Assurez-vous que MODULE_ID contient le nom que vous voulez donner à votre entrée de journal
            content: "<p>Contenu de l'entrée de journal</p>", // Remplacez par le contenu de votre entrée de journal
        };

        JournalEntry.create(journalData).then((journalEntry) => {
            // console.log("Entrée de journal créée");
        }).catch((error) => {
            console.log("Erreur lors de la création de l'entrée de journal", error);
        });
    }
}
  
    
