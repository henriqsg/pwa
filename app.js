'use strict';
let deferredInstallPrompt = null;
const installBtn = document.getElementById('btInstalar');

let initialiseUI = function(){

    installBtn.removeAttribute('hidden');
    installBtn.addEventListener('click', function(){

        deferredInstallPrompt.prompt();

        deferredInstallPrompt.userChoice.then((choice) => {

            if (choice.outcome === 'accepted') {

                console.log("Usuário aceitou a instalação");

            } else {

                console.log("Usuário não aceitou a instalação");

            }

        });

    });

}

var ajax = new XMLHttpRequest();

// Seta tipo de requisição e URL com os parâmetros
ajax.open("GET", "data.json", true);

// Envia a requisição
ajax.send();

// Cria um evento para receber o retorno.
ajax.onreadystatechange = function() {

    // Caso o state seja 4 e o http.status for 200, é porque a requisiçõe deu certo.
    if (ajax.readyState == 4 && ajax.status == 200) {

        // Retorno do Ajax
        var data = ajax.responseText;

        var data_json = JSON.parse(data);

        if (data_json.length == 0){
            // document.getElementsByClassName('card_loading')[0].style.display = 'none';
            // document.getElementsByClassName('card_empty')[0].style.display = 'block';
        } else {

            // document.getElementsByClassName('card_loading')[0].style.display = 'none';

            var container = document.getElementById('cardsContainer');

            container.innerHTML = "";

            var html_cards = "";
            for (var i = 0; i < data_json.length; i++) {

                html_cards += template_card(data_json[i]['imageSrc'],data_json[i]['title'],data_json[i]['description']);

            }
            container.innerHTML = html_cards;
            cache_cards(data_json);
        }
    }
}

var template_card = function(imageSrc, title, description){

    return  `<div class="col mb-4">
                <div class="card">
                <img src="${imageSrc}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description}</p>
                </div>
                </div>
            </div>`;
}

var cache_cards = function(data_json){

    if('caches' in window) {

        caches.delete('card-cache').then(function () {

            console.log('Cache dos Cards deletado com sucesso!');


            if (data_json.length > 0) {

                var arquivos = ['data.json'];

                for (var i = 0; i < data_json.length; i++) {

                    arquivos.push(data_json[i]['imageSrc']);

                }

                console.log("Arquivos a serem gravados em cache:");
                console.log(arquivos);

                caches.open('card-cache').then(function (cache) {
                    cache.addAll(arquivos)
                        .then(function () {
                            console.log("Arquivos cacheados com sucesso!");
                        });
                });

            }

        });

    }
}

