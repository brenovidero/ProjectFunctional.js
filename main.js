
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
      
      recebeListaAtletas(csvLimpo);// chama a função que executa o quiz e é definida abaixo e passa como argumento o csv processado
    })
    .catch(error => { // O método catch é chamado quando a Promise é rejeitada, e retorna um erro
      console.error('Ocorreu um erro ao processar o arquivo CSV:', error);
    });
    

}
// Chamar a função para processar o arquivo CSV quando a página for carregada
processarCSV(); // Chama a função para processar o arquivo CSV

// Função que recebe a lista de atletas e executa o quiz
const recebeListaAtletas = (registroAtletas) => {
// O array de perguntas, é um array de objetos, o primeiro objeto é o próprio texto da pergunta 
// O segundo elemento dos objetos é uma função que busca a resposta certa e cria as alternativas 
// O terceiro elemento é a pontuação, que vale 1 em cada pergunta 
// A lógica da função busca resposta será explicada na primeira pergunta, visto que nas próximas perguntas a lógica será parecida, com alguns ajustes.

  const perguntas = [
     // Pergunta 1: País com mais medalhas de ouro no basquete masculino até 2014
    {
      pergunta: "Which country has won the most gold medals in men's basketball until 2014?",
      buscarResposta: (atletas) => (alternativas = undefined) => {
        // cada pergunta usa uma função que filtra o array atletas de acordo com a pergunta
        const medalhasOuroPorPais = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year <= 2014)
          .reduce((contador, atleta) => {
            // A função reduce, conta o número de atletas que sobrou após o processamento anterior (.filter).
            contador[atleta.team] = (contador[atleta.team] || 0) + 1; // Incrementa o contador de medalhas de ouro para o país
            return contador;
          }, {});
           // Função para ordenar aleatoriamente as respostas
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas !== undefined ? alternativas : Object.keys(medalhasOuroPorPais).length + 1; // Determina o número de alternativas a serem retornadas
        const paisComMaisOuro = [...Object.keys(medalhasOuroPorPais), 'Spain'].slice(0, corte); // Faz uma cópia do array de países com medalhas de ouro e depois faz o corte do array de acordo com o número de alternativas ou a resposta corrta
        return [...paisComMaisOuro].sort(aleatorioOrdena); //Retorna a resposta com as alternativas ordenadas aleatoriamente
      },
      pontos: 1
    },
    // Pergunta 2: Número de vezes que a equipe masculina de basquete dos Estados Unidos ganhou a medalha de ouro até 2016
    {
      pergunta: "How many times has the United States men's basketball team won the gold medal until 2016?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroEUA = atletas.filter(atleta => atleta.medal == "Gold" && atleta.team == "United States" && atleta.sex == "M" && atleta.year < 2016)
          .reduce((acc, atletas) => {
            index = acc.findIndex(x => x.year == atletas.year);
            if (index == -1) {// Se o ano não estiver presente no array, adiciona o atleta
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
     // Pergunta 3: Número de países que ganharam medalhas de ouro no basquete masculino até 1980
    {
      pergunta: "How many countries have won gold medals in men's basketball in the Olympics until 1980?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const paisesComOuro = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "M" && atleta.year <= 1980)
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) { // Se o país não estiver presente no array, adiciona o atleta
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
    // Pergunta 4: Número de medalhas concedidas aos atletas da equipe de basquete da Iugoslávia até 2016
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
     // Pergunta 5: País que ganhou a primeira medalha de ouro no basquete feminino nas Olimpíadas
    {
      pergunta: "Which country was the first to win a gold medal in women's basketball at the Olympics?",
      buscarResposta: atletas => (alternativas = undefined) => {
        const ouroFeminino = [...atletas.filter(atleta => (atleta.medal == "Gold" || atleta.medal == 'Silver') && atleta.sex == "F")
          .reduce((acc, atleta) => {
            index = acc.findIndex(x => x.team == atleta.team);
            if (index == -1) {// Se o país não estiver presente no array, adiciona o atleta
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
      // Pergunta 6: Número de vezes que a equipe masculina de basquete da União Soviética ganhou a medalha de ouro até 1992
      pergunta: "How many times did the Soviet Union men's basketball team win the gold medal until 1992?",
      buscarResposta: atletas => (alternativas = undefined) => {
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
          const aleatorioOrdena = () => Math.random() - 0.5;
          // Determina o número de alternativas a serem retornadas
          const corte = alternativas !== undefined ? alternativas : outrasAlternativas.length + 1;
          const resposta = [...[medalhasUniaoSovietica, ...outrasAlternativas].slice(0, corte).sort((a, b) => a - b)];
          return [...resposta].sort(aleatorioOrdena);
      },
      pontos: 1
  },
  // Pergunta 7: Número de vezes que a equipe feminina de basquete do Brasil ganhou a medalha de ouro até 2008
  {
    pergunta: "How many times did Brazil win gold medals in women's basketball until 2008?",
    buscarResposta: (atletas) => (alternativas = undefined) => {
        const ouroBrasilFeminino = atletas.filter(atleta => atleta.medal == "Gold" && atleta.team == "Brazil" && atleta.sex == "F" && atleta.year <= 2008).length;
        const outrasAlternativas = [2, 3, 4, 5];
        const aleatorioOrdena = () => Math.random() - 0.5;
        const corte = alternativas !== undefined ? alternativas : outrasAlternativas.length + 1;
        const resposta = [...[ouroBrasilFeminino, ...outrasAlternativas].slice(0,corte)];
        return [...resposta].sort(aleatorioOrdena);
    },
    pontos: 1
},
// Pergunta 8: País que ganhou a primeira medalha de ouro no basquete feminino nas Olimpíadas
{
  pergunta: "Which country won the first gold medal in women's basketball at the Olympics?",//PERGUNTA 8
  buscarResposta: (atletas) => (alternativas = undefined) => {
      const primeiraOuroFeminino = atletas.filter(atleta => atleta.medal == "Gold" && atleta.sex == "F")
          .reduce((acc, atleta) => {
              index = acc.findIndex(x => x.team == atleta.team);
              if (index == -1) {
                  acc = [...acc, atleta];
              }
              return acc;
          }, []).sort((a, b) => a.year - b.year)[0].team;
      const aleatorioOrdena = () => Math.random() - 0.5;
      const corte = alternativas !== undefined ? alternativas : 5;
      const resposta = [primeiraOuroFeminino, "USA", "Russia", "Australia", "China"].slice(0, corte);
      return [...resposta].sort(aleatorioOrdena);
  },
  pontos: 1
},
 // Pergunta 9: Número de vezes que a equipe masculina de basquete do Canadá ganhou a medalha de ouro até 2012
{
  pergunta: "How many gold medals were awarded to Canada's athletes in men's basketball through 2012?",
  buscarResposta: (atletas) => (alternativas = undefined) => {
      const ouroCanadaMasculino = atletas.filter(atleta => atleta.medal == "Gold" && atleta.team == "Canada" && atleta.sex == "M" && atleta.year <= 2012).length;
      const outrasAlternativas = [4, 1, 2, 3];
      const aleatorioOrdena = () => Math.random() - 0.5;
      const corte = alternativas !== undefined ? alternativas : outrasAlternativas.length + 1;
      const resposta = [...[ouroCanadaMasculino, ...outrasAlternativas].slice(0, corte)];
      return [...resposta].sort(aleatorioOrdena);
  },
  pontos: 1
},
// Pergunta 10: Ano em que o basquete foi introduzido nas Olimpíadas pela primeira vez
{
  pergunta: "In what year was basketball introduced to the Olympics for the first time?",
  buscarResposta: (atletas) => (alternativas = undefined) => {
      const primeiroAnoBasquete = atletas.filter(atleta => atleta.sport == "Basketball").map(atleta => atleta.year).sort()[0];
      const aleatorioOrdena = () => Math.random() - 0.5;
      const corte = alternativas !== undefined ? alternativas : 5;
      const resposta = [primeiroAnoBasquete, 1900, 1920, 1936, 1948].slice(0, corte);
      return [...resposta].sort(aleatorioOrdena);
  },
  pontos: 1
}


  ];
// Função utilizada para controlar estados de eventos, usada para atualizar indices em outras partes do código, sem o uso de váriaveis.
// A função retorna um array contendo o valor inicial e o final
  // Define uma função chamada definirEstado que recebe um estado inicial como parâmetro
  const definirEstado = (estadoinicial) => {
    // Define uma função chamada ler que retorna o estado inicial
    const ler = () => estadoinicial;
    // Define uma função chamada escrever que atualiza o estado inicial com um novo valor
    const escrever = f => estadoinicial = typeof f == 'function' ? f(estadoinicial) : f;
    // Retorna um array contendo as funções ler e escrever
    return [ler, escrever];
  }

  // Define uma função chamada selecionaAlternativa
  const selecionaAlternativa = () => {
    // Obtém a resposta correta para a pergunta atual
    const respostaCorreta = perguntas[IndexLeituraAtualQuestao()].buscarResposta(registroAtletas)(1)[0];
    // Obtém todos os labels das alternativas
    const alternativasLabels = [...document.querySelectorAll('#answer-form label')];

    // Adiciona um ouvinte de eventos de clique para cada label das alternativas
    [...alternativasLabels].map(label => {
      label.addEventListener('click', () => {
        // Remove as classes 'selected', 'correct' e 'wrong' de todos os labels
        [...alternativasLabels].map(label => {
          label.classList.remove('selected');
          label.classList.remove('correct');
          label.classList.remove('wrong');
          label.removeEventListener('click', () => { }); // Remove o ouvinte de eventos de clique
        });

        // Adiciona a classe 'selected' ao label clicado
        label.classList.add('selected');
        // Verifica se a resposta selecionada é a resposta correta
        if (label.children[0].value == respostaCorreta) {
          label.classList.add('correct'); // Adiciona a classe 'correct' ao label
        } else {
          label.classList.add('wrong'); // Adiciona a classe 'wrong' ao label
          // Encontra o label correto e adiciona a classe 'correct'
          const labelCorreto = alternativasLabels.find(label => label.children[0].value == respostaCorreta);
          labelCorreto.classList.add('correct');
        }

        // Exibe o botão de próxima pergunta
        botaoProximaQuestao.style.display = "block";
        // Desabilita eventos de ponteiro em todos os labels
        [...alternativasLabels].map(label => {
          label.style.pointerEvents = "none";
        });
      });
    });
  }

  // Função para buscar a resposta correta para uma pergunta
  const buscarRespostaCorreta = (atletas, pergunta) => pergunta.buscarResposta(atletas)(1);

  // Definição de constantes parar capturar os elementos
  const contemQuestoes = document.getElementById("question-container");
  const feedbackContainer = document.getElementById("feedback-container");
  const contemPontuacao = document.getElementById("score-container");
  const textoDaQuestao = document.getElementById("question-text");
  const respostaFormulario = document.getElementById("answer-form");      
  const feedbackText = document.getElementById("feedback-text");
  const botaoProximaQuestao = document.getElementById("next-question-btn");
  const pontuacaoRespCorretas = document.getElementById("score-correct");
  const pontuacaoRespIncorretas = document.getElementById("score-incorrect");
  const botaoReiniciarQuiz = document.getElementById("restart-quiz-btn")

  // Definição de estados para controlar o índice da pergunta atual e o número de respostas corretas e incorretas
  const [IndexLeituraAtualQuestao, IndexEscritaAtualQuestao] = definirEstado(0)
  const [lerRespostasCorretas, escreverRespostasCorretas] = definirEstado(0)
  const [lerRespostasIncorretas, escreverRespostasIncorretas] = definirEstado(0)


  // Esta função é responsável por avançar para a próxima pergunta após o usuário responder à pergunta atual.
  const mostrarProximaPergunta = () => {
    const respostaUsuario = document.querySelector("input[name='answer']:checked");
    const indiceAtualQuestao = IndexLeituraAtualQuestao()
    const resposta = respostaUsuario.value;
    const perguntaAtual = perguntas[indiceAtualQuestao];
    const respostaCorreta = buscarRespostaCorreta(registroAtletas, perguntaAtual);

    // Verifica se a resposta do usuário está correta e atualiza a contagem de respostas corretas ou incorretas
    if (resposta == respostaCorreta) {
      escreverRespostasCorretas(x => x + 1);
    } else {
      escreverRespostasIncorretas(x => x + 1)
    }
    IndexEscritaAtualQuestao(x => x + 1);
    if (IndexLeituraAtualQuestao() < perguntas.length) {
      exibirPergunta(perguntas[IndexLeituraAtualQuestao()], registroAtletas);
    } else {
      contemQuestoes.style.display = "none";
      feedbackContainer.style.display = "block";
      contemPontuacao.style.display = "block";
      pontuacaoRespCorretas.textContent = `Correct answers: ${lerRespostasCorretas()}`;
      pontuacaoRespIncorretas.textContent = `Incorrect answers ${lerRespostasIncorretas()}`;
      feedbackContainer.textContent = lerRespostasCorretas() == perguntas.length ? "Congratulations, you got all the questions right!" : "";
    }

  }

  // Esta função reinicia o quiz, restaurando todos os estados para os valores iniciais e exibindo a primeira pergunta.
  const reiniciarQuiz = () => {
    // Reseta os estados para os valores iniciais
    IndexEscritaAtualQuestao(0)
    escreverRespostasCorretas(0)
    escreverRespostasIncorretas(0)
    // Exibe a primeira pergunta
    exibirPergunta(perguntas[0], registroAtletas);
    contemPontuacao.style.display = "none";
    feedbackContainer.style.display = "none";
    contemQuestoes.style.display = "block";
  };
  // Adiciona um evento de clique ao botão "Reiniciar Quiz" para chamar a função reiniciarQuiz quando o botão é clicado
  botaoReiniciarQuiz.addEventListener("click", reiniciarQuiz)

  // Esta função exibe uma pergunta no formulário do quiz.
  const exibirPergunta = (pergunta, processCSV) => {

    // Define o texto da pergunta no elemento HTML correspondente
    textoDaQuestao.textContent = pergunta.pergunta;

    // Limpa o conteúdo do formulário de respostas
    respostaFormulario.innerHTML = "";

    // Obtém as respostas possíveis chamando a função buscarResposta da pergunta e executando-a com o argumento processCSV
    const respostasPossiveis = [...(pergunta.buscarResposta(processCSV)())];

     // Para cada resposta possível, cria um input radio e um label correspondente e os adiciona ao formulário de respostas
    respostasPossiveis.map(resposta => { // Mapeia as respostas possíveis e cria um input radio para cada uma
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = resposta;
      const label = document.createElement("label");
      label.textContent = resposta;
      label.appendChild(input);
      respostaFormulario.appendChild(label);
      respostaFormulario.appendChild(document.createElement("br"));
    });
    selecionaAlternativa();
    feedbackText.textContent = "";
    botaoProximaQuestao.style.display = "none";
  }

  exibirPergunta(perguntas[IndexLeituraAtualQuestao()], registroAtletas);
  
  // Adiciona um evento de clique ao botão "Próxima Questão" para chamar a função mostrarProximaPergunta quando o botão é clicado
  botaoProximaQuestao.addEventListener("click", mostrarProximaPergunta);


}
