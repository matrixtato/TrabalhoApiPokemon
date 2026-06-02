// Seleção dos elementos da interface
const form1 = document.getElementById("CardPokemon1");
const form2 = document.getElementById("CardPokemon2");
const checkboxLista = document.getElementById("exibirLista");
const checkboxLista2 = document.getElementById("exibirLista2");
const campoTexto = document.getElementById("personagens");
const campoTexto2 = document.getElementById("personagens2");
const comboLista = document.getElementById("listaPersonagens");
const comboLista2 = document.getElementById("listaPersonagens2");

// Busca a lista inicial de Pokémons para o Select
async function carregarLista(elementoCombo) {
    try {
        const resposta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        const dados = await resposta.json();
        
        const listaOrdenada = dados.results.sort((a, b) => a.name.localeCompare(b.name));

        elementoCombo.innerHTML = listaOrdenada
            .map(p => `<option value="${p.name}">${p.name.toUpperCase()}</option>`)
            .join("");
    } catch (erro) {
        console.error("Erro ao carregar lista:", erro);
    }
}

// Controle de alternância entre Input de Texto e Select
checkboxLista.addEventListener("change", function() {
    if (this.checked) {
        campoTexto.style.display = "none";
        campoTexto.required = false;
        comboLista.style.display = "inline-block";
        if (comboLista.options.length === 0) carregarLista(comboLista); 
    } else {
        campoTexto.style.display = "block";
        campoTexto.required = true;
        comboLista.style.display = "none";
    }
});

checkboxLista2.addEventListener("change", function() {
    if (this.checked) {
        campoTexto2.style.display = "none";
        campoTexto2.required = false;
        comboLista2.style.display = "inline-block";
        if (comboLista2.options.length === 0) carregarLista(comboLista2);
    } else {
        campoTexto2.style.display = "block";
        campoTexto2.required = true;
        comboLista2.style.display = "none";
    }
});

// Listeners para submissão dos formulários
form1.addEventListener("submit", function(evento){
    evento.preventDefault();
    const nome = checkboxLista.checked ? comboLista.value : campoTexto.value;
    buscarPersonagens(nome, "");
});

form2.addEventListener("submit", function(evento){
    evento.preventDefault();
    const nome = checkboxLista2.checked ? comboLista2.value : campoTexto2.value;
    buscarPersonagens(nome, "2");
});

// Busca detalhes do Pokémon e atualiza o Card
async function buscarPersonagens(nome, sufixo) {
    const url = `https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`;
    try {
        const resposta = await fetch(url);
        if (!resposta.ok){
            throw new Error("Pokemon não encontrado na base de dados!");
        }
        const dados = await resposta.json();

        document.getElementById(`imagempkn${sufixo}`).src = dados.sprites.front_default;
        document.getElementById(`Nomepkn${sufixo}`).textContent = dados.name;
        document.getElementById(`HPpkn${sufixo}`).textContent = dados.stats[0].base_stat;
        document.getElementById(`ATKpkn${sufixo}`).textContent = dados.stats[1].base_stat;
        document.getElementById(`DEFpkn${sufixo}`).textContent = dados.stats[2].base_stat;
        document.getElementById(`SPDpkn${sufixo}`).textContent = dados.stats[5].base_stat;
        document.getElementById(`Tipopkn${sufixo}`).textContent = dados.types[0].type.name;

        compararStats();
    } catch (erro) {
        console.error("falha na comunicação", erro);
        alert("Pokémon não encontrado!");
    }
}

// Compara os atributos entre os dois Pokémons carregados
function compararStats() {
    const atributos = ["HP", "ATK", "DEF", "SPD"];
    atributos.forEach(attr => {
        const val1 = parseInt(document.getElementById(`${attr}pkn`).textContent);
        const val2 = parseInt(document.getElementById(`${attr}pkn2`).textContent);
        
        const campoRes1 = document.getElementById(`${attr === "HP" ? "HP" : attr}rest`);
        const campoRes2 = document.getElementById(`${attr === "HP" ? "HP" : attr}rest2`);

        if (!isNaN(val1) && !isNaN(val2)) {
            const diff1 = val1 - val2;
            campoRes1.textContent = ` -------> ${diff1 > 0 ? "+" : ""}${diff1}`;
            campoRes1.style.color = diff1 > 0 ? "green" : (diff1 < 0 ? "red" : "black"); 

            const diff2 = val2 - val1;
            campoRes2.textContent = ` -------> ${diff2 > 0 ? "+" : ""}${diff2}`;
            campoRes2.style.color = diff2 > 0 ? "green" : (diff2 < 0 ? "red" : "black");
        }
    });
}
