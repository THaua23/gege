// --- DADOS E VARIÁVEIS GLOBAIS ---
const menu = {
    lanches: [
      { id: 1, nome: 'Hamburguer Clássico', ingredientes: ['pão', 'carne', 'salada'], preco: 8.00 },
      { id: 2, nome: 'Bomba Atômica', ingredientes: ['pão', 'carne', 'queijo', 'ovo', 'bacon', 'salada'], preco: 15.00, destaque: true },
      { id: 3, nome: 'X-Eggs', ingredientes: ['pão', 'carne', 'queijo', 'ovo'], preco: 12.50 },
      { id: 4, nome: 'X-Calabresa', ingredientes: ['pão', 'calabresa', 'queijo', 'salada'], preco: 12.00 },
      { id: 5, nome: 'Misto Quente', ingredientes: ['pão', 'presunto', 'queijo'], preco: 8.00 }
    ],
    bebidas: [
        { id: 6, nome: 'Suco de Maracujá', preco: 5.00 },
        { id: 7, nome: 'Suco de Laranja', preco: 5.00 },
        { id: 8, nome: 'Suco de Acerola', preco: 5.00 },
        { id: 9, nome: 'Suco de Goiaba', preco: 5.00 },
        { id: 10, nome: 'Suco de Manga', preco: 5.00 },
        { id: 11, nome: 'Refrigerante Lata', preco: 5.00, destaque: true }
    ]
};

// Array para armazenar o carrinho
let carrinho = [];

// Elementos DOM
const listaLanches = document.getElementById('lista-lanches');
const listaBebidas = document.getElementById('lista-bebidas');
const listaPedido = document.getElementById('lista-pedido');
const carrinhoVazio = document.getElementById('carrinho-vazio');
const valorTotalSpan = document.getElementById('valor-total');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const numeroWhatsapp = '5591985042796'; // <-- MUDAR PARA SEU NÚMERO DE TELEFONE

// Modal Elements
const modal = document.getElementById('modal-quantidade');
const modalItemNome = document.getElementById('modal-item-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnAdicionarModal = document.getElementById('btn-adicionar-modal');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnIncrementar = document.getElementById('btn-incrementar');
const btnDecrementar = document.getElementById('btn-decrementar');

let itemAbertoNoModal = null; // Armazena o item que está sendo configurado

// --- FUNÇÕES DE UTILIDADE ---

function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotal() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    valorTotalSpan.textContent = formatarPreco(total);
    
    // Habilita/Desabilita o botão do WhatsApp
    if (carrinho.length > 0) {
        btnWhatsapp.disabled = false;
        btnWhatsapp.textContent = 'Fazer Pedido por WhatsApp';
        carrinhoVazio.style.display = 'none';
    } else {
        btnWhatsapp.disabled = true;
        btnWhatsapp.textContent = 'Carrinho Vazio';
        carrinhoVazio.style.display = 'block';
    }
}

// --- RENDERIZAÇÃO DO MENU ---

function renderizarItemMenu(item, descricao, listaElemento, tipo) {
    const li = document.createElement('li');
    li.className = item.destaque ? 'item-menu destaque' : 'item-menu';
    
    const descricaoFormatada = Array.isArray(descricao) 
        ? descricao.join(', ')
        : descricao;

    li.innerHTML = `
        <span class="nome-item">${item.nome}</span>
        <span class="descricao-item">${descricaoFormatada}</span>
        <span class="preco-item">${formatarPreco(item.preco)}</span>
        <button class="btn-comprar" data-id="${item.id}" data-tipo="${tipo}">Comprar</button>
    `;

    listaElemento.appendChild(li);
}

// --- FUNÇÕES DO MODAL ---

function abrirModal(item) {
    itemAbertoNoModal = item;
    modalItemNome.textContent = item.nome;
    inputQuantidade.value = 1; // Reseta a quantidade para 1
    modal.style.display = 'block';
}

function fecharModal() {
    modal.style.display = 'none';
    itemAbertoNoModal = null;
}

function incrementarQuantidade(input) {
    let quantidade = parseInt(input.value);
    if (quantidade < 99) { 
        input.value = quantidade + 1;
    }
}

function decrementarQuantidade(input) {
    let quantidade = parseInt(input.value);
    if (quantidade > 1) {
        input.value = quantidade - 1;
    }
}

// --- FUNÇÕES DO CARRINHO ---

function adicionarItemAoCarrinho() {
    if (!itemAbertoNoModal) return;

    const quantidade = parseInt(inputQuantidade.value);
    
    if (isNaN(quantidade) || quantidade <= 0) {
        alert('Quantidade inválida.');
        return;
    }

    // Procura se o item já existe no carrinho para apenas somar a quantidade
    const itemExistente = carrinho.find(item => item.id === itemAbertoNoModal.id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
        // Adiciona um novo item
        carrinho.push({ 
            ...itemAbertoNoModal, 
            quantidade: quantidade, 
            tipo: itemAbertoNoModal.tipo 
        });
    }

    fecharModal();
    renderizarCarrinho();
}


function ajustarQuantidade(itemId, ajuste) {
    const item = carrinho.find(i => i.id === itemId);
    if (!item) return;

    item.quantidade += ajuste;

    if (item.quantidade <= 0) {
        // Remove o item se a quantidade chegar a zero
        const index = carrinho.findIndex(i => i.id === itemId);
        carrinho.splice(index, 1);
    }
    
    renderizarCarrinho();
}


function renderizarCarrinho() {
    listaPedido.innerHTML = ''; 

    if (carrinho.length === 0) {
        calcularTotal();
        return;
    }

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-menu'; 
        
        const subtotal = item.preco * item.quantidade;
        
        // Estrutura atualizada com os botões +/-
        li.innerHTML = `
            <span class="nome-item">${item.nome}</span>
            <span class="descricao-item">${formatarPreco(subtotal)}</span>
            <div class="controles-carrinho" data-id="${item.id}">
                <button class="btn-ajustar" data-ajuste="-">-</button>
                <span class="quantidade-display">${item.quantidade}</span>
                <button class="btn-ajustar" data-ajuste="+">+</button>
            </div>
        `;
        listaPedido.appendChild(li);
    });

    calcularTotal();
}

// --- GERAÇÃO DO PEDIDO VIA WHATSAPP ---

function gerarMensagemWhatsapp() {
    if (carrinho.length === 0) return;

    let mensagem = `Olá, gostaria de fazer o seguinte pedido da Lanchonete Delícia:\n\n`;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `* ${item.quantidade}x ${item.nome} (${formatarPreco(item.preco)}/un) = ${formatarPreco(subtotal)}\n`;
    });

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    mensagem += `\n*TOTAL GERAL:* ${formatarPreco(total)}\n\n`;
    mensagem += `Aguardamos a confirmação!`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensagemCodificada}`;

    window.open(linkWhatsapp, '_blank');
}


// --- INICIALIZAÇÃO E LISTENERS DE EVENTOS ---

// Renderiza o menu no carregamento
menu.lanches.forEach(lanche => {
    lanche.tipo = 'lanche'; 
    renderizarItemMenu(lanche, lanche.ingredientes, listaLanches, 'lanche');
});

menu.bebidas.forEach(bebida => {
    bebida.tipo = 'bebida'; 
    renderizarItemMenu(bebida, 'Opções: Copo 300ml.', listaBebidas, 'bebida');
});

// Listener principal para todos os cliques no documento
document.addEventListener('click', (e) => {
    
    // 1. Clique no botão de COMPRAR do MENU
    if (e.target.classList.contains('btn-comprar')) {
        const itemId = parseInt(e.target.dataset.id);
        const itemTipo = e.target.dataset.tipo;
        const itensNoMenu = itemTipo === 'lanche' ? menu.lanches : menu.bebidas;
        const itemSelecionado = itensNoMenu.find(i => i.id === itemId);
        
        if (itemSelecionado) {
            abrirModal(itemSelecionado);
        }
    }
    
    // 2. Clique nos botões de ajuste de quantidade (+/-) no CARRINHO
    if (e.target.classList.contains('btn-ajustar')) {
        const controleDiv = e.target.closest('.controles-carrinho');
        const itemId = parseInt(controleDiv.dataset.id);
        const ajuste = e.target.dataset.ajuste === '+' ? 1 : -1;
        
        ajustarQuantidade(itemId, ajuste);
    }
});


// 3. Listeners do Modal
btnFecharModal.addEventListener('click', fecharModal);
btnAdicionarModal.addEventListener('click', adicionarItemAoCarrinho);

// Botões de incremento/decremento dentro do Modal
btnIncrementar.addEventListener('click', () => incrementarQuantidade(inputQuantidade));
btnDecrementar.addEventListener('click', () => decrementarQuantidade(inputQuantidade));

// Ocultar modal se clicar fora dele
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

// Listener para o botão do WhatsApp
btnWhatsapp.addEventListener('click', gerarMensagemWhatsapp);

// Inicializa o carrinho
calcularTotal();