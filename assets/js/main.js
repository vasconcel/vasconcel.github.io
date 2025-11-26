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
    
    sections.forEach(section => {
        section.addEventListener('mouseover', () => {
            // Aprofunda o alinhamento e adiciona um "text-shadow" de glitch
            section.style.paddingLeft = '15px';
            section.style.textShadow = '1px 1px 0 var(--accent-color), -1px -1px 0 #00ffea';
        });
        
        section.addEventListener('mouseout', () => {
            // Retorna ao estado normal
            section.style.paddingLeft = '10px';
            section.style.textShadow = 'none';
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