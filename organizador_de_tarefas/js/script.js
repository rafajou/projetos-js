
let input = document.getElementById('tarefa');
let botao = document.getElementById('botao');
let lista = document.getElementById('lista');
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

function renderizarLista(){
    for(tarefa of tarefas){
        let itemLista = document.createElement('li');
        itemLista.setAttribute('class', 'list-group-item list-group-item-action');
        let itemTexto = document.createTextNode(tarefa);
        itemLista.onclick = function(){
            removerItem(this);
        }
        itemLista.appendChild(itemTexto);
        lista.appendChild(itemLista);

    }
}

function cadastrarDados(){
    return function(){
        removerSpans();
        let novaTarefa = input.value;
        if (novaTarefa != ''){
            tarefas.push(novaTarefa);
            input.value = ''
            lista.innerHTML = '';
            renderizarLista();
            salvarDadosNoStorage();
        }else{
            let card = document.querySelector('.card');
            let span = document.createElement('span');
            span.setAttribute('class', 'alert alert-warning');
            let textoAlerta = document.createTextNode('Você precisa informar a tarefa!');
            span.appendChild(textoAlerta);
            card.appendChild(span);
        }
    }
}

renderizarLista();

botao.onclick = cadastrarDados();

function removerSpans(){
    spans = document.querySelectorAll('span');
    card = document.querySelector('.card');
    for(span of spans){
        card.removeChild(span);
    }
}



function removerItem(item){
    removerSpans();
    let texto = item.textContent;
    let indice
    for(tarefa of tarefas){
        if(texto == tarefa){
            indice = tarefas.indexOf(tarefa);
            tarefas.splice(indice, 1)
        }
    }
    lista.innerHTML = '';
    renderizarLista();
    salvarDadosNoStorage()
}

function salvarDadosNoStorage(){
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}