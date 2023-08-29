
async function run_wasm() {
    // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`
    // `wasm_bindgen` was imported in `index.html`
    await wasm_bindgen('./pkg/demoparser2_bg.wasm');

    // Create a worker in JS. The worker also uses Rust functions
    var myWorker = new Worker('./worker.js');

    document.getElementById("file_picker").addEventListener(
        "change",
        function () {

            let file = this.files[0];
            var startTime = performance.now()

            myWorker.postMessage({ file: file});
            myWorker.onmessage = function (e) {
                var endTime = performance.now()
                console.log(`Parsing took: ${(endTime - startTime) / 1000} seconds`)
                generateTableFromData(e.data)
            };
        },
        false
    );
}

function generateTableFromData(events) {

    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");
    console.log(events)
    tbl.appendChild(tblBody);
    document.body.appendChild(tbl);
    tbl.setAttribute("border", "2");

    var table = document.createElement("TABLE");  //makes a table element for the page
    var wantedColumns = ["steamid", "item_name", "skin_name", "custom_name", "item_id", "rarity", "quality", "paint_seed", "paint_wear"]

    for (var i = 0; i < events.length; i++) {
        var row = table.insertRow(i);
        for (const [index, element] of wantedColumns.entries()) {
            row.insertCell(index).innerHTML = events[i][element];
        }
    }

    var header = table.createTHead();
    var headerRow = header.insertRow(0);
    for (var i = 0; i < wantedColumns.length; i++) {
        headerRow.insertCell(i).innerHTML = wantedColumns[i];
    }
    document.body.append(table);
}

run_wasm();
