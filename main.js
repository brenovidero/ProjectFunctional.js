const readLine = require('readline');
const fs = require('fs');

const line = readLine.createInterface({
    input: fs.createReadStream('./arquivosCSV/athlete_events.csv'),
});

const registros = []; // Lista para armazenar os objetos de cada linha

line.on("line", (data) => {
    const csv = data.split(',');

    // Limpar cada atributo do CSV, removendo as aspas duplas, pontos e vírgulas
    const cleanedCsv = csv.map(attribute => {
        const cleanedAttribute = attribute.replace(/[";]/g, '');
        // Se o atributo for numérico, transforma em número
        return !isNaN(cleanedAttribute) ? parseFloat(cleanedAttribute) : cleanedAttribute;
    });

    // Criar um objeto com as propriedades especificadas e adicionar à lista
    const registro = {
        ID: cleanedCsv[0],
        Name: cleanedCsv[1],
        Sex: cleanedCsv[2],
        Age: cleanedCsv[3],
        Height: cleanedCsv[4],
        Weight: cleanedCsv[5],
        Team: cleanedCsv[6],
        NOC: cleanedCsv[7],
        Games: cleanedCsv[8],
        Year: cleanedCsv[9],
        Season: cleanedCsv[10],
        City: cleanedCsv[11],
        Sport: cleanedCsv[12],
        Event: cleanedCsv[13],
        Medal: cleanedCsv[14]
    };

    registros.push(registro);
});

// função que pega o resultado de uma função e escreve em um arquivo JSON
const mostraResultado = (registros) => {
    const dados = JSON.stringify(registros, null, 2);
    fs.writeFile('resultado.json', dados, (err) => {
        if (err) throw err;
        console.log('Resultado salvo em resultado.json');
    });
};

line.on("close", () => {
    mostraResultado(registros)
});


