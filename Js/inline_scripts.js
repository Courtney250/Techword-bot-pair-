
    // Particles.js init
    particlesJS("particles-js", {
      particles: { number:{value:60}, color:{value:"#00bfff"}, size:{value:1}, line_linked:{enable:true,distance:120,color:"#00bfff",opacity:0.4,width:1}, move:{enable:true,speed:1,out_mode:"out"} },
      interactivity:{ events:{onhover:{enable:true,mode:"grab"},onclick:{enable:true,mode:"push"}}, modes:{grab:{distance:200,line_linked:{opacity:0.6}}, push:{particles_nb:2}} }, retina_detect:true
    });

    // Footer year
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Welcome alert
    document.addEventListener("DOMContentLoaded", () => { 
      swal("Welcome to TECHWORD by COURTNEY!", "DONT FORGET TO STAR & FORK REPO", "info"); 
    });

    // Pair code logic
    const genBtn = document.getElementById('generate-code');
    const valBtn = document.getElementById('validate-code');
    const copyBtn = document.getElementById('copy-code');
    const spinner = document.getElementById('loading-spinner');
    const pairDiv = document.getElementById('pair');
    const phoneInput = document.getElementById('phone-number');

    async function copyToClipboard() {
      const code = copyBtn.dataset.code;
      try { 
        await navigator.clipboard.writeText(code); 
        copyBtn.textContent = 'Copied!'; 
        setTimeout(() => copyBtn.textContent = 'Copy Code', 2000); 
      }
      catch (err) { 
        console.error('Copy failed:', err); 
      }
    }

    genBtn.addEventListener('click', async () => {
      const num = phoneInput.value.replace(/\D/g,'');
      if (!num) { 
        pairDiv.textContent = '❗ Please enter your WhatsApp number with country code.'; 
        return; 
      }
      spinner.style.display='block'; 
      pairDiv.textContent=''; 
      valBtn.style.display='none'; 
      copyBtn.style.display='none'; 
      genBtn.disabled=true;
      try {
        phoneInput.value='+'+num;
        await new Promise(r=>setTimeout(r,1500));
        const {data} = await axios.get(`/code?number=${num}`);
        const code=data.code||'❗ Service Unavailable';
        const waLink=`https://wa.me/${num}?text=${encodeURIComponent(code)}`;
        pairDiv.innerHTML=`<p>Your Code: <strong>${code}</strong></p><p><a href="${waLink}" target="_blank" style="color:var(--accent);">Open WhatsApp Link</a></p>`;
        copyBtn.dataset.code=code; 
        copyBtn.style.display='block'; 
        valBtn.style.display='block';
      } catch { 
        pairDiv.textContent='❗ Error, please try again later.'; 
      }
      finally { 
        spinner.style.display='none'; 
        genBtn.disabled=false; 
      }
    });
    copyBtn.addEventListener('click',copyToClipboard);
    valBtn.addEventListener('click',()=>window.location.href='/validate');
    phoneInput.addEventListener('input',function(){ 
      let v=this.value.replace(/\D/g,''); 
      this.value=v?'+'+v:''; 
    });
  