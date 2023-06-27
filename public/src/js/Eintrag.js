"use-strict";

class Eintrag{
    constructor(list){
        this.list = list;
    }

    /**
     * 
     * @param {Neue Daten aus dem Submit-Event} neuer_Eintrag 
     * Push einen neuen Eintrag, wenn die List nicht neuer_Eintrag mit den selben Datum enthält
     */
    neue_liste = function(neuer_Eintrag){
        let wahr = false;
        for(let element of this.list){
            if (Object.values(element).includes(neuer_Eintrag.datum)){
                alert(`Zu diesem Datum: '${neuer_Eintrag.datum}' gibt es bereits einen Eintrag!`);
                wahr = true;
                break;
            }
        }
        if(!wahr){
            this.list.push(neuer_Eintrag);
        }
    }

    /**
     * 
     * @param {Ein Eintrag aus der List} element 
     * @returns gibt die Html-Srucktur zurück
     */
    html_generieren = function(element){
        const html = 
        `
        <div class="eintrag_container">
            <span class="datum">${element.datum}</span>
            <button timestamp ="${element.timestamp}">Löschen</button>
            <p>
                ${element.data}
            </p>
        </div>
        `;

        return html;
    }

    //löscht zunächt alle einträge und zeigt alle einträge erneut an plus neue dazugekommen einträge
    eintrag_anzeigen = function(){
        document.querySelectorAll("#alle_container > .eintrag_container").forEach(element => element.remove());
        for(const element of this.list){
            document.querySelector("#alle_container").insertAdjacentHTML("beforeend", this.html_generieren(element));
        }
        löschen();
    };

    ausgabe = function(){
        console.log(this.list);
    }

    //löscht einen eintrag aus der List
    eintrag_löschen(timestamp){
        for (let i = 0; i< this.list.length; i++){
            if(this.list[i].timestamp == timestamp){
                this.list.splice(i, 1);
            }
        }
    }
}