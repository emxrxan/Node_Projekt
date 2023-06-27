"use-strict";

const exrpress = require('express');
const app = exrpress();
const DataStore = require('nedb');
const allData = new DataStore('data.db');

allData.loadDatabase();

app.listen(3000, 'localhost', ()=>{console.log("listen at Port 3000")});
app.use(exrpress.static('public'));
app.use(exrpress.json({limit: '10mb'}));

app.get('/api', (request, response)=>{
    allData.find({},(error, data)=>{
        if(error){
            console.log(error);
            response.end();
        } else {
            response.json(data);
        }
    });
});

app.post('/api', (request, response)=>{
    console.log("I got a REQUEST ...");
    const data = request.body;

    if (Object.values(data).includes("löschen")){
        console.log("löschen");
        allData.remove({timestamp:parseInt(data.timestamp)}, { multi: false }, function (err, numRemoved) {});
    }else{
        const timestamp = Date.now();
        data.timestamp = timestamp;
        allData.find({datum: data.datum}, function(error, store){
            if(store.length < 1){
                allData.insert(data);
            }
        });
        response.json(data);
    }
});