## ⚙️ @ESCOMBROS.LOG: Laboratório de Investigação Sociotécnica

> Sistemas digitais não são neutros. Eles carregam decisões, valores e formas de organização que moldam práticas sociais, modelos de trabalho e modos de vida.

O **@ESCOMBROS.LOG** é um laboratório aberto e independente dedicado a investigar como tecnologias funcionam na prática e quais efeitos produzem.

A proposta é observar sistemas digitais a partir de suas **estruturas técnicas**, **fluxos de dados** e **usos sociais**, articulando elementos da **Engenharia de Software** com abordagens das **Ciências Sociais**.

O laboratório trabalha com microinvestigações, análises exploratórias e mapeamentos de infraestrutura, buscando tornar visíveis escolhas técnicas, relações de poder e assimetrias que aparecem no cotidiano das plataformas e serviços digitais.

### 🎯 Foco e Intenção

A intenção do projeto é produzir análises claras e acessíveis sobre:

1.  **Opacidade e Automação:** Como sistemas de decisão, filtragem ou priorização funcionam e quais informações tornam invisíveis.
2.  **Infraestruturas Digitais:** Como plataformas estruturam fluxos, regras e limites que afetam usuários, trabalhadores e dados.
3.  **Formas de Governança Tecnológica:** Como soluções digitais condicionam comportamentos e distribuem capacidades, acessos e restrições.

Essas observações são realizadas de forma incremental, combinando experimentação técnica, leituras críticas e análises sociotécnicas em desenvolvimento.

---

### 📂 Estrutura do Acervo

O laboratório se organiza em diretórios que refletem o processo investigativo:

| Diretório | Seção do Site | Conteúdo |
| :---------- | :---------------- | :---------- |
| `00_MANIFESTO.md` | Manifesto | Conceitos base, alinhamento teórico e horizonte crítico. |
| `01_AUDITS/` | Auditorias | Investigações exploratórias sobre sistemas, plataformas e fluxos. |
| `02_EVIDENCE_LOCKER/` | Evidências | Dados brutos, logs, scripts (Python/n8n/Node), notas técnicas e materiais para reprodutibilidade. |
| `03_MEDIA_INTERVENTIONS/` | Divulgação | Artefatos visuais e materiais simplificados voltados ao público geral. |

---

### 🔬 Linhas de Investigação Atuais

O foco inicial do laboratório envolve sistemas que mediam a relação entre **trabalho**, **tecnologia** e **infraestrutura digital**, incluindo:

*   **Anti-Patterns em Recrutamento (TI):** Estudo exploratório de práticas problemáticas em processos de R&S observadas empiricamente.
*   **Mapeamentos Sociotécnicos:** Experimentos com APIs, fluxos de dados e automações (ex.: n8n) para observar decisões incrustadas na arquitetura de plataformas.

As linhas de pesquisa podem se expandir conforme novos casos e métodos forem desenvolvidos.

---

### 💻 Como Executar / Deploy

O projeto é uma aplicação **estática** que utiliza HTML, CSS, JavaScript e arquivos JSON.

#### 1. Clonar o Repositório

```bash
git clone https://github.com/vasconcel/escombros-log.git
cd escombros-log
```

#### 2. Execução Local (Recomendado)

Para que o JavaScript consiga carregar o `data/projects.json` (evitando erros de CORS), você deve rodar um servidor web local:

*   **Usando Python:**
    ```bash
    python -m http.server
    # Acesse http://localhost:8000
    ```
*   **Usando VS Code:**
    Instale a extensão **Live Server** e use a opção "Go Live" na barra inferior.

#### 3. Deploy em Produção (GitHub Pages)

A maneira mais rápida e gratuita é usando o GitHub Pages, pois é um site estático:

1.  Garanta que todos os arquivos estejam na *branch* `main`.
2.  Vá para **Settings** > **Pages**.
3.  Configure a Source para `Deploy from a branch` e escolha a *branch* `main` na pasta `/ (root)`.
4.  O site será publicado em poucos minutos no formato `https://seu-usuario.github.io/escombros-log/`.

---

### 🤝 Contato e Colaboração

O laboratório é um projeto de conhecimento aberto. Críticas, sugestões de casos e colaborações metodológicas são incentivadas.

*   **Researcher:** Gabriel V. Silva
*   **Email:** `gabriel.vasconcel@outlook.com`
*   **GitHub:** `https://github.com/vasconcel`

---
<p align="center">
    <code>// OPEN KNOWLEDGE // NO_RIGHTS_RESERVED</code>
</p>
