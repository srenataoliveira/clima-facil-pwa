const CACHE_NAME = "clima-facil-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];


/* Instalação */

self.addEventListener("install", function(event) {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(function(cache) {

                return cache.addAll(ARQUIVOS);

            })

    );

});


/* Ativação */

self.addEventListener("activate", function(event) {

    event.waitUntil(

        caches.keys()
            .then(function(chaves) {

                return Promise.all(

                    chaves
                        .filter(
                            chave =>
                                chave !== CACHE_NAME
                        )
                        .map(
                            chave =>
                                caches.delete(chave)
                        )

                );

            })

    );

});


/* Funcionamento */

self.addEventListener("fetch", function(event) {

    event.respondWith(

        caches.match(event.request)
            .then(function(resposta) {

                return resposta ||
                    fetch(event.request);

            })

    );

});