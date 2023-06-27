"use-strict";

//neue Tagebuch Klasse 
const Tagebuch = new Eintrag([]);

/**
 * Holt die Timestamp aus dem button attribute und sende weiter an die Klasse Tagebuch
 * und sendet auch an den Server wo die Daten aus der Datenbank gelöscht werden sollen
 */
const löschen = function(){
    let timestamp;
    document.querySelectorAll(".eintrag_container > button").forEach(button => {
        button.addEventListener("click", async (data) => {
            timestamp = button.getAttribute("timestamp");
            Tagebuch.eintrag_löschen(timestamp);
            Tagebuch.eintrag_anzeigen();
            // Tagebuch.ausgabe();
            await fetch('/api', daten_eintrag(timestamp, "löschen"));
        });
    });
}

/**
 * 
 * @param {Daten an den Server abgeshcickt werden z.b datum, eintrag} data 
 * @param {gibt die jeweiliger action an hinzufügen oder löschen} action 
 * @returns gibt das gesamt packet als Objekt zurück
 */
const daten_eintrag = function(data, action){
    let eintrag ; 
    switch(action){
        case "hinzufügen":  eintrag = {datum: data.target.elements.datum.valueAsDate, eintrag: data.target.elements.eintrag.value};
                            break;
        case "löschen":     eintrag = {timestamp: data, action:"löschen"};
                            break;
        default:            alert("Es ist ein Fehler aufgetreten!"); break;
    }

    return {
        method: 'POST',
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(eintrag),
    }
}

/**
 * 
 * @param {Daten aus dem Submit-Event} neu_eintrag 
 * Sendet an die Klasse Tagebuch neue Einträge
 * Sendet an den Server neuen Eintrag
 */
const senden = async function(neu_eintrag){
    try{
        const response = await fetch('/api', daten_eintrag(neu_eintrag, "hinzufügen"));
        const daten = await response.json();
        const option = {year: 'numeric', month: 'long', day: '2-digit'};
        Tagebuch.neue_liste({
            datum: new Date(daten.datum).toLocaleDateString('de-DE',option),
            data: daten.eintrag,
            timestamp: daten.timestamp
        });
        Tagebuch.eintrag_anzeigen();
        //console.log(daten);
    } catch(error){
        alert("Es ist ein Fehler aufgetreten!");
    }
}

/**
 * Holt alle bisherigen Einträge aus den Server
 * Wiederherstellt die Daten und zeigt diese an
 */
const hole_eintrag = async function(){
    try{
        const response = await fetch('/api');
        const data = await response.json();
        const option = {year: 'numeric', month: 'long', day: '2-digit'};

        for(liste of data){

            Tagebuch.neue_liste({
                    datum: new Date(liste.datum).toLocaleDateString('de-DE',option),
                    data: liste.eintrag,
                    timestamp: liste.timestamp
                }
            );
        }
        Tagebuch.eintrag_anzeigen();
    } catch(error){
        alert("Es ist ein Fehler aufgetreten!")
    }
}

hole_eintrag();

//Holt die Daten aus dem Submit-Event
document.querySelector("#formular").addEventListener("submit", (data)=>{
    data.preventDefault();
    senden(data);
    data.target.reset();
});