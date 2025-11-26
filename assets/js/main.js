document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inicia o Log de Sistema e atualiza a data no Status Bar
    const date = new Date();
    const formattedDate = date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const logDateElement = document.querySelector('.log-date');
    if (logDateElement) {
        logDateElement.textContent = logDateElement.getAttribute('data-prefix') + formattedDate;
    }

    console.log(`SYSTEM_INIT: @escombros.log loaded. LOG_DATE: ${date.toISOString()}`);


    // 2. Efeito Glitch/Flicker Sutil nos títulos das seções (h2)
    const sections = document.querySelectorAll('section h2');
    
    sections.forEach(h2 => {
        // Para que o glitch possa funcionar, adiciona-se o data-text (igual ao H1)
        const originalText = h2.textContent.replace('$ ', '').trim();
        h2.setAttribute('data-text', originalText);
        
        h2.addEventListener('mouseover', () => {
            // Adiciona a classe que aplica o CSS Glitch/Flicker
            h2.classList.add('glitch-small');
            h2.style.transform = 'translateY(-1px)'; // Efeito de levantamento sutil
        });
        
        h2.addEventListener('mouseout', () => {
            // Remove a classe para retornar ao estado normal
            h2.classList.remove('glitch-small');
            h2.style.transform = 'translateY(0)';
        });
    });
    
    // 3. Smooth Scroll para a TOC (Usabilidade)
    document.querySelectorAll('nav#toc a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});