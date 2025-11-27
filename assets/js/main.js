// assets/js/main.js - VERSÃO FINAL REFATORADA
document.addEventListener('DOMContentLoaded', () => {

    // Referências aos Containers
    const PROJECTS_CONTAINER = document.getElementById('projects-container');
    const KNOWLEDGE_CONTAINER = document.getElementById('knowledge-container');
    const DATE_ELEMENT = document.getElementById('system-clock');
    
    // URL do JSON
    const PROJECTS_JSON_URL = 'data/projects.json';


    // ----------------------------------------------------
    // 1. FUNÇÕES DE UTILIDADE E INIT
    // ----------------------------------------------------
    
    // Atualiza data do sistema estilo log
    const updateTime = () => {
        const now = new Date();
        // Formatando para ISO Date e Time (ex: 2025-11-27 [17:00:00])
        if(DATE_ELEMENT) {
            DATE_ELEMENT.innerText = `SYS_TIME: ${now.toISOString().split('T')[0]} [${now.toTimeString().split(' ')[0]}]`;
        }
    };
    // Inicia o relógio do sistema
    setInterval(updateTime, 1000);
    updateTime();

    // Função principal para buscar o JSON e renderizar o conteúdo
    const loadContent = async () => {
        try {
            const response = await fetch(PROJECTS_JSON_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            renderProjects(data.investigations);
            renderEvidence(data.knowledge_base);
            
            // Inicia efeitos e navegação após o load
            initializeEffects(); 

        } catch (error) {
            console.error('CRITICAL FAILURE: Failed to load project data.', error);
            if(PROJECTS_CONTAINER) {
                PROJECTS_CONTAINER.innerHTML = `<p class="alert-box">ERROR: DATA LOAD FAILED. STATUS: ${error.message}</p>`;
            }
        }
    };
    
    // ----------------------------------------------------
    // 2. RENDERIZAÇÃO DE CONTEÚDO (AUDITS)
    // ----------------------------------------------------

    const renderProjects = (projects) => {
        if(!PROJECTS_CONTAINER) return;
        PROJECTS_CONTAINER.innerHTML = projects.map(p => `
            <div class="entry">
                <div class="entry-header">
                    <h3>> ${p.title}</h3>
                </div>
                <div class="tags-container">
                    ${p.tags.map(t => `<span class="tag ${t.class}">${t.name}</span>`).join('')}
                </div>
                <p class="entry-desc">${p.description}</p>
                <!-- Stack já não é mais um <ul> e sim parte da descrição/tags, mas mantemos o slot para futuros metadados -->
                
                <div class="meta">
                    ${p.status ? `<span class="status-badge ${p.status.class || ''}">${p.status.text}</span>` : ''}
                </div>
                <div class="btn-group">
                    ${p.links.map(l => `<a href="${l.url}" class="link-btn" target="_blank">${l.text}</a>`).join('')}
                </div>
            </div>
        `).join('');
    };


    // ----------------------------------------------------
    // 3. RENDERIZAÇÃO DE CONTEÚDO (EVIDENCE LOCKER)
    // ----------------------------------------------------
    
    const renderEvidence = (items) => {
        if(!KNOWLEDGE_CONTAINER) return;
        KNOWLEDGE_CONTAINER.innerHTML = items.map(item => {
            if (item.type === 'comment') return `<div class="comment"># ${item.title}</div>`;
            
            // Renderização do Terminal
            const blink = item.is_new ? '<span class="blink_slow"> [NEW_EVIDENCE]</span>' : '';
            const preview = item.data_preview 
                ? `<div class="data-preview">└── DUMP: ${item.data_preview}</div>` 
                : '';
            
            return `
                <div class="output-block">
                    <p class="output-line">
                        <span style="color:var(--accent-secondary)">$ cat</span> 
                        <a href="${item.url}" target="_blank">${item.title}</a>${blink}
                    </p>
                    ${preview}
                </div>
            `;
        }).join('');
    };

    // ----------------------------------------------------
    // 4. INICIALIZAÇÃO DE EFEITOS E INTERAÇÃO
    // ----------------------------------------------------
    const initializeEffects = () => {
        
        // Efeito Glitch/Flicker Sutil nos títulos das seções (h2)
        const sectionsH2 = document.querySelectorAll('section h2');
        
        sectionsH2.forEach(h2 => {
            const originalText = h2.textContent.replace(/^$ /, '').trim();
            h2.setAttribute('data-text', originalText);
            
            h2.addEventListener('mouseover', () => {
                h2.classList.add('glitch-small');
            });
            
            h2.addEventListener('mouseout', () => {
                h2.classList.remove('glitch-small');
            });
        });
        
        // Smooth Scroll para a TOC (Usabilidade)
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

    // Inicia o carregamento do conteúdo
    loadContent();
});