
document.addEventListener("DOMContentLoaded", () => {
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
              .flatMap((elemento, indice) => (indice === 3 ? elemento.split(",") : elemento.replace(/["]/g, ""))) // O flatMap vai transformar um array de arrays em um array simples

              // Reduz o array de campos para um objeto, utilizando o cabeçalho como chaves
              .reduce(
                (acumulador, elemento, indice) => {
                  // Remove o caractere '\r\n' do atributo 'id'
                  if (cabecalhoFormatado[indice] === 'id') {
                    return {
                      ...acumulador,
                      [cabecalhoFormatado[indice]]: parseInt(elemento.replace(/\r\n/g, '')), // Remove o caractere '\r\n' do atributo 'id'
                    };
                  }
                  // Converte os atributos 'idade', 'altura', 'peso' e 'ano' para números inteiros
                  if (cabecalhoFormatado[indice] === 'age' || cabecalhoFormatado[indice] === 'height' || cabecalhoFormatado[indice] === 'year' || cabecalhoFormatado[indice] === 'id') {
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
});

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
      pergunta: "Qual foi o país que conquistou o maior número de medalhas de ouro no basquete masculino até 2014?",
      buscarResposta: (atletas) => (alternativas = undefined) => {
        const medalhasOuroPorPais = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year < 2014).reduce((contador, atleta) => {
          contador[atleta.team] = (contador[atleta.team] || 0) + 1;
          return contador;
        }, {}); // Estados Unidos ganharam 174 medalhas de ouro, se dividir pela quantidade de vezes (174/14), temos aproximadamente 12 atletas com medalhas em cada ano, ou seja está correto
        const corte = alternativas != undefined ? alternativas : medalhasOuroPorPais.length;
        const paisComMaisOuro = Object.keys(medalhasOuroPorPais).slice(0, alternativas !== undefined ? alternativas : Object.keys(medalhasOuroPorPais).length);
        console.log(paisComMaisOuro)
        return paisComMaisOuro;
      },
      pontos: 1
    },
    {
      pergunta: "Quantas vezes as equipes dos Estados Unidos ganharam a medalha de ouro no basquete masculino até 2016?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroEUA = atletas.filter(atleta => atleta.medal == "Gold" && atleta.team == "United States" && atleta.sex == "M" && atleta.year < 2016)
          .reduce((acc, atletas) => {
            index = acc.findIndex(x => x.year == atletas.year);
            if (index == -1) {
              acc = [...acc, atletas];
            }
            return acc;
          }, []).length; // Ganharam 14 vezes
          const outrasAlternativas = [9, 10, 13, 16]
          const corte = alternativas != undefined ? alternativas : outrasAlternativas.length + 1;
          const resposta = [...[ouroEUA, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
          console.log(resposta)
          return resposta;
        },
      pontos: 1
    },
    {
      pergunta: "Quantos países já ganharam medalhas de ouro no basquete masculino nas Olimpíadas até 1980?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const paisesComOuro = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year <= 1980)
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) {
              acc = [...acc, atleta];
            }
            return acc;
          }, []).map(x => x.team);
        const qtdPaisesComOuro = paisesComOuro.length; // 3 países ganharam medalhas de ouro
        const corte = alternativas != undefined ? alternativas : paisesComOuro.length + 2;
        const outrasAlternativas = [1, 2, 5, 8];
        const resposta = [...[qtdPaisesComOuro, ...outrasAlternativas]].slice(0, corte).sort((a, b) => a - b);
        console.log(resposta)
        return resposta;
      },
      pontos: 1
    },
    {
      pergunta: "Quantas medalhas foram concedidas, ao total, a atletas do time de basquete da Iugoslávia até o ano de 2016?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const medalhasIugoslavia = atletas.filter(atleta => atleta.team == "Yugoslavia" && atleta.sex == "M" && atleta.year <= 2016 && atleta.medal != "NA").length
        // 60 medalhas
        const outrasAlternativas = [70, 50, 77, 55];
        const corte = alternativas != undefined ? alternativas : outrasAlternativas.length + 1;
        const resposta = [...[medalhasIugoslavia, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
        console.log(resposta)
        return resposta;
      },
      pontos: 1
    },
    {
      pergunta: "Quem foi o primeiro país a ganhar uma medalha de ouro no basquete feminino nas Olimpíadas?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroFeminino = [...atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "F")
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) {
              acc = [...acc, atleta];
            }
            return acc;
          }, [])]
          .map(x => [x.team, x.year]);
          console.log(ouroFeminino)
        // resposta é a União Soviética em 1976
        const resultado = ouroFeminino[2][0];
        const corte = alternativas != undefined ? resultado : ([...ouroFeminino.map(x => x[0]), 'Great Britain']).slice(0, 4);
        return corte
      },
      pontos: 1
    }
  ];

  const selecionaAlternativa = () => { // Função para estilizar a alternativa selecionada
    const answerLabels = document.querySelectorAll('#answer-form label'); // Selecionando todos os labels dentro do formulário de respostas
    // Adicionando um evento de clique para cada label
    [...answerLabels].map(label => { // Transformando a NodeList em um array para utilizar o método map
      label.addEventListener('click', () => { // Adicionando um evento de clique para cada label
        // Remover a classe 'selected' de todos os labels
        [...answerLabels].map(label => { // Transformando a NodeList em um array para utilizar o método map
          label.classList.remove('selected'); // Removendo a classe 'selected' de todos os labels
        });
    
        // Adicionar a classe 'selected' ao label clicado
        label.classList.add('selected'); // Adicionando a classe 'selected' ao label clicado
      });
    });


  }

  // Função para buscar a resposta correta para uma pergunta
  const buscarRespostaCorreta = (atletas, pergunta) => pergunta.buscarResposta(atletas)(1);

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

  let currentQuestionIndex = 0;
  let totalPontos = 0;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  const mostrarProximaPergunta = () => {
    const respostaUsuario = document.querySelector("input[name='answer']:checked");

    if (respostaUsuario) {
      const resposta = respostaUsuario.value;
      console.log(resposta)
      const perguntaAtual = perguntas[currentQuestionIndex];
      const respostaCorreta = buscarRespostaCorreta(csvCleaned, perguntaAtual);
      console.log(respostaCorreta);
      if (resposta == respostaCorreta) {
        feedbackText.textContent = "Resposta correta!";
        correctAnswers++;
        totalPontos += perguntaAtual.pontos;
      } else {
        feedbackText.textContent = "Resposta incorreta. Tente novamente.";
        incorrectAnswers++;
      } // ate aq
      currentQuestionIndex++;
      if (currentQuestionIndex < perguntas.length) {
        exibirPergunta(perguntas[currentQuestionIndex], csvCleaned);
      } else {
        questionContainer.style.display = "none";
        //feedbackContainer.style.display = "none";
        scoreContainer.style.display = "block";
        scoreCorrect.textContent = `Respostas corretas: ${correctAnswers}`;// problema do score(elemento duplicado no html)
        scoreIncorrect.textContent = `Respostas incorretas: ${incorrectAnswers}`;// problema do score(elemento duplicado no html)
        feedbackText.textContent = correctAnswers == perguntas.length ? "Parabéns, você acertou todas as perguntas!" : "Você errou algumas perguntas, tente novamente!";
      }
    } else {
      feedbackText.textContent = "Por favor, selecione uma resposta antes de avançar para a próxima pergunta.";
    }
  }

  const reiniciarQuiz = () => {
    currentQuestionIndex = 0;
    totalPontos = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    exibirPergunta(perguntas[currentQuestionIndex], csvCleaned);
    scoreContainer.style.display = "none";
    feedbackContainer.style.display = "none";
    questionContainer.style.display = "block";
  };
  restartQuizbtn.addEventListener("click", reiniciarQuiz)

  const exibirPergunta = (pergunta, processCSV) => {
    questionText.textContent = pergunta.pergunta;
    answerForm.innerHTML = "";
    const respostasPossiveis = [...new Set(pergunta.buscarResposta(processCSV)())];
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
    nextQuestionBtn.style.display = "block";
  }


  exibirPergunta(perguntas[currentQuestionIndex], csvCleaned);
  nextQuestionBtn.addEventListener("click", mostrarProximaPergunta);


}
