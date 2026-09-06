const formulario = document.getElementById("formulario");
const cidadeInput = document.getElementById("cidade");
const resultado = document.getElementById("resultado");
const botaoLocalizacao = document.getElementById("localizacao");


// Consultar cidade
formulario.addEventListener("submit", async function (event) {
    event.preventDefault();

    const cidade = cidadeInput.value.trim();

    if (cidade === "") {
        return;
    }

    resultado.innerHTML = "<p>🔄 Consultando clima...</p>";

    try {
        const resposta = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(cidade) +
            "&count=1&language=pt&format=json"
        );

        const dados = await resposta.json();

        if (!dados.results || dados.results.length === 0) {
            resultado.innerHTML =
                "<p class='erro'>❌ Cidade não encontrada.</p>";
            return;
        }

        const local = dados.results[0];

        buscarClima(
            local.latitude,
            local.longitude,
            local.name,
            local.country
        );

    } catch (erro) {
        resultado.innerHTML =
            "<p class='erro'>❌ Erro ao consultar a cidade.</p>";

        console.error(erro);
    }
});


// Buscar clima
async function buscarClima(latitude, longitude, nome, pais) {

    try {
        const url =
            "https://api.open-meteo.com/v1/forecast?" +
            "latitude=" + latitude +
            "&longitude=" + longitude +
            "&current=temperature_2m,relative_humidity_2m,weather_code" +
            "&timezone=auto";

        const resposta = await fetch(url);

        const dados = await resposta.json();

        const temperatura =
            dados.current.temperature_2m;

        const umidade =
            dados.current.relative_humidity_2m;

        const codigo =
            dados.current.weather_code;

        const descricao =
            interpretarClima(codigo);

        resultado.innerHTML =
            "<h2>📍 " + nome + "</h2>" +
            "<p>" + pais + "</p>" +
            "<div class='temperatura'>" +
            temperatura +
            "°C</div>" +
            "<p>" +
            descricao +
            "</p>" +
            "<p class='info'>💧 Umidade: " +
            umidade +
            "%</p>";

    } catch (erro) {

        resultado.innerHTML =
            "<p class='erro'>" +
            "❌ Não foi possível consultar o clima." +
            "</p>";

        console.error(erro);
    }
}


// Interpretar condição climática
function interpretarClima(codigo) {

    if (codigo === 0) {
        return "☀️ Céu limpo";
    }

    if (codigo >= 1 && codigo <= 3) {
        return "⛅ Parcialmente nublado";
    }

    if (codigo === 45 || codigo === 48) {
        return "🌫️ Neblina";
    }

    if (codigo >= 51 && codigo <= 57) {
        return "🌧️ Garoa";
    }

    if (codigo >= 61 && codigo <= 67) {
        return "🌧️ Chuva";
    }

    if (codigo >= 71 && codigo <= 77) {
        return "❄️ Neve";
    }

    if (codigo >= 80 && codigo <= 82) {
        return "🌦️ Pancadas de chuva";
    }

    if (codigo >= 95) {
        return "⛈️ Tempestade";
    }

    return "🌤️ Condição desconhecida";
}


// Usar localização do celular
botaoLocalizacao.addEventListener("click", function () {

    if (!navigator.geolocation) {

        resultado.innerHTML =
            "<p class='erro'>" +
            "❌ Seu dispositivo não suporta localização." +
            "</p>";

        return;
    }

    resultado.innerHTML =
        "<p>📍 Obtendo sua localização...</p>";

    navigator.geolocation.getCurrentPosition(

        function (posicao) {

            const latitude =
                posicao.coords.latitude;

            const longitude =
                posicao.coords.longitude;

            buscarClima(
                latitude,
                longitude,
                "Minha localização",
                ""
            );
        },

        function () {

            resultado.innerHTML =
                "<p class='erro'>" +
                "❌ Permita o acesso à sua localização." +
                "</p>";
        }
    );
});


// Registrar o Service Worker
if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker
            .register("./service-worker.js")
            .then(function () {
                console.log(
                    "Service Worker registrado!"
                );
            })
            .catch(function (erro) {
                console.error(
                    "Erro no Service Worker:",
                    erro
                );
            });

    });
}