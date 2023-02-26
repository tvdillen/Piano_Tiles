/************************************************************************
    Opdracht: Piano-Tiles 
    Groep: Chris Groenewoud, Sebastiaan Willemsen, Tim van Dillen, Thijs Severs. 
    Klas: 5HC
    Schooljaar: 2022/2023
*************************************************************************/


function startSpel(){
    var _spel = new spel(); 

    /* Event afhandelaar wanneer er binnen de spelCanvas geklikt wordt
       Voor het toevoegen van de addEventListener hebben we gebruik gemaakt van [W3Schools events]*/
    document.getElementById('spelCanvas').addEventListener('click', function(e){
        let positie = _spel.geefMuisPositie(document.getElementById('spelCanvas'),e);
        _spel.klikAfhandelen(positie);
    });  
    
    /*Event afhandelaar op de start knop zodat het spel gestart en gepauzeerd kan worden. 
       basis voor dit stukje JavaScript komt van [eecheng87] deze hebben we aangepast*/
    document.getElementById('knop').addEventListener('click',function(e){
        let knop = document.getElementById('start_knop');
        if(knop.innerHTML == "START"){
            knop.innerHTML = "STOP";
            _spel.start();
        }
        else if (knop.innerHTML == "START OPNIEUW"){
            knop.innerHTML == "STOP"
            _spel.herStart();
        }
        else if (knop.innerHTML == "STOP"){         
            knop.innerHTML = "START OPNIEUW";
            _spel.stop();
        }
    });
}


 class Spelbord {
    constructor(spel)
        {
            this.spel = spel;
            this.initialiseerSpel();
        }

        initialiseerSpel(){
            this.x = 50; // Afstand ten op zichte van de linkerkant van het scherm
            this.y = 10; // Afstand ten op zichte van de bovenkant van het scherm

            this.kolomen = 4;
            this.rijen = 5; 

            this.kolomBreedte = 100;
            this.rijHoogte = 100;

            this.titelBalkHoogte = 70;
            this.voetBalkHoogte = 70;

            //bereken de breedte van het spelbord
            this.breedteSpelGebied = this.kolomBreedte * this.kolomen;
            //bereken de hoogte van het spelbord; 
            this.hoogteSpelGebied = this.rijHoogte * this.rijen; 

            this.achtergrondKleurSpelGebied = "#f5fffa"; // Mint cream
            this.achtergrondKleurBalk = "#B6D0E2"; // Licht blauw
            
            // maak een lege lijst waarin de blokken gezet kunnen worden. 
            this.blokken = []; 

            for (var i = 0; i < 20; i++){
                if (i<5){
                    this.blokken[i] = new Blok(this.x, this.y + this.rijHoogte * i , this.kolomBreedte, this.rijHoogte, "#FFFFFF", i);
                }
                else if (i>=5 && i<10){
                    this.blokken[i] = new Blok(this.x + this.kolomBreedte, this.y + this.rijHoogte*(i-5)  , this.kolomBreedte, this.rijHoogte, "#FFFFFF", i);
                }
                else if (i>=10 && i<15){
                    this.blokken[i] = new Blok(this.x + (this.kolomBreedte * 2), this.y + this.rijHoogte*(i-10)  , this.kolomBreedte, this.rijHoogte, "#FFFFFF", i);
                }
                else if (i>=15 && i<20){
                    this.blokken[i] = new Blok(this.x + this.kolomBreedte*3, this.y + this.rijHoogte*(i-15)  , this.kolomBreedte, this.rijHoogte, "#FFFFFF", i);
                }
            }
        }

        renderTitelBalk(bericht){
            //teken de titelbalk 
            var c = document.getElementById("titelbalk");
            //onderstaande code op basis van document [Game design doc].  
            this.ctx = c.getContext("2d");

            this.ctx.fillStyle = this.achtergrondKleurBalk;
            this.ctx.fillRect (this.x, this.y, this.breedteSpelGebied, this.titelBalkHoogte);

            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "#000000"; //zwart 
            this.ctx.fillText(bericht, this.x + 25, this.y + 40);
        }

        renderSpelGebied(){
            //teken spel gebied
            //onderstaande code op basis van document [Game design doc].
            var c = document.getElementById("spelCanvas");
            var ctx = c.getContext("2d");
            ctx.fillStyle = this.achtergrondKleurSpelGebied;
            ctx.fillRect (this.x, this.y, this.breedteSpelGebied, this.hoogteSpelGebied);

            //Teken de verticale lijnen 
            for (let i = 1; i<5; i++){
                ctx.beginPath(); 
                ctx.moveTo(this.kolomBreedte * i + this.x, 0);
                ctx.lineTo(this.kolomBreedte * i + this.x, this.rijHoogte * this.rijen);
                ctx.strokeStyle = "#000000"; //zwart
                ctx.stroke();     
            }
            //Teken de horizontale lijnen
            for (let i = 1; i<5; i++){
                ctx.beginPath(); 
                ctx.moveTo(0, this.rijHoogte * i + this.y);
                ctx.lineTo(this.kolomBreedte * this.kolomen + this.x, this.rijHoogte * i + this.y);
                ctx.strokeStyle = "#000000"; //zwart
                ctx.stroke();     
            }
        }

        renderVoetbalk(bericht){
            //teken de voetbalk 
            //onderstaande code op basis van document [Game design doc].
            var c = document.getElementById("voetbalk");
            this.ctx = c.getContext("2d");
            this.ctx.fillStyle = this.achtergrondKleurBalk;
            this.ctx.fillRect (this.x, this.y, this.breedteSpelGebied, this.voetBalkHoogte);

            this.ctx.font = "20px Arial";
            this.ctx.fillStyle = "#000000"; //zwart 
            this.ctx.fillText(bericht, this.x + 25, this.y + 40);
        }

        // deze functie maakt het mogelijk om het spelbord zelf door te geven.
        static geefSpelbord(){
            return this;
        }
        // Zorgt ervoor dat blokken opnieuw getekent worden.
        updateBlokken(){
            for (let i = 0; i < this.blokken.length; i++){
                this.blokken[i].render();
            }
        }

        laatAlleBlokkenEenRijZakken(){
          // bepaal eerst in welke kolom de zwarte toets gaat komen.
          let volgendeZwarteToets = this.geefVolgendZwarteBlok();
            for (let i = 19; i>=0; i--)
            {
                //Verplaats alle vlakken van de bovenste vier rijen er een naar benenden. 
                //Omdat i bij 19 begint zullen de blokken van onder naar boven vernieuwd worden.
                if ((i <= 18 && i >= 16) || (i <=13 && i>=11) || (i<=8 && i>=6) || (i<=3 && i>=1)){
                    this.blokken[i].zetKleur(this.blokken[i-1].geefKleur()); 

                }
                //bepaal de kleur van de onderste regel 
                else if (i == 19 || i==14 || i==9 || i==4){

                    if (this.blokken[i - 1].geefKleur() === "#000000"){
                        if (this.blokken[i - 1].ditBlokIsGeklikt == true){
                            this.blokken[i].zetKleur("#808080"); //het blok wordt grijs gemaakt.
                        }
                        else {
                            this.spel.spelAfgelopen();
                        }
                    } else {
                        this.blokken[i].zetKleur(this.blokken[i-1].geefKleur());
                    }
                }

                // Zet een nieuwe bovenste rij met pianoknoppen. 
                else if (i == 0){
                    if (volgendeZwarteToets == 0){
                        this.blokken[i].zetKleur("#000000");
                    } else {
                        this.blokken[i].zetKleur("#FFFFFF");
                    }
                }
                else if (i == 5){
                    if (volgendeZwarteToets == 5){
                        this.blokken[i].zetKleur("#000000");
                    } else {this.blokken[i].zetKleur("#FFFFFF")}                    
                }
                else if (i == 10){
                    if (volgendeZwarteToets == 10){
                        this.blokken[i].zetKleur("#000000");
                    } else {this.blokken[i].zetKleur("#FFFFFF")}                    
                }
                else if (i == 15){
                    if (volgendeZwarteToets == 15){
                        this.blokken[i].zetKleur("#000000");
                    } else {this.blokken[i].zetKleur("#FFFFFF")}                    
                }
                    
            }
            this.updateBlokken();
        }
        geefBlokWaaropGekliktIs(x,y){
             //bepaal in welk blok er geklikt is. 
            for(let i=0; i<19; i++){
                if (this.blokken[i].inDitBlokGeklikt(x,y))
                    return this.blokken[i].geefNummer();
            }
        }

        geefKleurVanBlok(nummer){
            return this.blokken[nummer].geefKleur();
        }

        geefVolgendZwarteBlok(){
            //vraag een random getal tussen 0 en 3
            let randomGetal = Math.floor(Math.random()*4);
            //match het getal op de juiste kolom 
            if (randomGetal < 1){
                return randomGetal;
            }
            else if (randomGetal == 1){
                return 5;
            }
            else if (randomGetal == 2){
                return 10;
            }
            else if (randomGetal == 3){
                return 15;
            }
        }

}

class spel{
    constructor(){
        this._timer = new Timer();
        this._behaaldePunten = 0; 
        this.initialiseerSpel();
    }    

    initialiseerSpel(){
        this._spelbord = new Spelbord(this);
        this._spelbord.renderTitelBalk("Piano Tiles Games 5HC");
        this._spelbord.renderSpelGebied();
        this._spelbord.renderVoetbalk("0 punten..");
        this._timer.reset();
    }
    
   // start het spel.
    start(){
        this.initialiseerSpel();
        this._timer.start(this);
        this.schermVernieuwenTimer = window.setInterval(function(spelbord){spelbord.laatAlleBlokkenEenRijZakken()}, 1000, this._spelbord);
    }
   
    //bevries het scherm in zijn laatste toestand. 
    stop(){
        this._timer.stop();
        window.clearInterval(this.schermVernieuwenTimer);
    }
   
    //start het spel opnieuw op.
    herStart(){
        //reset alle spel variabele 
        this._behaaldePunten = 0; 

        let knop = document.getElementById('start_knop');
        knop.innerHTML = "STOP";

        //Teken het bord in een nieuwe stand. 
        this.start();        
    }
   
    //Het spel is afgelopen door dat de tijd op is dan wel dat je te laat was met klikken, dus game over. 
    spelAfgelopen(){
        //stop het verplaatsen van de blokken
        window.clearInterval(this.schermVernieuwenTimer);

        this._spelbord.renderTitelBalk("Game over !!!");
        let knop = document.getElementById('start_knop');

        this._timer.stop();
        knop.innerHTML = "START OPNIEUW";
    }
    
    //De speler heeft op het spelvlak geklikt. Hier gaan we bepalen in welk vlak geklikt is. 
    klikAfhandelen(coordinaten){
        var x = coordinaten["x"];
        var y = coordinaten["y"];
        
        var gekliktBlok = this._spelbord.geefBlokWaaropGekliktIs(x,y)
        if (gekliktBlok == 3 || gekliktBlok == 8 || gekliktBlok == 13 || gekliktBlok == 18){
            //bepaal welke kleur het geklikte blok heeft
            if (this._spelbord.geefKleurVanBlok(gekliktBlok) === "#FFFFFF"){
                this.spelAfgelopen();
            }
            else if (this._spelbord.geefKleurVanBlok(gekliktBlok) === "#000000"){
                this._behaaldePunten++;
                this._spelbord.renderVoetbalk (" "+ this._behaaldePunten + " punten..");
            }
        }        
    }

    //Je vraagt aan het spelcanvas waar er geklikt is. 
    geefMuisPositie(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }
    
    werkTimerbij(bericht){
        this._spelbord.renderTitelBalk(bericht);
    }
}

class Blok {
    constructor(x,y, width, height, color, nummer)
    {
        this.x = x + 3;
        this.y = y + 3; 
        this.width = width - 6;
        this.height = height - 6;
        this.color = color;
        this.nummer = nummer;
        var c = document.getElementById("spelCanvas");
        this.ctx = c.getContext("2d");  
        this.ditBlokIsGeklikt = false;
    }

    geefNummer(){
        return this.nummer;
    }

    geefKleur(){
        return this.color;
    }
    
    geefCoordinaten(){
        return "x: " + this.x + " y: " + this.y + " breedte : "+ this.width + " hoogte: " + this.height
    }

    zetKleur(color){
        this.color = color;
        this.ditBlokIsGeklikt = false;
    }
    render(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //controlleer of de coordinaten waarop geklikt is, in dit blok liggen. 
    inDitBlokGeklikt(x, y){
        if ((this.x <= x) && ((this.x + this.width)>= x) && ((this.y <= y) && (this.y + this.height)>= y)) {
            this.ditBlokIsGeklikt = true;
            return true;
        } else {
            return false; 
        }
    }
    //Wanneer in dit blok geklikt is en deze zwart was dan zal dit true opleveren
    //anders levert dit false terug.
    ditBlokIsGeklikt(){
        return this.ditBlokIsGeklikt;
    }
}

class Timer {
    constructor(){
        this.timer;
    }
    start(spel){
        let tijd = 30;
        this.timer = window.setInterval(function(){
            spel.werkTimerbij(" Tijd : " + tijd);
            tijd = tijd -1;        
            if (tijd < 0){
                let knop = document.getElementById('start_knop');
                    knop.innerHTML = "START OPNIEUW";
                spel.spelAfgelopen();
            }         
        }, 1000);
    }
    stop(){
        window.clearInterval(this.timer);
    }
    reset(){
        this.timer = 30;
    }
}
