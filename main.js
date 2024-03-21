const readLine = require('readline');
const fs = require('fs');

// Cria uma interface de leitura para o arquivo CSV
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

    const [ID, Name, Sex, Age, Height, Weight, Team, NOC, Games, Year, Season, City, Sport, Event, Medal] = cleanedCsv;

    // Criar um objeto com as propriedades especificadas e adicionar à lista
    // A condicional pode ser alterada para filtrar os resultados
    if(NOC == "BRA" && Medal != "NA"){
        const registro = {
            ID: ID,
            Name: Name,
            Sex: Sex,
            Age: Age,
            Height: Height,
            Weight: Weight,
            Team: Team,
            NOC: NOC,
            Games: Games,
            Year: Year,
            Season: Season,
            City: City,
            Sport: Sport,
            Event: Event,
            Medal: Medal
        };
        registros.push(registro);
    }

});

// função que pega o resultado de uma função e escreve em um arquivo JSON
const mostraResultado = (registros) => {
    const dados = JSON.stringify(registros, null, 2);
    fs.writeFile('resultado.json', dados, (err) => {
        if (err) throw err;
        console.log('Resultado salvo em resultado.json');
    });
};

// Quando terminar de ler o arquivo, chama a função que escreve o resultado
line.on("close", () => {
    mostraResultado(registros)
});


