
document.addEventListener("DOMContentLoaded",  () => {
    // Caminho para o arquivo CSV dentro do diretório do programa
    const filePath = './arquivosCSV/athlete_events.csv';
    // Função para carregar e processar o arquivo CSV
    const processCSV = () => {
        fetch(filePath) // Faz uma requisição GET para o arquivo CSV, ou seja, busca o arquivo no servidor e retorna uma Promise com a resposta
            .then(response => response.text()) // O metodo then é chamado quando a Promise é resolvida, e retorna o conteúdo do arquivo CSV como texto
            .then(data => { // O conteúdo do arquivo é passado como argumento para a função
                const linhas = data.split(/\r?\n/);// Separar linhas usando expressão regular para incluir \r

                const novasLinhas = linhas.map(linha => { // map para processar cada linha do CSV
                    const linhaLimpa = linha.replace(/[";]/g, '');
                    const csv = linhaLimpa.split(',') // separa a linha em um array de strings
                    const cleanedCsv = csv.map(attribute => {// map para limpar cada atributo do CSV, removendo as aspas duplas, pontos e vírgulas
                        return !isNaN(attribute) ? parseFloat(attribute) : attribute; // transforma em número se for numérico
                    });
                    const [ID, Name, Sex, Age, Height, Weight, Team, NOC, Games, Year, Season, City, Sport, Event, Medal] = cleanedCsv; // atribui cada valor do array a uma variável
                    const ultimoIndice = cleanedCsv.length; // Encontrar o índice do último elemento do array
                    if (ultimoIndice > 15) { // Se o array tiver mais de 15 elementos, concatenar os elementos de Event
                        const eventIndex = 13; // Encontrar o índice do elemento Event
                        const lastEventIndex = cleanedCsv.indexOf('Medal', eventIndex + 1) - 1; // Encontrar o índice do último elemento de Event
                        const eventValue = cleanedCsv.slice(eventIndex, lastEventIndex + 1).join(','); // Concatenar os elementos de Event
                        return { ID: ID, Name: Name, Sex: Sex, Age: Age, Height: Height, Weight: Weight, Team: Team, NOC: NOC, Games: Games, Year: Year, Season: Season, City: City, Sport: Sport, Event: eventValue, Medal: cleanedCsv[ultimoIndice - 1] };
                    } else { // Se o array tiver 15 elementos, retornar os valores normais
                        return { ID: ID, Name: Name, Sex: Sex, Age: Age, Height: Height, Weight: Weight, Team: Team, NOC: NOC, Games: Games, Year: Year, Season: Season, City: City, Sport: Sport, Event: Event, Medal: Medal };
                    }

                });
                ManipulaDadosOlimpiadas(novasLinhas); // Chama a função para manipular os dados do arquivo CSV
            })
            .catch(error => { // O método catch é chamado quando a Promise é rejeitada, e retorna um erro
                console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
            });
    }
    // Chamar a função para processar o arquivo CSV quando a página for carregada
    processCSV(); // Chama a função para processar o arquivo CSV
});

    const filtraPrimeiraMulherMedalhaEsporte = (novasLinhas) => (medalha) => (esporte) => {
        const mulheresMedalhas = novasLinhas.filter(atleta => atleta.Sex === 'F' && atleta.Medal == medalha && atleta.Sport === esporte)
        .reduce((acc, atleta) => { // Faz um reduce para encontrar a atleta mais antiga
            if (!acc || acc.Year > atleta.Year) {// Se o ano da atleta for maior que o ano do acumulador, retorna a atleta, ou seja a mais antiga
                return atleta;
            } else { 
                return acc; // Se não, retorna o acumulador, até encontrar a atleta mais antiga
            }
        }, null);
        return console.log(mulheresMedalhas); // Imprimi o resultado da atleta mais antiga
    }

    const ManipulaDadosOlimpiadas = (novasLinhas) => {
        return filtraPrimeiraMulherMedalhaEsporte(novasLinhas)('Gold')('Diving'); // Filtra as mulheres que ganharam medalhas de ouro no esporte de mergulho, 1º questão
    }