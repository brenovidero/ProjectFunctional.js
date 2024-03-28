
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
                return {
                    ...x,
                    [header[i]]: parseInt(y.replace(/\r\n/g, '')), // Remove o caractere '\r\n' do atributo 'id'
                  };
              }
              // Converte os atributos 'age', 'height', 'weight' e 'year' para números inteiros
              if(header[i] == 'age' || header[i] == 'height' || header[i] == 'weight' || header[i] == 'year' || header[i] == 'id'){
                return {
                    ...x,
                    [header[i]]: parseInt(y),
                    };
                }
                // Condicional para retirar atributos desnecessários
                if (header[i] !== 'event' && header[i] !== 'weight' && header[i] !== 'city' && header[i] !== 'games' && header[i] !== 'noc' && header[i] != 'season') {
                    return {
                        ...x,
                        [header[i]]: y,
                    };
                }
                return x;// Caso não entre em nenhuma condição, retorna o objeto sem alterações
            },
            {}
          )
      ),
    ].slice(1);// Ignora a primeira linha do CSV, que contém os cabeçalhos das colunas;
            console.log(csvCleaned); // Exibe o conteúdo do arquivo CSV processado no console;
            //primeiraQuestão(csvCleaned); // Chama a função para manipular os dados do arquivo CSV;
            })
            .catch(error => { // O método catch é chamado quando a Promise é rejeitada, e retorna um erro
                console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
            });
    }
    // Chamar a função para processar o arquivo CSV quando a página for carregada
    processCSV(); // Chama a função para processar o arquivo CSV
});

// -- [Funções puras] -------------------------

  //Primeira Questão
// const primeiraQuestão = (maiorNumeroDeMedalhaDeOuro) => maiorNumeroDeMedalhaDeOuro
//   .filter(x => x.medel == "Gold" && x.Sport == "Basketball")
//   .map(x => x.)

// Declaração de variáveis
// Array de perguntas com as funções de alta ordem para buscar a resposta correta
const perguntas = [
  {
    pergunta: "Qual foi o país que conquistou o maior número de medalhas de ouro no basquete masculino até 2016?",
    buscarResposta: atletas => {
      const medalhasOuroPorPais = atletas.filter(atleta => atleta.medal === "Gold" && atleta.gender === "M").reduce((contador, atleta) => {
        contador[atleta.team] = (contador[atleta.team] || 0) + 1;
        return contador;
      }, {});
      const paisComMaisOuro = Object.keys(medalhasOuroPorPais).reduce((a, b) => medalhasOuroPorPais[a] > medalhasOuroPorPais[b] ? a : b);
      return paisComMaisOuro;
    },
    pontos: 1
  },
  {
    pergunta: "Quantas vezes as equipes dos Estados Unidos ganharam a medalha de ouro no basquete masculino até 2016?",
    buscarResposta: atletas => {
      const ouroEUA = atletas.filter(atleta => atleta.medal === "Gold" && atleta.team === "United States" && atleta.gender === "M").length;
      return ouroEUA;
    },
    pontos: 1
  },
  {
    pergunta: "Quantos países já ganharam medalhas de ouro no basquete masculino nas Olimpíadas até 2016?",
    buscarResposta: atletas => {
      const paisesComOuro = [...new Set(atletas.filter(atleta => atleta.medal === "Gold" && atleta.gender === "M").map(atleta => atleta.team))];
      return paisesComOuro.length;
    },
    pontos: 1
  },
  {
    pergunta: "Quantas medalhas foram concedidas a atletas do time de basquete da Iugoslávia até o ano de 2016?",
    buscarResposta: atletas => {
      const medalhasIugoslavia = atletas.filter(atleta => atleta.team === "Yugoslavia" && atleta.gender === "M").length;
      return medalhasIugoslavia;
    },
    pontos: 1
  },
  {
    pergunta: "Quem foi o primeiro país a ganhar uma medalha de ouro no basquete feminino nas Olimpíadas?",
    buscarResposta: atletas => {
      const ouroFeminino = atletas.find(atleta => atleta.medal === "Gold" && atleta.gender === "F");
      return ouroFeminino ? ouroFeminino.team : "Nenhum país encontrado";
    },
    pontos: 1
  }
];

// Função para buscar a resposta correta para uma pergunta
const buscarRespostaCorreta = (pergunta, atletas) => pergunta.buscarResposta(atletas);

const questionContainer = document.getElementById("question-container");
const feedbackContainer = document.getElementById("feedback-container");
const scoreContainer = document.getElementById("score-container");
const questionText = document.getElementById("question-text");
const answerForm = document.getElementById("answer-form");
const feedbackText = document.getElementById("feedback-text");
const nextQuestionBtn = document.getElementById("next-question-btn");
const scoreCorrect = document.getElementById("score-correct");
const scoreIncorrect = document.getElementById("score-incorrect");

let currentQuestionIndex = 0;
let totalPontos = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;

const mostrarProximaPergunta = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < perguntas.length) {
    exibirPergunta(perguntas[currentQuestionIndex]);
  } else {
    questionContainer.style.display = "none";
    feedbackContainer.style.display = "none";
    scoreContainer.style.display = "block";
    scoreCorrect.textContent = `Respostas corretas: ${correctAnswers}`;
    scoreIncorrect.textContent = `Respostas incorretas: ${incorrectAnswers}`;
    feedbackText.textContent = correctAnswers === perguntas.length ? "Parabéns, você acertou todas as perguntas!" : "Você errou algumas perguntas, tente novamente!";
  }
}

const exibirPergunta = (pergunta) => {
  questionText.textContent = pergunta.pergunta;
  answerForm.innerHTML = "";
  const respostaCorreta = buscarRespostaCorreta(pergunta, processCSV);
  const respostasPossiveis = [...new Set(processCSV.map(atleta => pergunta.buscarResposta([atleta])))];
  respostasPossiveis.forEach(resposta => {
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
  feedbackText.textContent = "";
  nextQuestionBtn.style.display = "none";
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const respostaUsuario = document.querySelector("input[name='answer']:checked");
  if (respostaUsuario) {
    const resposta = respostaUsuario.value;
    const perguntaAtual = perguntas[currentQuestionIndex];
    const respostaCorreta = buscarRespostaCorreta(perguntaAtual, processCSV);
    if (resposta === respostaCorreta) {
      feedbackText.textContent = "Resposta correta!";
      correctAnswers++;
      totalPontos += perguntaAtual.pontos;
    } else {
      feedbackText.textContent = "Resposta incorreta. Tente novamente.";
      incorrectAnswers++;
    }
    nextQuestionBtn.style.display = "block";
  } else {
    feedbackText.textContent = "Por favor, selecione uma resposta.";
  }
});

nextQuestionBtn.addEventListener("click", mostrarProximaPergunta);

exibirPergunta(perguntas[currentQuestionIndex]);


