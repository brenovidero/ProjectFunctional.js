
document.addEventListener("DOMContentLoaded",  () => {
    // Caminho para o arquivo CSV dentro do diretório do programa
    const filePath = './arquivosCSV/athlete_events.csv';
    // Função para carregar e processar o arquivo CSV
    const processCSV = () => {
        fetch(filePath) // Faz uma requisição GET para o arquivo CSV, ou seja, busca o arquivo no servidor e retorna uma Promise com a resposta
            .then(response => response.text()) // O metodo then é chamado quando a Promise é resolvida, e retorna o conteúdo do arquivo CSV como texto
            .then(csvLine => { // O conteúdo do arquivo é passado como argumento para a função
                 // Divide o CSV em linhas, utilizando o padrão de separação ";;;;;;;;;;;;;;;\n?"
    // Isso significa que o separador é uma linha que contém múltiplos ';' seguidos por um possível quebra de linha (\n)
    // O [h, ...rows] é uma técnica chamada "destructuring assignment" que divide o resultado da divisão do CSV em duas partes:
    // - h: a primeira linha (que contém o cabeçalho)
    // - rows: as linhas restantes (dados)
    const [h, ...rows] = csvLine.split(/;;;;;;;;;;;;;;;\n?/);
    
    // Converte o cabeçalho para letras minúsculas e remove aspas duplas
    const header = h
      .toLowerCase() // converte para minúsculas
      .split(",") // divide o cabeçalho em array, usando ',' como delimitador
      .map((x) => x.replace(/["]/g, "")); // remove aspas duplas de cada elemento do cabeçalho
  
    // Retorna um array contendo o cabeçalho e os dados processados
    const csvCleaned = [
      header, // cabeçalho
      // Para cada linha de dados:
      rows.slice(0, -1).map((x) => x
        // Divide a linha em array de campos, utilizando a expressão regular
        // /(?:,"|",(?=\w))/gi
        // Isso significa que o separador é ','
        // mas o match não consome o ','
        // apenas pega a ',' que é seguida por um caractere alfanumérico
        .split(/(?:,"|",(?=\w))/gi)
        // Para cada campo, ajusta-o conforme necessário
        .flatMap((y, i) => (i === 3 ? y.split(",") : y.replace(/["]/g, "")))
        // Reduz o array de campos para um objeto, utilizando o cabeçalho como chaves
        .reduce(
            (x, y, i) => {
              // Remove o caractere '\r\n' do atributo 'id'
              if (header[i] === 'id') {
                y = y.replace(/\r\n/g, '');
              }
              if(header[i] == 'age' || header[i] == 'height' || header[i] == 'weight' || header[i] == 'year' || header[i] == 'id'){
                y = parseInt(y);
              }
              // Condicional para retirar atributos
              if (header[i] !== 'event' && header[i] !== 'weight' && header[i] !== 'city' && header[i] !== 'games' && header[i] !== 'noc' && header[i] != 'season') {
                return {
                  ...x,
                  [header[i]]: y,
                };
              }
              return x;// Retorna o objeto x sem alterações
            },
            {}
          )
      ),
    ].slice(1);// Ignora a primeira linha do CSV, que contém os cabeçalhos das colunas;
            console.log(csvCleaned); // Exibe o conteúdo do arquivo CSV processado no console;
                ManipulaDadosOlimpiadas(csvCleaned); // Chama a função para manipular os dados do arquivo CSV;
            })
            .catch(error => { // O método catch é chamado quando a Promise é rejeitada, e retorna um erro
                console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
            });
    }
    // Chamar a função para processar o arquivo CSV quando a página for carregada
    processCSV(); // Chama a função para processar o arquivo CSV
});

// -- [Funções antigas] -------------------------

    // const pessoaMaisAlta = (novasLinhas) => { 
    //     const [primeiraLinha] = novasLinhas[0]; // Desestruturação para pegar a primeira linha do array
    //     const altura = novasLinhas[0].reduce((acc, atleta) => { // Faz um reduce para encontrar a pessoa mais alta do sexo feminino
    //         if (!acc || acc.height < atleta.height && atleta.height !== NaN && atleta.sex == 'M') {  // Se a altura do acumulador for menor que a altura do atleta e a altura do atleta não for uma string, retorna o atleta
    //             return atleta;
    //         } else {
    //             return acc;
    //         }
    //     }, primeiraLinha); // Iniciar o acumulador com o primeiro atleta
    //     return altura
    // }

    // const filtraPrimeiraMulherMedalhaEsporte = (novasLinhas) => (medalha) => (esporte) => {
    //     const mulheresMedalhas = novasLinhas[0].filter(atleta => atleta.sex === 'F' && atleta.medal == medalha && atleta.sport === esporte)
    //     .reduce((acc, atleta) => { // Faz um reduce para encontrar a atleta mais antiga
    //         if (!acc || acc.year > atleta.year) {// Se o ano da atleta for maior que o ano do acumulador, retorna a atleta, ou seja a mais antiga
    //             return atleta;
    //         } else { 
    //             return acc; // Se não, retorna o acumulador, até encontrar a atleta mais antiga
    //         }
    //     }, null);
    //     return mulheresMedalhas;
    // }

    // listarNomeDosAtletasSemRepetir = (lista) => {
    //     return lista[0].filter((elemento, indice) => {
    //         // Se for o primeiro elemento, ou se o elemento atual for diferente do anterior, mantenha-o
    //         if (indice == 0 || elemento.id != lista[0][indice - 1].id) {
    //             return true;
    //         }
    //         // Se o elemento atual for igual ao anterior, ignore-o (retorna false no filter)
    //         return false;
    //     });
    // };

 // --- [Função de manipulação de dados] -----------------------------------------------   

    const ManipulaDadosOlimpiadas = (novasLinhas) => {
    //    console.log(listarNomeDosAtletasSemRepetir(novasLinhas));
    //    console.log(pessoaMaisAlta(novasLinhas)); // Encontra a pessoa mais alta, 1º questão
    //     console.log(filtraPrimeiraMulherMedalhaEsporte(novasLinhas)('Bronze')('Football')); // Filtra as mulheres que ganharam medalhas de ouro no esporte de atletismo, 1º questão
    //    console.log(filtraPrimeiraMulherMedalhaEsporte(novasLinhas)('Gold')('Diving')); // Filtra as mulheres que ganharam medalhas de ouro no esporte de mergulho, 1º questão

    }