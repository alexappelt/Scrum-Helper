console.log('A extensão está funcionando.');


  document.addEventListener('DOMContentLoaded', function() {
    // Agora é seguro usar document aqui
    document.getElementById('myButton').addEventListener('click', function(){
        geraQuadro()
    });

    carregaValoresSalvos()


  // Adiciona um listener de eventos para todos os elementos com a classe capturarUrlButton
  var botoes = document.getElementsByClassName('capturarUrlButton');
  for (var i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener('click', capturarUrl);
  }


  });

function carregaValoresSalvos(){


    var textareaIds = [];

  // Adiciona um listener de eventos para todos os elementos com a classe capturarUrlButton
    var botoes = document.getElementsByClassName('capturarUrlButton');

    for (var i = 0; i < botoes.length; i++) {
        // Obtém o textarea associado a cada botão
        var textarea = botoes[i].previousElementSibling;

        // Adiciona o ID do textarea ao array
        if (textarea) {
        textareaIds.push(textarea.id);
        }

}


    // Itera sobre os IDs
textareaIds.forEach(function(textareaId) {
    // Obtém o valor armazenado no chrome.storage.local para o textarea correspondente ao ID
    chrome.storage.local.get(textareaId, function(result) {
      if (textareaId in result) {
        // Atualiza o valor no textarea
        var textarea = document.getElementById(textareaId);
        textarea.value = result[textareaId];
      } else {
        console.log("A chave '" + textareaId + "' não foi encontrada no armazenamento local");
      }
    });
  });


}

function capturarUrl(event) {
    var botao = event.target;
    var textarea = botao.previousElementSibling;

   

      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        var currentUrl = currentTab.url;

        var data = {};
        data[textarea.id] = currentUrl;
    
        textarea.value = currentUrl;
  
        chrome.storage.local.set(data).then(() => {
            //
          });

      
      });
  }


  function geraQuadro() {
    var textareaIds = [];

    // Adiciona um listener de eventos para todos os elementos com a classe capturarUrlButton
    var botoes = document.getElementsByClassName('capturarUrlButton');

    for (var i = 0; i < botoes.length; i++) {
        // Obtém o textarea associado a cada botão
        var textarea = botoes[i].previousElementSibling;

        // Adiciona o ID do textarea ao array
        if (textarea) {
            textareaIds.push(textarea.id);
        }
    }

    var modelo = `h1. Andamento da Sprint

table{width:50%; border: none;}.
|{border: none;}. "Histórias - Prioridades":%{inputHistorias}|
|{border: none;}. "Quadro de Tarefas - Desenvolvimento":%{inputQuadroTarefasDesenv}|
|{border: none;}. "Quadro de Tarefas - Teste":%{inputQuadroTarefasTest}|
|{border: none;}. "Quadro de Tarefas - Histórias":%{inputQuadroTarefasHistorias}|
|{border: none;}. "Burndown":%{inputBurndown}|
|{border: none;}. "Tempo Gasto":%{inputTempoGasto}|
|{border: none;}. "Relatório de Horas":%{inputRelatorioHoras}|`;

    // Mapeia cada ID para uma Promessa que resolve quando os dados são obtidos do chrome.storage.local
    var promessas = textareaIds.map(function(textareaId) {
        return new Promise(function(resolve) {
            // Obtém o valor armazenado no chrome.storage.local para o textarea correspondente ao ID
            chrome.storage.local.get(textareaId, function(result) {
                if (textareaId in result) {
                    modelo = modelo.replace(`%{${textareaId}}`, result[textareaId]);
                } else {
                    alert("A chave '" + textareaId + "' não foi encontrada no armazenamento local");
                }
                resolve();  // Resolve a Promessa após a operação assíncrona ser concluída
            });
        });
    });

    // Aguarda todas as Promessas serem resolvidas antes de exibir o modelo
    Promise.all(promessas).then(function() {
        salvarTextoComoArquivo(modelo);
    });
}


function salvarTextoComoArquivo(texto, nomeArquivo) {
    // Cria um Blob com o texto
    var blob = new Blob([texto], { type: 'text/plain' });

    // Cria um URL temporário para o Blob
    var url = window.URL.createObjectURL(blob);

    // Cria um elemento de link
    var link = document.createElement('a');

    // Define o URL do link como o URL temporário
    link.href = url;

    // Define o atributo de download e o nome do arquivo
    link.download = nomeArquivo || 'arquivo.txt';

    // Adiciona o link ao corpo do documento
    document.body.appendChild(link);

    // Simula um clique no link para iniciar o download
    link.click();

    // Remove o link do corpo do documento
    document.body.removeChild(link);

    // Revoga o URL temporário
    window.URL.revokeObjectURL(url);
}

