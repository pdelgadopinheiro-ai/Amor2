// =========================
// ELEMENTOS DA PÁGINA
// =========================

const fotoInput = document.getElementById("fotoInput");
const buttonAddFoto = document.getElementById("button-addFoto");
const buttonPlayMusica = document.getElementById("button-playMusica");
const carousel = document.getElementById("carousel");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

let imagens = [];
let indexAtual = 0;

// =========================
// BOTÃO ADICIONAR FOTO
// =========================

if (buttonAddFoto && fotoInput) {
    buttonAddFoto.addEventListener("click", function () {
        fotoInput.click();
    });
}

// quando o usuário seleciona imagens
if (fotoInput) {
    fotoInput.addEventListener("change", function () {
        const arquivos = this.files;

        if (!arquivos || arquivos.length === 0) return;

        for (let i = 0; i < arquivos.length; i++) {
            const reader = new FileReader();

            reader.onload = function (evento) {
                imagens.push(evento.target.result);
                atualizarCarrossel();
            };

            reader.readAsDataURL(arquivos[i]);
        }
    });
}

// =========================
// RENDERIZAÇÃO DO CARROSSEL
// =========================

function atualizarCarrossel() {
    if (!carousel) return;

    carousel.innerHTML = "";

    if (imagens.length === 0) return;

    const img = document.createElement("img");
    img.src = imagens[indexAtual];
    img.alt = "Foto carregada";

    carousel.appendChild(img);
}

// =========================
// BOTÃO PRÓXIMA FOTO
// =========================

if (nextButton) {
    nextButton.addEventListener("click", function () {
        if (imagens.length === 0) return;

        indexAtual++;

        if (indexAtual >= imagens.length) {
            indexAtual = 0;
        }

        atualizarCarrossel();
    });
}

// =========================
// BOTÃO FOTO ANTERIOR
// =========================

if (prevButton) {
    prevButton.addEventListener("click", function () {
        if (imagens.length === 0) return;

        indexAtual--;

        if (indexAtual < 0) {
            indexAtual = imagens.length - 1;
        }

        atualizarCarrossel();
    });
}

// =========================
// ADICIONAR SPOTIFY
// =========================

// Troque este link pelo da música/playlist/álbum que você quiser tocar.
const SPOTIFY_LINK_FIXO = "https://open.spotify.com/intl-pt/track/4f4WCZ4eOxQW6Jn4nu3sqZ?si=54fc52fcf80d4810";

function montarEmbedSpotify(link) {
    let embed = "";
    let tipoConteudo = "";

    try {
        const url = new URL(link);
        const partes = url.pathname.split("/").filter(Boolean);
        const tiposValidos = ["track", "album", "playlist", "episode", "show", "artist"];
        const inicioTipo = partes[0] && partes[0].startsWith("intl-") ? 1 : 0;
        const tipo = partes[inicioTipo];
        const id = partes[inicioTipo + 1];

        if (url.hostname.includes("spotify.com") && tiposValidos.includes(tipo) && id) {
            embed = `https://open.spotify.com/embed/${tipo}/${id}`;
            tipoConteudo = tipo;
        }
    } catch (e) {
        const partesUri = link.split(":");
        if (partesUri.length === 3 && partesUri[0] === "spotify") {
            const tipo = partesUri[1];
            const id = partesUri[2];
            const tiposValidos = ["track", "album", "playlist", "episode", "show", "artist"];

            if (tiposValidos.includes(tipo) && id) {
                embed = `https://open.spotify.com/embed/${tipo}/${id}`;
                tipoConteudo = tipo;
            }
        }
    }

    if (!embed) return null;
    return { embed, tipoConteudo };
}

function adicionarSpotifyAutomatico(autoplay) {
    const player = document.getElementById("spotifyPlayer");
    if (!player) return;

    const dadosSpotify = montarEmbedSpotify(SPOTIFY_LINK_FIXO);

    if (!dadosSpotify) {
        player.innerHTML = "<p>Link fixo do Spotify inválido.</p>";
        return;
    }

    const { embed, tipoConteudo } = dadosSpotify;
    const altura = tipoConteudo === "track" || tipoConteudo === "episode" ? 152 : 352;
    const srcComAutoplay = autoplay ? `${embed}?autoplay=1` : embed;

    const iframe = document.createElement("iframe");
    iframe.src = srcComAutoplay;
    iframe.width = "100%";
    iframe.height = String(altura);
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen";
    iframe.style.width = "100%";
    iframe.style.height = `${altura}px`;

    player.innerHTML = "";
    player.appendChild(iframe);
}

document.addEventListener("DOMContentLoaded", function () {
    adicionarSpotifyAutomatico(false);
    if (buttonPlayMusica) {
        buttonPlayMusica.addEventListener("click", function () {
            adicionarSpotifyAutomatico(true);
        });
    }
});
