document.addEventListener("DOMContentLoaded", function() {
    // Caminho para o arquivo CSV dentro do diretório do programa
    const filePath = './arquivosCSV/athlete_events.csv';
  
    // Função para carregar e processar o arquivo CSV
    function processCSV() {
        fetch(filePath) // Faz uma requisição GET para o arquivo CSV, ou seja, busca o arquivo no servidor e retorna uma Promise com a resposta
            .then(response => response.text()) // O metodo then é chamado quando a Promise é resolvida, e retorna o conteúdo do arquivo CSV como texto
            .then(data => { // O conteúdo do arquivo é passado como argumento para a função
                const linhas = data.split(/\r?\n/);// Separar linhas usando expressão regular para incluir \r
  
                const novaLinha = linhas.map(linha => { // map para processar cada linha do CSV
                    const linhaLimpa = linha.replace(/[";]/g, '');
                    const csv = linhaLimpa.split(',') // separa a linha em um array de strings
                    const cleanedCsv = csv.map(attribute => {// map para limpar cada atributo do CSV, removendo as aspas duplas, pontos e vírgulas
                        return !isNaN(attribute) ? parseFloat(attribute) : attribute; // transforma em número se for numérico
                    });
                    const [ID, Name, Sex, Age, Height, Weight, Team, NOC, Games, Year, Season, City, Sport, Event, Medal] = cleanedCsv; // atribui cada valor do array a uma variável
                    const ultimoIndice = cleanedCsv.length;
                    if(ultimoIndice > 15) {
                      const eventIndex = 13;
                      const lastEventIndex = cleanedCsv.findIndex((item, index) => index > eventIndex && item === 'Medal') - 1; // Encontrar o índice do último elemento de Event
                      const eventValue = cleanedCsv.slice(eventIndex, lastEventIndex + 1).join(','); // Concatenar os elementos de Event
                      return {ID: ID, Name: Name, Sex: Sex, Age: Age, Height: Height, Weight: Weight, Team: Team, NOC: NOC, Games: Games, Year: Year, Season: Season, City: City, Sport: Sport, Event: eventValue, Medal: cleanedCsv[ultimoIndice - 1] };
                    }else{
                        return {ID: ID, Name: Name, Sex: Sex, Age: Age, Height: Height, Weight: Weight, Team: Team, NOC: NOC, Games: Games, Year: Year, Season: Season, City: City, Sport: Sport, Event: Event, Medal: Medal };
                      }
  
                });
                console.log(novaLinha)
                //mostraResultado(registros);
            })
            .catch(error => {
                console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
            });
    }
    // Chamar a função para processar o arquivo CSV quando a página for carregada
    processCSV();
  });
  