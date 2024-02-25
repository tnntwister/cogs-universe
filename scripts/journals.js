export const createLaunchJournal = function (moduleId) {
    console.log('createLaunchJournal', moduleId);
    let journalEntry = game.journal.getName(moduleId); // Assurez-vous que MODULE_ID est bien défini

    if(journalEntry) {
        journalEntry.sheet.render(true);
    } else {
        console.log("journalEntry not found");
        let journalData = {
            name: moduleId, // Assurez-vous que MODULE_ID contient le nom que vous voulez donner à votre entrée de journal
            content: "<p>Contenu de l'entrée de journal</p>", // Remplacez par le contenu de votre entrée de journal
        };

        JournalEntry.create(journalData).then((journalEntry) => {
            console.log("Entrée de journal créée", journalEntry);
        }).catch((error) => {
            console.log("Erreur lors de la création de l'entrée de journal", error);
        });
    }
    // console.log(game.journal.getName(moduleId));    

}
  
    
