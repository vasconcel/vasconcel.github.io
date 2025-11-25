// Script simples para adicionar interatividade "lo-fi"

document.addEventListener('DOMContentLoaded', () => {
    console.log("SYSTEM_INIT: @escombros.log loaded.");

    // Efeito de hover nos títulos das seções
    const sections = document.querySelectorAll('h2');
    
    sections.forEach(section => {
        section.addEventListener('mouseover', () => {
            section.style.paddingLeft = '20px';
            section.style.transition = 'padding-left 0.2s ease';
        });
        section.addEventListener('mouseout', () => {
            section.style.paddingLeft = '10px';
        });
    });

    // Opcional: Data atual no footer ou console
    const date = new Date();
    console.log(`LOG_DATE: ${date.toISOString()}`);
});