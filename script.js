// --- DADOS E VARIÁVEIS GLOBAIS ---
const menu = {
    lanches: [
        { id: 1, nome: 'Bomba', ingredientes: ['Pão', 'carne', 'queijo', 'ovo', 'salsicha', 'salada'], preco: 15.00 , destaque: true},
        { id: 2, nome: 'Bomba de Calabresa', ingredientes: ['Pão', 'carne', 'calabresa', 'queijo', 'ovo', 'salsicha', 'salada'], preco: 16.00 },
        { id: 3, nome: 'Xeggs Calabresa', ingredientes: ['Pão', 'carne', 'calabresa', 'queijo', 'ovo'], preco: 15.00 },
        { id: 4, nome: 'Hamburguer Simples', ingredientes: ['Pão', 'carne', 'salada'], preco: 10.00 },
        { id: 5, nome: 'Misto Quente', ingredientes: ['Pão', 'presunto', 'queijo'], preco: 10.00 },
        { id: 6, nome: 'Queijo Quente', ingredientes: ['Pão', 'queijo'], preco: 9.00 },
        { id: 7, nome: 'X Calabresa', ingredientes: ['Pão', 'carne', 'calabresa', 'queijo'], preco: 13.00 },
        { id: 8, nome: 'X Eggs Bacon', ingredientes: ['Pão', 'carne', 'bacon', 'queijo', 'ovo', 'salada'], preco: 25.00, destaque: true }
    ],
    adicionais: [
        { id: 9, nome: 'Ovo', preco: 2.00 },
        { id: 10, nome: 'Salsicha', preco: 2.00 },
        { id: 11, nome: 'Carne', preco: 3.00 },
        { id: 12, nome: 'Calabresa', preco: 5.00 },
        { id: 13, nome: 'Queijo', preco: 3.50 },
        { id: 14, nome: 'Bacom', preco: 8.00 }
    ],
    bebidas: [
        { id: 15, nome: 'Coca lata', preco: 5.00 },
        { id: 16, nome: 'Coca ks', preco: 5.00 },
        { id: 17, nome: 'Coca 600 ml', preco: 7.00 },
        { id: 18, nome: 'Coca 1 litro', preco: 10.00 },
        { id: 19, nome: 'Coca 2 litros', preco: 13.00 },
        { id: 20, nome: 'Guaraná lata', preco: 5.00 },
        { id: 21, nome: 'Guaraná 600 ml', preco: 6.00 },
        { id: 22, nome: 'Guaraná 1 litro', preco: 8.00 },
        { id: 23, nome: 'Guaraná 2 litros', preco: 12.00 },
        { id: 24, nome: 'Sucos', preco: 5.00 }
    ],
    sorvetes: [
        { id: 25, nome: 'Copão', preco: 6.00 },
        { id: 26, nome: 'Moreninha', preco: 6.00 },
        { id: 27, nome: 'Capinho', preco: 5.00 },
        { id: 28, nome: 'Picolé Especial', preco: 5.00 },
        { id: 29, nome: 'Picolé Regional', preco: 4.00 },
        { id: 30, nome: 'Picolé Recheado', preco: 8.00 }
    ]
};

// Array para armazenar o carrinho
let carrinho = [];

// Elementos DOM
const listaLanches = document.getElementById('lista-lanches');
const listaBebidas = document.getElementById('lista-bebidas');
const listaSorvetes = document.getElementById('lista-sorvetes');
const listaPedido = document.getElementById('lista-pedido');
const valorTotalSpan = document.getElementById('valor-total');
const valorTotalFixoSpan = document.getElementById('valor-total-fixo');
const btnWhatsapp = document.getElementById('btn-whatsapp');
const btnVerCarrinho = document.getElementById('btn-ver-carrinho');
const carrinhoVazio = document.getElementById('carrinho-vazio');

// Números e chaves
const numeroWhatsapp = '5591985042796'; // Número de Telefone com "55"
const chavePix = '91985042796'; // PIX: Número sem o "55"

// Modal Elements
const modal = document.getElementById('modal-quantidade');
const modalItemNome = document.getElementById('modal-item-nome');
const inputQuantidade = document.getElementById('input-quantidade');
const btnAdicionarModal = document.getElementById('btn-adicionar-modal');
const btnFecharModal = document.getElementById('btn-fechar-modal');
const btnIncrementar = document.getElementById('btn-incrementar');
const btnDecrementar = document.getElementById('btn-decrementar');

let itemAbertoNoModal = null; 

// --- FUNÇÕES DE UTILIDADE ---

function formatarPreco(preco) {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularTotal() {
    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    const totalFormatado = formatarPreco(total);

    valorTotalSpan.textContent = totalFormatado; 
    valorTotalFixoSpan.textContent = totalFormatado; 
    
    if (carrinho.length > 0) {
        btnWhatsapp.disabled = false;
        btnWhatsapp.textContent = 'Fazer Pedido por WhatsApp';
        btnVerCarrinho.removeAttribute('disabled');
        carrinhoVazio.style.display = 'none';
    } else {
        btnWhatsapp.disabled = true;
        btnWhatsapp.textContent = 'Carrinho Vazio';
        btnVerCarrinho.setAttribute('disabled', 'disabled');
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
    inputQuantidade.value = 1; 
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

    const itemExistente = carrinho.find(item => item.id === itemAbertoNoModal.id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
    } else {
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
        const index = carrinho.findIndex(i => i.id === itemId);
        carrinho.splice(index, 1);
    }
    
    renderizarCarrinho();
}


function renderizarCarrinho() {
    listaPedido.innerHTML = ''; 

    if (carrinho.length === 0) {
        const liVazio = document.createElement('li');
        liVazio.id = 'carrinho-vazio';
        liVazio.className = 'item-menu';
        liVazio.style.display = 'block';
        liVazio.innerHTML = `
            <span class="nome-item">Seu carrinho está vazio.</span>
            <span class="descricao-item">Clique em um item do menu para adicionar.</span>
        `;
        listaPedido.appendChild(liVazio);
        calcularTotal();
        return;
    }

    carrinho.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item-menu'; 
        
        const subtotal = item.preco * item.quantidade;
        
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

// --- GERAÇÃO DO PEDIDO VIA WHATSAPP (com PIX) ---

function gerarMensagemWhatsapp() {
    if (carrinho.length === 0) return;

    let mensagem = `*Olá, meu pedido da Lanchonete Do GEGÉ é o seguinte:*\n\n`;
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        mensagem += `* ${item.quantidade}x ${item.nome} = ${formatarPreco(subtotal)}\n`;
    });

    const total = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    mensagem += `\n*TOTAL GERAL:* ${formatarPreco(total)}\n`;
    
    // Adiciona a informação do PIX
    mensagem += `\n*FORMA DE PAGAMENTO:* PIX\n`;
    mensagem += `*CHAVE PIX (CELULAR):* ${chavePix}\n`;
    mensagem += `\nPor favor, confirme a disponibilidade e o valor do frete.`;

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
    renderizarItemMenu(bebida, 'Diversos tamanhos e sabores', listaBebidas, 'bebida');
});

menu.sorvetes.forEach(sorvete => {
    sorvete.tipo = 'sorvete';
    let descricao;
    if (sorvete.nome.includes('Picolé')) {
        descricao = 'Delicioso picolé';
    } else {
        descricao = 'Sobremesa gelada';
    }
    renderizarItemMenu(sorvete, descricao, listaSorvetes, 'sorvete');
});


// Listener principal para todos os cliques no documento
document.addEventListener('click', (e) => {
    
    // 1. Clique no botão de COMPRAR do MENU
    if (e.target.classList.contains('btn-comprar')) {
        const itemId = parseInt(e.target.dataset.id);
        const itemTipo = e.target.dataset.tipo;
        
        let itensNoMenu;
        if (itemTipo === 'lanche') {
            itensNoMenu = menu.lanches;
        } else if (itemTipo === 'bebida') {
            itensNoMenu = menu.bebidas;
        } else if (itemTipo === 'sorvete') {
            itensNoMenu = menu.sorvetes;
        } else {
            return;
        }

        const itemSelecionado = itensNoMenu.find(i => i.id === itemId);
        
        if (itemSelecionado) {
            abrirModal({...itemSelecionado, tipo: itemTipo});
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
btnWhatsapp.addEventListener('click', (e) => {
    e.preventDefault(); 
    gerarMensagemWhatsapp();
});

// Listener para o botão/link do carrinho (rolagem suave)
btnVerCarrinho.addEventListener('click', (e) => {
    if (btnVerCarrinho.hasAttribute('disabled')) {
        e.preventDefault();
        return;
    }
    document.getElementById('carrinho').scrollIntoView({ behavior: 'smooth' });
    e.preventDefault();
});


// Inicializa o carrinho
calcularTotal();