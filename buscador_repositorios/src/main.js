import api from './api';

class App{
    constructor(){
        this.repositorios = JSON.parse(localStorage.getItem('repositorios')) || [];
        this.formulario = document.querySelector('form');
        this.registrarEventos();
        this.lista = document.querySelector('.list-group')
    }


    registrarEventos(){
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }

    async adicionarRepositorio(evento){

        evento.preventDefault();

        let input = this.formulario.querySelector('input[id=repositorio]').value;

        if(input.lenght === 0){
            return;
        }

        this.buscandoRepositorio();
        try {
            let response = await api.get(`/repos/${input}`);

            console.log(response);

            let {name, description, html_url, owner: {avatar_url}} = response.data;

            
            this.repositorios.push({
                nome: name,
                descricao: description,
                avatar_url,
                link:html_url
            });

            this.renderizarTela();
            this.salvarDadosNoStorage();
        } catch (error) {
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));
            let er = this.lista.querySelector('.list-group-item-danger');
            if(er !== null){
                this.lista.removeChild(er);
            }

            let erro = document.createElement('li')
            erro.setAttribute('class', 'list-group-item list-group-item-danger');
            let erroTxt = document.createTextNode(`Não foi possível encontrar o repositório ${input}`)
            erro.appendChild(erroTxt);
            this.lista.appendChild(erro);
        }
        
    }

    renderizarTela(){
        this.lista.innerHTML = ''
        if (this.repositorios !== []){
            for(let repositorio of this.repositorios){
                let itemLista = document.createElement('li');
                itemLista.onclick = function(){
                    console.log(itemLista.querySelector('strong').innerHTML);
                    removerItem(this);
                }
                itemLista.setAttribute('class', 'list-group-item list-group-item-action');
                let img = document.createElement('img')
                img.setAttribute('src', repositorio.avatar_url);
                let strong = document.createElement('strong');
                let strTxt = document.createTextNode(repositorio.nome);
                let p = document.createElement('p');
                let pTxt = document.createTextNode(repositorio.descricao);
                let a = document.createElement('a');
                a.setAttribute('target', '_blank')
                a.setAttribute('href', repositorio.link);
                let aTxt = document.createTextNode('Acessar');
                strong.appendChild(strTxt);
                p.appendChild(pTxt);
                a.appendChild(aTxt);
                itemLista.appendChild(img);
                itemLista.appendChild(strong);
                itemLista.appendChild(p);
                itemLista.appendChild(a);
                this.lista.appendChild(itemLista);
                this.formulario.querySelector('input[id=repositorio]').value = '';
                this.formulario.querySelector('input[id=repositorio]').focus();
            }
        }
    }

    buscandoRepositorio(){
        let busc = document.createElement('li')
        busc.setAttribute('class', 'list-group-item list-group-item-warning');
        let txtBusc = document.createTextNode('Buscando o repositório');
        busc.appendChild(txtBusc);
        this.lista.appendChild(busc);
    }

    salvarDadosNoStorage(){
        localStorage.setItem('repositorios', JSON.stringify(this.repositorios));
    }

    
    
    


    

}

let app = new App();

function removerItem(item){
    let nomeRep = item.querySelector('strong').innerHTML;
    let indice
    for(let repositorio of app.repositorios){
        if(nomeRep === repositorio.nome){
            indice = app.repositorios.indexOf(repositorio);
            app.repositorios.splice(indice,1);
        }
    }
    app.renderizarTela();
    app.salvarDadosNoStorage();
}


app.renderizarTela();
