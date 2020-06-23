'use strict';

const CACHE_NAME = 'rentcar-app-v1';

const FILES_TO_CACHE = [

    'favicon.ico',
    'images/logo.jpg',
    'images/brackground2.jpg',
    'styles.css',
    'css/bootstrap.min.css',
    'js/bootstrap.min.js',
    'js/jquery-3.5.1.slim.min.js',
    'js/popper.min.js',
    'js/popper.min.js.map'
];

//Instala o service worker no browser
self.addEventListener('install', (evt) => {

    console.log('[ServiceWorker] Instalando...');

    evt.waitUntil(

        caches.open(CACHE_NAME).then((cache) => {

            console.log('[ServiceWorker] Fazendo cache dos arquivos da aplicação');
            return cache.addAll(FILES_TO_CACHE);
        })

    );
    self.skipWaiting();
});

//Gera o CACHE dos arquivos estáticos
self.addEventListener('activate', (evt) => {

    console.log('[ServiceWorker] Ativando...');

    evt.waitUntil(

        caches.keys().then((keylist) => {

            return Promise.all(keylist.map((key) => {

                //console.log('[ServiceWorker] Removendo cache antigo...');
                if(key !== CACHE_NAME){
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

//Responder a versão offline do app
// self.addEventListener('fetch', (evt) => {
//     console.log('[ServiceWorker] Recebendo', evt.request.url);

//     if (evt.request.mode !== 'navigate') {

//         return;
//     }
//     evt.respondWith(
//         fetch(evt.request)
//             .catch(() => {
//                 return caches.open(CACHE_NAME)
//                     .then((cache) => {
//                         return cache.match('index.html');
//                     });
//             })
//     );

    self.addEventListener('fetch', (event) => {
        event.respondWith(
          caches.match(event.request)
            .then((response) => {
                return response ?? fetch(event.request);
              }
            )
        );
      });