  (function(){
    document.querySelectorAll('[data-modal-open]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var dlg = document.getElementById(btn.getAttribute('data-modal-open'));
        if(dlg && typeof dlg.showModal === 'function'){ dlg.showModal(); }
      });
    });
    document.querySelectorAll('.modal').forEach(function(dlg){
      dlg.addEventListener('click', function(e){
        if(e.target === dlg){ dlg.close(); }
      });
      var close = dlg.querySelector('[data-modal-close]');
      if(close){ close.addEventListener('click', function(){ dlg.close(); }); }
    });
  })();

  (function(){
    var state = {};
    function goTo(galleryId, idx){
      var slides = document.getElementById(galleryId);
      if(!slides) return;
      var imgs = slides.querySelectorAll('img');
      var total = imgs.length;
      idx = (idx + total) % total;
      state[galleryId] = idx;
      slides.scrollTo({ left: idx * slides.offsetWidth, behavior:'smooth' });
      document.querySelectorAll('.prop-dot[data-gallery="'+galleryId+'"]').forEach(function(d,i){
        d.classList.toggle('active', i === idx);
      });
    }
    document.querySelectorAll('.prop-btn').forEach(function(btn){
      btn.addEventListener('click', function(){
        var gid = btn.getAttribute('data-gallery');
        var dir = parseInt(btn.getAttribute('data-dir'));
        goTo(gid, (state[gid] || 0) + dir);
      });
    });
    document.querySelectorAll('.prop-dot').forEach(function(dot){
      dot.addEventListener('click', function(){
        goTo(dot.getAttribute('data-gallery'), parseInt(dot.getAttribute('data-idx')));
      });
    });
    document.querySelectorAll('.prop-slides, .fs-prop-slides').forEach(function(sl){
      state[sl.id] = 0;
    });
  })();

  (function(){
    // I video dentro le pagine hanno preload="none": non vengono scaricati
    // finche' non entrano nello schermo. Prima li avviava l'apertura della
    // finestra; ora che sono pagine vere, li avvia lo scorrimento.
    var video = document.querySelectorAll('.fs-video-band video');
    if(!video.length) return;

    function avvia(v){
      if(v.dataset.fermo) return;          // animazioni ridotte: resta fermo
      var parti = function(){
        var p = v.play();
        if(p && p.catch){ p.catch(function(){}); }
      };
      // Con preload="none" il file non e' ancora pronto e play() verrebbe
      // rifiutato senza segnalare nulla: aspettiamo che sia riproducibile.
      if(v.readyState >= 2){ parti(); }
      else { v.addEventListener('canplay', parti, { once:true }); v.load(); }
    }

    if(!('IntersectionObserver' in window)){
      video.forEach(avvia);
      return;
    }
    var io = new IntersectionObserver(function(voci){
      voci.forEach(function(voce){
        if(voce.isIntersecting){ avvia(voce.target); }
        else if(!voce.target.dataset.fermo){ voce.target.pause(); }
      });
    }, { threshold: 0.25 });
    video.forEach(function(v){ io.observe(v); });
  })();

  (function(){
    document.querySelectorAll('.hero .fade-up').forEach(function(el, i){
      setTimeout(function(){ el.classList.add('in'); }, 80 + i * 80);
    });
    var els = document.querySelectorAll('.reveal, .fade-up:not(.in)');
    if(!('IntersectionObserver' in window)){ els.forEach(function(e){ e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function(e){ io.observe(e); });
  })();

  (function(){
    var form = document.getElementById('form-questionario');
    if(!form) return;
    var esito = document.getElementById('q-esito');
    var NUMERO = '393200521933';
    var EMAIL  = 'jl.studio.management@gmail.com';

    function val(nome){
      var e = form.elements[nome];
      return e && e.value ? e.value.trim() : '';
    }
    function selezionati(nome){
      return Array.prototype.slice.call(form.querySelectorAll('[name="'+nome+'"]:checked'))
        .map(function(e){ return e.value; });
    }
    function riga(etichetta, valore){
      return valore ? etichetta + ': ' + valore + '\n' : '';
    }

    function componiBozza(){
      var obiettivo = selezionati('obiettivo')[0] || '';
      if(obiettivo === 'Altro'){
        var altro = val('obiettivo_altro');
        obiettivo = altro ? 'Altro — ' + altro : 'Altro';
      }
      var t = 'BOZZA PROGETTO — DOMNIA\n\n';
      t += riga('Nome', val('nome') + ' ' + val('cognome'));
      t += riga('Telefono', val('telefono'));
      t += riga('Email', val('email'));
      t += riga('Tipo di progetto', selezionati('tipo').join(', '));
      t += riga('Ha già un logo', selezionati('logo')[0] || '');
      t += riga('Ha già foto e materiale', selezionati('materiale')[0] || '');
      t += riga('Obiettivo principale', obiettivo);
      t += riga('Attività', val('attivita'));
      t += riga('Stile', val('stile'));
      t += riga('Colori', val('colori'));
      t += riga('Sezioni', val('sezioni'));
      t += riga('Riferimenti', val('riferimenti'));
      return t.trim();
    }

    // Gli indirizzi molto lunghi vengono troncati da alcuni browser: meglio
    // avvisare che far partire un messaggio tagliato a meta'.
    function controllaLunghezza(url){
      if(url.length > 7000){
        esito.textContent = 'La bozza è molto lunga e rischia di arrivare incompleta. Accorcia le descrizioni, oppure scrivici direttamente: la leggiamo comunque.';
        return false;
      }
      return true;
    }

    function validoOppureSegnala(){
      form.classList.add('q-inviato');
      if(form.checkValidity()) { esito.textContent = ''; return true; }
      esito.textContent = 'Controlla nome, cognome e email: servono per poterti rispondere.';
      var primo = form.querySelector(':invalid');
      if(primo){ primo.focus(); }
      return false;
    }

    // Il modulo viene ricevuto solo dove il sito e' pubblicato su Netlify.
    // In locale e su GitHub Pages non c'e' nessuno ad ascoltare: li'
    // ripieghiamo su WhatsApp, cosi' la pagina non e' mai un vicolo cieco.
    function inviaDavvero(){
      var h = location.hostname;
      return !(h === 'localhost' || h === '127.0.0.1' || h === '' || /\.github\.io$/.test(h));
    }

    var MAX_FILE = 8, MAX_MB = 8;
    function allegatiAccettabili(){
      var campo = form.elements['allegati'];
      if(!campo || !campo.files || !campo.files.length) return true;
      if(campo.files.length > MAX_FILE){
        esito.textContent = 'Puoi allegare al massimo ' + MAX_FILE + ' file: ne hai scelti ' + campo.files.length + '.';
        return false;
      }
      var tot = 0;
      for(var i = 0; i < campo.files.length; i++){ tot += campo.files[i].size; }
      if(tot > MAX_MB * 1024 * 1024){
        esito.textContent = 'Gli allegati pesano ' + (tot / 1024 / 1024).toFixed(1) + ' MB, oltre il limite di ' + MAX_MB + ' MB. Togline qualcuno o mandaceli a parte.';
        return false;
      }
      return true;
    }

    form.addEventListener('submit', function(e){
      if(!validoOppureSegnala() || !allegatiAccettabili()){ e.preventDefault(); return; }
      var url = 'https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(componiBozza());
      if(!controllaLunghezza(url)) { e.preventDefault(); return; }
      window.open(url, '_blank', 'noopener');
      if(inviaDavvero()){ return; }
      e.preventDefault();
    });

    // Finche' il sito non e' pubblicato, diciamolo invece di promettere
    // un invio che non avverrebbe.
    if(!inviaDavvero()){
      var nota = document.getElementById('q-nota-invio');
      var campoFile = form.elements['allegati'];
      if(nota){
        nota.firstChild.textContent = 'Si aprirà WhatsApp con la bozza già scritta: puoi rileggerla prima di inviarla. ';
      }
      if(campoFile){
        campoFile.disabled = true;
        var avviso = document.createElement('p');
        avviso.className = 'q-aiuto';
        avviso.textContent = 'Gli allegati funzioneranno una volta pubblicato il sito.';
        campoFile.closest('.q-campo').insertAdjacentElement('afterend', avviso);
      }
    }

    document.getElementById('q-email').addEventListener('click', function(){
      if(!validoOppureSegnala()) return;
      var url = 'mailto:' + EMAIL
        + '?subject=' + encodeURIComponent('Bozza progetto — ' + (val('nome') || 'nuovo contatto'))
        + '&body=' + encodeURIComponent(componiBozza());
      if(!controllaLunghezza(url)) return;
      window.location.href = url;
    });

    // Spuntando "Altro" il cursore va dritto nel campo libero.
    var altroRadio = document.getElementById('obiettivo-altro');
    if(altroRadio){
      altroRadio.addEventListener('change', function(){
        if(altroRadio.checked){ form.elements['obiettivo_altro'].focus(); }
      });
    }
    // Scrivendo nel campo libero si seleziona "Altro" da solo.
    form.elements['obiettivo_altro'].addEventListener('input', function(){
      if(this.value.trim() && altroRadio){ altroRadio.checked = true; }
    });
  })();

  (function(){
    // Chi ha chiesto meno animazioni nel sistema operativo vede il video fermo
    // sul primo fotogramma, come fosse una fotografia. Niente comandi di
    // riproduzione: finirebbero sotto il testo sovrapposto e sarebbero inutili.
    if(!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches){ return; }
    document.querySelectorAll('.band-video, .fs-video-band video').forEach(function(v){
      v.removeAttribute('autoplay');
      v.removeAttribute('loop');
      v.dataset.fermo = '1';
      v.pause();
      // Con preload="none" resterebbe un riquadro vuoto: carichiamo almeno
      // il primo fotogramma, cosi' si vede un'immagine ferma.
      if(v.preload === 'none'){ v.preload = 'metadata'; v.load(); }
    });
  })();
