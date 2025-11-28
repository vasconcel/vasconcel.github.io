/**
 * ESCOMBROS.LOG // MAIN CONTROL SCRIPT
 * Author: Gabriel V. Silva
 * Description: Gerencia o fetch de dados, renderização do terminal e efeitos de interface.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÃO E SELETORES ---
    const CONFIG = {
        dataUrl: 'data/projects.json',
        refreshRate: 1000 // Para o relógio
    };

    const DOM = {
        projectsContainer: document.getElementById('projects-container'),
        knowledgeContainer: document.getElementById('knowledge-container'),
        clockElement: document.getElementById('system-clock'),
        tocLinks: document.querySelectorAll('nav#toc a')
    };

    // --- 1. SYSTEM CLOCK (Relógio do Header) ---
    const initSystemClock = () => {
        const updateTime = () => {
            const now = new Date();
            // Formato: YYYY-MM-DD [HH:MM:SS]
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0];
            
            if (DOM.clockElement) {
                DOM.clockElement.innerText = `SYS_TIME: ${dateStr} [${timeStr}]`;
            }
        };

        updateTime(); // Executa imediatamente
        setInterval(updateTime, CONFIG.refreshRate);
    };

    // --- 2. DATA FETCHING (Carregamento do JSON) ---
    const loadSystemData = async () => {
        try {
            // Pequeno delay artificial (300ms) para o usuário ver a msg "Establishing Connection"
            // Isso dá uma sensação de "boot" do sistema.
            await new Promise(resolve => setTimeout(resolve, 300));

            const response = await fetch(CONFIG.dataUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP_STATUS_${response.status}`);
            }

            const data = await response.json();

            // Renderiza as seções
            renderAudits(data.investigations);
            renderEvidence(data.knowledge_base);

        } catch (error) {
            console.error('SYSTEM FAILURE:', error);
            handleLoadError(error.message);
        }
    };

    // --- 3. RENDERERS (Geradores de HTML) ---

    // Renderiza a Seção 01: Critical Audits
    const renderAudits = (projects) => {
        if (!DOM.projectsContainer) return;

        if (!projects || projects.length === 0) {
            DOM.projectsContainer.innerHTML = '<p class="sys-msg">>> NO_ACTIVE_INVESTIGATIONS_FOUND.</p>';
            return;
        }

        const htmlContent = projects.map(p => {
            // Gera as Tags
            const tagsHtml = p.tags.map(t => 
                `<span class="tag ${t.class || ''}">${t.name}</span>`
            ).join('');

            // Gera o Badge de Status (se existir)
            const statusHtml = p.status 
                ? `<span class="status-badge ${p.status.class || ''}">${p.status.text}</span>` 
                : '';

            // Gera os Botões (se existirem)
            const linksHtml = p.links && p.links.length > 0
                ? `<div class="btn-group">
                    ${p.links.map(l => `<a href="${l.url}" class="link-btn" target="_blank">${l.text}</a>`).join('')}
                   </div>`
                : '';

            return `
                <div class="entry">
                    <div class="entry-header">
                        <h3>> ${p.title}</h3>
                    </div>
                    
                    <div class="tags-container">${tagsHtml}</div>
                    
                    <p class="entry-desc">${p.description}</p>
                    
                    <div class="meta">
                        ${statusHtml}
                    </div>
                    
                    ${linksHtml}
                </div>
            `;
        }).join('');

        DOM.projectsContainer.innerHTML = htmlContent;
    };

    // Renderiza a Seção 02: Evidence Locker (Terminal)
    const renderEvidence = (items) => {
        if (!DOM.knowledgeContainer) return;

        const htmlContent = items.map(item => {
            // Caso 1: Comentários (# headers)
            if (item.type === 'comment') {
                return `<span class="comment"># ${item.title}</span>`;
            }

            // Caso 2: Arquivos Bloqueados (Lógica corrigida)
            if (item.is_locked) {
                return `
                    <div class="output-block locked">
                        <p class="output-line">
                            <span style="color:var(--accent-color)">[LOCKED]</span> 
                            <span>${item.title}</span>
                        </p>
                        <div class="data-preview">
                            └── STATUS: ACCESS_DENIED // ${item.notes || 'Awaiting Clearance'}
                        </div>
                    </div>
                `;
            }

            // Caso 3: Arquivos Normais (Output)
            const blinkNew = item.is_new ? '<span class="blink_slow"> [NEW]</span>' : '';
            const preview = item.data_preview 
                ? `<div class="data-preview">└── ${item.data_preview}</div>` 
                : '';

            // Verifica se tem URL, senão coloca um placeholder
            const fileLink = item.url 
                ? `<a href="${item.url}" target="_blank">${item.title}</a>`
                : item.title;

            return `
                <div class="output-block">
                    <p class="output-line">
                        <span style="color:var(--accent-secondary)">$ cat</span> 
                        ${fileLink}${blinkNew}
                    </p>
                    ${preview}
                </div>
            `;
        }).join('');

        DOM.knowledgeContainer.innerHTML = htmlContent;
    };

    // --- 4. UTILITÁRIOS E EFEITOS ---

    const handleLoadError = (msg) => {
        const errorHtml = `
            <div class="alert-box">
                <span class="icon">!</span>
                <div>
                    <strong>FATAL_ERROR: DATA_FETCH_FAILED</strong><br>
                    <span class="tiny">CODE: ${msg} // CHECK CONSOLE FOR LOGS</span>
                </div>
            </div>
        `;
        
        if(DOM.projectsContainer) DOM.projectsContainer.innerHTML = errorHtml;
        if(DOM.knowledgeContainer) DOM.knowledgeContainer.innerHTML = `<span style="color:var(--accent-color)">$ connection_lost...</span>`;
    };

    const initSmoothScroll = () => {
        DOM.tocLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // --- 5. INICIALIZAÇÃO ---
    
    initSystemClock();
    initSmoothScroll();
    loadSystemData();

    console.log(
        "%c @ESCOMBROS.LOG %c SYSTEM READY ",
        "background:#000; color:#fff; font-weight:bold; padding:5px;",
        "background:#00ff41; color:#000; padding:5px;"
    );
});