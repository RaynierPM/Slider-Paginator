var slider = {
    sliderTimeOut: null,
    template: '',
    desplazamiento: null,
    paginator: 2,
    carrusel: document.querySelector('.slider > .carrusel'),
    slider: document.querySelector('.slider'),
    atrasBoton: document.querySelector('.atrasBoton'),
    luegoBoton: document.querySelector('.luegoBoton'),
    promise: async function (pag = 1) {
        try {
            pag = pag * 4;
            const response = await fetch(`https://randomuser.me/api/?results=${pag}`);
            
            let res = await response.json();
            return res.results;
        } catch (error) {
            console.log(error)
        }    
    }, 
    consulta: async function(pag) {
        let respuesta = await this.promise(pag);
        respuesta.forEach(element => {
            let fecha = element.registered.date.split('T');
            this.template += `<div class="element" style="background-image: url(${element.picture.large}); background-repeat: no-repeat; background-size: cover; backgroun-position: center center;">
            <h3>${element.name.first} ${element.name.last}</h3>
            <p>Nacio: ${fecha[0]}</p>                
            </div>`;
        });
        this.carrusel.innerHTML += this.template;
        this.template = ``;
        this.desaparecerAparecer()
        this.calcularDesplazamiento();
    
    },
    listeners() {
        this.slider.addEventListener('scroll', e => {
    
            if (e.target.scrollLeft >= (e.target.scrollWidth - e.target.clientWidth) - (e.target.clientWidth/2)) {
                clearTimeout(this.sliderTimeOut);
                this.sliderTimeOut = setTimeout(async () => {
                    this.consulta(this.paginator);
                    this.paginator++;
                }, 250);
            }
            this.desaparecerAparecer();
        });
        
        // Listener para los botones 
        this.slider.addEventListener('click', e => {
            if (e.target.className == 'atrasBoton') {
                this.slider.scrollTo({
                    top: 0,
                    left: this.slider.scrollLeft - this.desplazamiento,
                    behavior: 'smooth'
                });
                
            }else if(e.target.className == 'luegoBoton') {
                this.slider.scrollTo({
                    top: 0,
                    left: this.slider.scrollLeft + this.desplazamiento,
                    behavior: 'smooth'
                });
            }   

        });

        window.addEventListener('resize', () => {
            this.calcularDesplazamiento();
            this.desaparecerAparecer();
        });
    },
    desaparecerAparecer() {
        // Si no ha elementos en el slider o el tamanio de la pantalla es muy pequenio se eliminan los botones
        if (this.slider.children.length == 0 || window.innerWidth <= 768) {
            this.atrasBoton.style.display = 'none';
            this.luegoBoton.style.display = 'none';
        }else {

            // Si el carrusel llega la borde desaparece el boton del respectivo lado
            if (this.slider.scrollLeft <= 0){
                this.atrasBoton.style.display = 'none';
            }else {
                this.atrasBoton.style.display = 'flex';
            }
            
            if (this.slider.scrollLeft >= (this.slider.scrollWidth - this.slider.clientWidth)){
                this.luegoBoton.style.display = 'none';
            }else {
                this.luegoBoton.style.display = 'flex';
            }
        }

        
    },primeraEjecucion() {
        this.consulta(this.paginator);
        this.paginator++;
        this.listeners()
    },
    calcularDesplazamiento() {
        // Si la pantalla es de 768px o mas, el desplazamiento del slider es de 3 elementos y mas 3 veces el margen izquierdo (10px)
        if (window.innerWidth >= 768) {
            this.desplazamiento = (document.querySelector('.carrusel > .element').clientWidth + 10) * 3;


        // Si la pantalla es de 576px o mas, el desplazamiento del slider es de 2 elementos y mas 2 veces el margen izquierdo (10px)
        }else if (window.innerWidth >= 576) {
            this.desplazamiento = (document.querySelector('.carrusel > .element').clientWidth + 10) * 2;


        // Si la pantalla es de 576px o mas, el desplazamiento del slider es de 1 elemento y mas 1 vez el margen izquierdo (10px)
        }else {
            this.desplazamiento = document.querySelector('.carrusel > .element').clientWidth + 10;
        }
    }
}

slider.primeraEjecucion();