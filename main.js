
// Caminho para o arquivo CSV dentro do diretório do programa
const filePath = './arquivosCSV/athlete_events.csv';
// Função para carregar e processar o arquivo CSV
const processarCSV = () => {
  fetch(filePath) // Faz uma requisição GET para o arquivo CSV, ou seja, busca o arquivo no servidor e retorna uma Promise com a resposta
    .then(response => response.text()) // O método then é chamado quando a Promise é resolvida, e retorna o conteúdo do arquivo CSV como texto
    .then(csvLinha => { // O conteúdo do arquivo é passado como argumento para a função
      // Divide o CSV em linhas, utilizando o padrão de separação ";;;;;;;;;;;;;;;\n?"
      // Isso significa que o separador é uma linha que contém múltiplos ';' seguidos por um possível quebra de linha (\n)
      // O [cabecalho, ...linhas] é uma técnica chamada "destructuring assignment" que divide o resultado da divisão do CSV em duas partes:
      // - cabecalho: a primeira linha (que contém o cabeçalho)
      // - linhas: as linhas restantes (dados)
      const [cabecalho, ...linhas] = csvLinha.split(/;;;;;;;;;;;;;;;\n?/);

      // Converte o cabeçalho para letras minúsculas e remove aspas duplas
      const cabecalhoFormatado = cabecalho
        .toLowerCase() // converte para minúsculas
        .split(",") // divide o cabeçalho em array, usando ',' como delimitador
        .map((elemento) => elemento.replace(/["]/g, "")); // remove aspas duplas de cada elemento do cabeçalho

      // Retorna um array contendo o cabeçalho e os dados processados
      const csvLimpo = [
        cabecalhoFormatado, // cabeçalho
        // Para cada linha de dados:
        linhas.slice(0, -1)
          .filter((linha) => linha.indexOf('Basketball') != -1) // Filtra as linhas que contém a palavra 'Basquete'
          .map((linha) => linha
            // Divide a linha em array de campos, utilizando a expressão regular
            // /(?:,"|",(?=\w))/gi
            // Isso significa que o separador é ','
            // mas o match não consome o ','
            // apenas pega a ',' que é seguida por um caractere alfanumérico
            .split(/(?:,"|",(?=\w))/gi)
            // Para cada campo, ajusta-o conforme necessário
            .flatMap((elemento, indice) => (indice == 3 ? elemento.split(",") : elemento.replace(/["]/g, ""))) // O flatMap vai transformar um array de arrays em um array simples

            // Reduz o array de campos para um objeto, utilizando o cabeçalho como chaves
            .reduce(
              (acumulador, elemento, indice) => {
                // Remove o caractere '\r\n' do atributo 'id'
                if (cabecalhoFormatado[indice] == 'id') {
                  return {
                    ...acumulador,
                    [cabecalhoFormatado[indice]]: parseInt(elemento.replace(/\r\n/g, '')), // Remove o caractere '\r\n' do atributo 'id'
                  };
                }
                // Converte os atributos 'idade', 'altura', 'peso' e 'ano' para números inteiros
                if (cabecalhoFormatado[indice] == 'age' || cabecalhoFormatado[indice] == 'height' || cabecalhoFormatado[indice] == 'year' || cabecalhoFormatado[indice] == 'id') {
                  return {
                    ...acumulador,
                    [cabecalhoFormatado[indice]]: parseInt(elemento),
                  };
                }
                // Condicional para retirar atributos desnecessários
                if (cabecalhoFormatado[indice] !== 'event' && cabecalhoFormatado[indice] !== 'weight' && cabecalhoFormatado[indice] !== 'city' && cabecalhoFormatado[indice] !== 'games' && cabecalhoFormatado[indice] !== 'noc' && cabecalhoFormatado[indice] !== 'season') {
                  return {
                    ...acumulador,
                    [cabecalhoFormatado[indice]]: elemento,
                  };
                }
                return acumulador; // Caso não entre em nenhuma condição, retorna o objeto sem alterações
              },
              {}
            )
          ),
      ].slice(1)[0]; // Remove a primeira linha, que é o cabeçalho
      recebeListaAtletas(csvLimpo);
      //primeiraQuestão(csvCleaned); // Chama a função para manipular os dados do arquivo CSV;
    })
    .catch(error => { // O método catch é chamado quando a Promise é rejeitada, e retorna um erro
      console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
    });
    

}
// Chamar a função para processar o arquivo CSV quando a página for carregada
processarCSV(); // Chama a função para processar o arquivo CSV

// -- [Funções puras] -------------------------

//Primeira Questão
// const primeiraQuestão = (maiorNumeroDeMedalhaDeOuro) => maiorNumeroDeMedalhaDeOuro
//   .filter(x => x.medel == "Gold" && x.Sport == "Basketball")
//   .map(x => x.)

// Declaração de variáveis
// Array de perguntas com as funções de alta ordem para buscar a resposta correta
const recebeListaAtletas = (csvCleaned) => {

  const perguntas = [
    {
      pergunta: "Which country has won the most gold medals in men's basketball until 2014?",
      buscarResposta: (atletas) => (alternativas = undefined) => {
        const medalhasOuroPorPais = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year <= 2014)
          .reduce((contador, atleta) => {
            contador[atleta.team] = (contador[atleta.team] || 0) + 1;
            return contador;
          }, {});
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas !== undefined ? alternativas : Object.keys(medalhasOuroPorPais).length + 1;
        const paisComMaisOuro = [...Object.keys(medalhasOuroPorPais), 'Spain'].slice(0, corte);
        return [...paisComMaisOuro].sort(aleatorioOrdena);
      },
      pontos: 1
    },
    {
      pergunta: "How many times has the United States men's basketball team won the gold medal until 2016?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroEUA = atletas.filter(atleta => atleta.medal == "Gold" && atleta.team == "United States" && atleta.sex == "M" && atleta.year < 2016)
          .reduce((acc, atletas) => {
            index = acc.findIndex(x => x.year == atletas.year);
            if (index == -1) {
              acc = [...acc, atletas];
            }
            return acc;
          }, []).length;
        const outrasAlternativas = [9, 10, 13, 16]
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas != undefined ? alternativas : outrasAlternativas.length + 1;
        const resposta = [...[ouroEUA, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
        return [...resposta].sort(aleatorioOrdena);
      },
      pontos: 1
    },
    {
      pergunta: "How many countries have won gold medals in men's basketball in the Olympics until 1980?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const paisesComOuro = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year <= 1980)
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) {
              acc = [...acc, atleta];
            }
            return acc;
          }, []).map(x => x.team);
        const qtdPaisesComOuro = paisesComOuro.length;
        const corte = alternativas != undefined ? alternativas : paisesComOuro.length + 2;
        const outrasAlternativas = [1, 2, 5, 8];
        const aleatorioOrdena = () => Math.random() - 0.5;
        const resposta = [...[qtdPaisesComOuro, ...outrasAlternativas]].slice(0, corte).sort((a, b) => a - b);
        return [...resposta].sort(aleatorioOrdena);
      },
      pontos: 1
    },
    {
      pergunta: "How many medals have been awarded to athletes from the Yugoslavia basketball team until 2016?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const medalhasIugoslavia = atletas.filter(atleta => atleta.team == "Yugoslavia" && atleta.sex == "M" && atleta.year <= 2016 && atleta.medal != "NA").length
        const outrasAlternativas = [70, 50, 77, 55];
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas != undefined ? alternativas : outrasAlternativas.length + 1;
        const resposta = [...[medalhasIugoslavia, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
        return [...resposta].sort(aleatorioOrdena);
      },
      pontos: 1
    },
    {
      pergunta: "Which country was the first to win a gold medal in women's basketball at the Olympics?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroFeminino = [...atletas.filter(atleta => (atleta.medal == "Gold" || atleta.medal == 'Silver') && atleta.sex == "F")
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) {
              acc = [...acc, atleta];
            }
            return acc;
          }, [])]
          .map(x => [x.team, x.year]).sort((atletaA, atletaB) => atletaA[1] - atletaB[1]);
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas != undefined ? alternativas : 5;
        const resposta = [...ouroFeminino.slice(0, corte).map(x => x[0])];
        return [...resposta].sort(aleatorioOrdena);
      },
      pontos: 1
    },
    {
      // A pergunta sobre a União Soviética no basquete masculino até 1992
      pergunta: "How many times did the Soviet Union men's basketball team win the gold medal until 1992?",
  
      // Função para buscar a resposta, que recebe os atletas como parâmetro e retorna outra função opcionalmente recebendo alternativas
      buscarResposta: atletas => (alternativas = undefined) => {
          // Filtra os atletas relevantes com base nas condições fornecidas
          const medalhasUniaoSovietica = atletas.filter(atleta => atleta.team == "Soviet Union" && atleta.sex == "M" && atleta.year <= 1992 && atleta.medal !== "NA")
                                                .reduce((acc, atleta)=> {
                                                  index = acc.findIndex(x => x.year == atleta.year);
                                                  if(index == -1){ // Se o ano não estiver presente no array, adiciona o atleta
                                                    acc = [...acc, atleta];
                                                  }
                                                  return acc;
                                                },[]).length;
            // resposta 9 vezes 
          // Outras opções de resposta
          const outrasAlternativas = [6, 8, 10, 12];
  
          // Função para ordenar aleatoriamente as respostas
          const aleatorioOrdena = () => Math.random() - 0.5;
  
          // Determina o número de alternativas a serem retornadas
          const corte = alternativas !== undefined ? alternativas : outrasAlternativas.length + 1;
  
          // Constrói a resposta, incluindo o número de medalhas da União Soviética e algumas alternativas adicionais, ordenadas aleatoriamente
          const resposta = [...[medalhasUniaoSovietica, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
  
          // Retorna a resposta com as alternativas ordenadas aleatoriamente
          return [...resposta].sort(aleatorioOrdena);
      },
  
      // Pontos atribuídos para esta pergunta
      pontos: 1
  }
  ];
// Função utilizada para controlar estados de eventos, usada para atualizar indices em outras partes do código, sem o uso de váriaveis.
// A função retorna um array contendo o valor inicial e o final
  const useState = (estadoinicial) => {
    const ler = () => estadoinicial
    const escrever = f => estadoinicial = typeof f == 'function' ? f(estadoinicial) : f
    return [ler, escrever]
  }
  const selecionaAlternativa = () => {
    const respostaCorreta = perguntas[readCurrentQuestionIdx()].buscarResposta(csvCleaned)(1)[0];
    const answerLabels = [...document.querySelectorAll('#answer-form label')];

    [...answerLabels].map(label => {
      label.addEventListener('click', () => {
        [...answerLabels].map(label => {
          label.classList.remove('selected');
          label.classList.remove('correct');
          label.classList.remove('wrong');
          label.removeEventListener('click', () => { }); // Remove the click event listener
        });

        label.classList.add('selected');
        if (label.children[0].value == respostaCorreta) {
          label.classList.add('correct');
        } else {
          label.classList.add('wrong');
          // Find the correct label and add the 'correct' class
          const correctLabel = answerLabels.find(l => l.children[0].value == respostaCorreta);
          correctLabel.classList.add('correct');
        }

        nextQuestionBtn.style.display = "block";
        [...answerLabels].map(label => {
          label.style.pointerEvents = "none"; // Disable pointer events on all labels
        });
      });
    });
  }

  // Função para buscar a resposta correta para uma pergunta
  const buscarRespostaCorreta = (atletas, pergunta) => pergunta.buscarResposta(atletas)(1);

  // Definição de constantes parar capturar os elementos
  const questionContainer = document.getElementById("question-container");
  const feedbackContainer = document.getElementById("feedback-container");
  const scoreContainer = document.getElementById("score-container");
  const questionText = document.getElementById("question-text");
  const answerForm = document.getElementById("answer-form");      
  const feedbackText = document.getElementById("feedback-text"); //???
  const nextQuestionBtn = document.getElementById("next-question-btn");
  const scoreCorrect = document.getElementById("score-correct"); //???
  const scoreIncorrect = document.getElementById("score-incorrect");//???
  const restartQuizbtn = document.getElementById("restart-quiz-btn")

  const [readCurrentQuestionIdx, writeCurrentQuestionIdx] = useState(0)
  const [readCorrectAnswers, writeCurrentAnswers] = useState(0)
  const [readIncorrectAnswers, writeIncorrectAnswers] = useState(0)

  const mostrarProximaPergunta = () => {
    const respostaUsuario = document.querySelector("input[name='answer']:checked");
    const currentQuestionIndex = readCurrentQuestionIdx()
    const resposta = respostaUsuario.value;
    const perguntaAtual = perguntas[currentQuestionIndex];
    const respostaCorreta = buscarRespostaCorreta(csvCleaned, perguntaAtual);

    if (resposta == respostaCorreta) {
      writeCurrentAnswers(x => x + 1);
    } else {
      writeIncorrectAnswers(x => x + 1)
    } // ate aq
    writeCurrentQuestionIdx(x => x + 1);
    if (readCurrentQuestionIdx() < perguntas.length) {
      exibirPergunta(perguntas[readCurrentQuestionIdx()], csvCleaned);
    } else {
      questionContainer.style.display = "none";
      feedbackContainer.style.display = "block";
      scoreContainer.style.display = "block";
      scoreCorrect.textContent = `Correct answers: ${readCorrectAnswers()}`;
      scoreIncorrect.textContent = `Incorrect answers ${readIncorrectAnswers()}`;
      feedbackContainer.textContent = readCorrectAnswers() == perguntas.length ? "Congratulations, you got all the questions right!" : "";
    }

  }

  const reiniciarQuiz = () => {
    writeCurrentQuestionIdx(0)
    writeCurrentAnswers(0)
    writeIncorrectAnswers(0)
    exibirPergunta(perguntas[0], csvCleaned);
    scoreContainer.style.display = "none";
    feedbackContainer.style.display = "none";
    questionContainer.style.display = "block";
  };
  restartQuizbtn.addEventListener("click", reiniciarQuiz)

  const exibirPergunta = (pergunta, processCSV) => {
    questionText.textContent = pergunta.pergunta;
    answerForm.innerHTML = "";
    const respostasPossiveis = [...(pergunta.buscarResposta(processCSV)())];
    respostasPossiveis.map(resposta => {
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = resposta;
      const label = document.createElement("label");
      label.textContent = resposta;
      label.appendChild(input);
      answerForm.appendChild(label);
      answerForm.appendChild(document.createElement("br"));
    });
    selecionaAlternativa();
    feedbackText.textContent = "";
    nextQuestionBtn.style.display = "none";
  }


  exibirPergunta(perguntas[readCurrentQuestionIdx()], csvCleaned);
  nextQuestionBtn.addEventListener("click", mostrarProximaPergunta);


}
