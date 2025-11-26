document.addEventListener('DOMContentLoaded', () => {

    const INVESTIGATIONS_CONTAINER = document.querySelector('#investigations');
    const KNOWLEDGE_BASE_CONTAINER = document.querySelector('#knowledge-base .terminal-box');
    const PROJECTS_JSON_URL = 'data/projects.json';

    // ----------------------------------------------------
    // 1. GERAÇÃO DA DATA DE ATUALIZAÇÃO (STATUS BAR)
    // ----------------------------------------------------
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
        logDateElement.textContent = `AUTOMATED BY: n8n | LOG: ${formattedDate}`;
    }

    console.log(`SYSTEM_INIT: @escombros.log loaded. LOG_DATE: ${date.toISOString()}`);


    // ----------------------------------------------------
    // 2. RENDERIZAÇÃO DE CONTEÚDO (INVESTIGAÇÕES/PROJETOS)
    // ----------------------------------------------------

    /**
     * Constrói o HTML para um projeto (entry) baseado no JSON.
     * @param {object} project - Objeto de projeto do JSON.
     * @returns {string} - HTML do projeto.
     */
    const createProjectHTML = (project) => {
        // Render Tags
        const tagsHTML = project.tags.map(tag =>
            `<span class="tag ${tag.class}">${tag.name}</span>`
        ).join('');

        // Render Stack
        const stackHTML = project.stack.map(item => `<li>${item}</li>`).join('');

        // Render Status Button
        let statusHTML = '';
        if (project.status) {
            statusHTML = project.status.is_link ?
                `<a href="${project.status.url}" target="_blank" class="${project.status.class} status-btn">${project.status.text}</a>` :
                `<span class="${project.status.class} status-btn">${project.status.text}</span>`;
        }

        // Render Links (Botões)
        const linksHTML = project.links.map(link =>
            `<a href="${link.url}" target="_blank" class="link-btn">${link.text}</a>`
        ).join('');
        const btnGroupHTML = project.links.length > 0 ? `<div class="btn-group">${linksHTML}</div>` : '';


        return `
            <div class="entry" id="entry-${project.id}">
                <div class="entry-header">
                    <h3>> ${project.title}</h3>
                    ${tagsHTML}
                </div>
                <p class="description">${project.description}</p>
                <ul class="tech-stack">${stackHTML}</ul>
                ${statusHTML}
                ${btnGroupHTML}
            </div>
        `;
    };

    /**
     * Constrói o HTML para um item do Banco de Dados.
     * @param {object} item - Item do knowledge_base do JSON.
     * @returns {string} - HTML do item.
     */
    const createKnowledgeBaseHTML = (item) => {
        if (item.type === 'comment') {
            return `<p class="comment"># ${item.title}</p>`;
        }
        if (item.type === 'output') {
            const blinkClass = item.is_new ? '<span class="blink">_new</span>' : '';
            return `
                <p class="output-line">>&nbsp;
                    <a href="${item.url}" target="_blank">${item.title}</a>
                    ${blinkClass}
                </p>
            `;
        }
        return '';
    };


    /**
     * Função principal para buscar o JSON e renderizar o conteúdo.
     */
    const loadContent = async () => {
        try {
            const response = await fetch(PROJECTS_JSON_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // 2.1 Renderiza Investigações
            if (data.investigations && INVESTIGATIONS_CONTAINER) {
                const projectsHTML = data.investigations.map(createProjectHTML).join('');
                INVESTIGATIONS_CONTAINER.innerHTML += projectsHTML;
            }

            // 2.2 Renderiza Banco de Dados
            if (data.knowledge_base && KNOWLEDGE_BASE_CONTAINER) {
                const knowledgeHTML = data.knowledge_base.map(createKnowledgeBaseHTML).join('');
                KNOWLEDGE_BASE_CONTAINER.innerHTML = knowledgeHTML;
            }

            initializeEffects();

        } catch (error) {
            console.error('ERROR: Failed to load project data.', error);
            INVESTIGATIONS_CONTAINER.innerHTML = `<p class="status-alert">ERROR: DATA LOAD FAILED. STATUS: ${error.message}</p>`;
        }
    };

    // ----------------------------------------------------
    // 3. INICIALIZAÇÃO DE EFEITOS E INTERAÇÃO
    // ----------------------------------------------------
    const initializeEffects = () => {
        
        // 3.1 Efeito Glitch/Flicker Sutil nos títulos das seções (h2)
        const sectionsH2 = document.querySelectorAll('section h2');
        
        sectionsH2.forEach(h2 => {
            // Para que o glitch possa funcionar, adiciona-se o data-text (igual ao H1)
            // Remove o prefixo '$ ' antes de aplicar o data-text
            const originalText = h2.textContent.replace('$ ', '').trim();
            h2.setAttribute('data-text', originalText);
            
            h2.addEventListener('mouseover', () => {
                h2.classList.add('glitch-small');
                h2.style.transform = 'translateY(-1px)';
            });
            
            h2.addEventListener('mouseout', () => {
                h2.classList.remove('glitch-small');
                h2.style.transform = 'translateY(0)';
            });
        });
        
        // 3.2 Smooth Scroll para a TOC (Usabilidade)
        document.querySelectorAll('nav#toc a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    loadContent();
});