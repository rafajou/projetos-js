function novoElemento(tagName, className){
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reverso = false){
    this.elemento = novoElemento('div', 'barreira');
    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');

    this.elemento.appendChild(reverso ? corpo : borda);
    this.elemento.appendChild(reverso ? borda : corpo);
    this.setAltura = altura => corpo.style.height = `${altura}px`;
}


function parDeBarreiras(altura, abertura, x){
    this.elemento = novoElemento('div', 'par-de-barreiras');
    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSup = Math.random() * (altura-abertura);
        const alturaInf = altura - abertura - alturaSup;
        this.superior.setAltura(alturaSup);
        this.inferior.setAltura(alturaInf);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setX(x);
}

/* const b = new parDeBarreiras(550, 200, 400);
document.querySelector('[wm-flappy]').appendChild(b.elemento); */

function Barreiras(altura, largura, abertura, espaco, notificarPonto){
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const desloc = 3;

    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - desloc);
            if (par.getX() < -par.getLargura()){
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            }
            const meio = largura/2;
            const cruzouOMeio = par.getX() + desloc >= meio && par.getX() < meio;
            if(cruzouOMeio) notificarPonto(); 
        })
    }
}



function Passaro(alturaJogo, tempor){
    let voando = false;
    this.elemento = novoElemento('img', 'passaro');
    this.elemento.src = 'imgs/passaro.png';
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0]);
    this.setY = y => this.elemento.style.bottom = `${y}px`;

    window.onkeydown = e => voando = true;
    window.onkeyup = e => voando = false;

    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5);
        const alturaMaxima = alturaJogo - this.elemento.clientHeight;
        if (novoY <= 0){
            this.setY(0);
        }else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        }else{
            this.setY(novoY);
        }
    }

    this.setY(alturaJogo / 2);
}

function Progresso(){
    this.elemento = novoElemento('div', 'progresso');
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}


function estaoSobrepostos(elemA, elemB){
    const a = elemA.getBoundingClientRect();
    const b = elemB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top

    return horizontal && vertical
}

function colisao(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(par => {
        if (!colidiu) {
            const superior = par.superior.elemento;
            const inferior = par.inferior.elemento;
            colidiu = estaoSobrepostos(passaro.elemento, superior)
                || estaoSobrepostos(passaro.elemento, inferior);
        }
    })
    return colidiu;
}






function FlappyBird(){
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]');
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    const progresso = new Progresso();
    const barreiras = new Barreiras(altura, largura, 200, 400, 
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura);

    areaDoJogo.appendChild(progresso.elemento);
    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par => {
        areaDoJogo.appendChild(par.elemento);
    })

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            if (colisao(passaro, barreiras)){
                clearInterval(temporizador);
            }
        }, 20)
    }


}

new FlappyBird().start();







/* const areadojogo = document.querySelector('[wm-flappy]');
const b = new Barreiras(550, 1200, 200, 400);
const passaro = new Passaro(550);
const progresso = new Progresso
b.pares.forEach(par => {
    areadojogo.appendChild(par.elemento);
})
areadojogo.appendChild(passaro.elemento);
areadojogo.appendChild(progresso.elemento);
setInterval(() => {
    b.animar();
    passaro.animar()
}, 20);
 */





