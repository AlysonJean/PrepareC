"use client";

import { useEffect } from "react";

// Carrega o selo "Desenvolvido por X Soluções Digitais" (<x-selo>), do repositório AlysonJean/x-solucoes-digitais.
// O jsDelivr manda o navegador guardar o arquivo por 7 dias: com o endereço fixo, quem já visitou o site ficaria até
// uma semana com o selo antigo. Por isso o endereço leva a hora (?h=, horas inteiras desde 1970, em UTC), e o navegador
// pede o arquivo de novo a cada hora. O jsDelivr ignora o parâmetro no cache dele, então todos os visitantes dividem a
// mesma cópia. A hora é calculada aqui, no navegador, porque o HTML da página pode vir de cache.
const SELO_URL = "https://cdn.jsdelivr.net/gh/AlysonJean/x-solucoes-digitais@main/selo/selo.js";
const HORA_MS = 60 * 60 * 1000;

export function SeloScript() {
    useEffect(() => {
        // Uma vez por página: navegar entre páginas não pede o arquivo de novo.
        if (customElements.get("x-selo") || document.querySelector("script[data-x-selo]")) return;
        const script = document.createElement("script");
        script.src = `${SELO_URL}?h=${Math.floor(Date.now() / HORA_MS)}`;
        script.async = true;
        script.referrerPolicy = "no-referrer"; // o jsDelivr não recebe o endereço da página
        script.dataset.xSelo = "";
        document.head.appendChild(script);
    }, []);
    return null;
}
