## ⚙️ @ESCOMBROS.LOG — Laboratório Independente de Investigação Sociotécnica

> "Algoritmos são opiniões embutidas em código."
> — Cathy O'Neil, *Weapons of Math Destruction* (2016)

---

O **@ESCOMBROS.LOG** é um laboratório independente dedicado a investigar a partir de suas estruturas técnicas, fluxos de dados e efeitos sociais, combinando métodos da **Engenharia de Software** com perspectivas das **Ciências Sociais**.

O laboratório produz microinvestigações, auditorias, estudos exploratórios e pequenos mapeamentos de infraestrutura. O foco é tornar visíveis decisões técnicas, opacidades e assimetrias presentes no cotidiano das plataformas, priorizando análises acessíveis e empiricamente fundamentadas.

### 🎯 Foco e Intenção

O laboratório desenvolve investigações sobre:

1.  **Opacidade e Automação:** Como sistemas filtram, priorizam ou tomam decisões, e o que permanece oculto para usuários e trabalhadores.
2.  **Infraestruturas Digitais:** Como plataformas estruturam regras, fluxos e limites técnicos que moldam interação, dados e formas de trabalho.
3.  **Governança Tecnológica:** Como soluções digitais distribuem capacidades, acessos e restrições no dia a dia, frequentemente sem escrutínio público.

Essas análises são construídas de forma incremental, combinando experimentação técnica, leitura de documentação, coleta orientada a dados, automações, scripts exploratórios e reflexão sociotécnica.

---

### 📂 Estrutura do Acervo

| Diretório | Seção do Site | Conteúdo |
| :--- | :--- | :--- |
| `00_MANIFESTO.md` | Manifesto | Visão geral, fundamentos e abordagem investigativa. |
| `01_AUDITS/` | Auditorias | Microinvestigações e estudos exploratórios sobre sistemas e plataformas. **(Atualmente em: Aguardando a primeira investigação inédita)** |
| `02_EVIDENCE_LOCKER/` | Evidências | Logs, scripts, dados brutos e materiais técnicos para verificação independente. |
| `03_MEDIA_INTERVENTIONS/` | Divulgação | Artefatos visuais e materiais sintéticos para comunicação pública. |

---

### 🔬 Áreas Temáticas de Foco

O Lab está atualmente direcionando esforços de desenvolvimento e aquisição de dados em sistemas que mediam a relação entre **trabalho**, **tecnologia** e **infraestruturas digitais**, com ênfase em:

*   **Trabalho e Governança Algorítmica:** Análise exploratória de práticas problemáticas, vieses técnicos e automação da exclusão em plataformas de Recrutamento e Seleção (R&S) e gestão de trabalho (Gig Economy).
*   **Infraestrutura e Opacidade:** Experimentação com logs, APIs e arquiteturas de serviços digitais para mapear as decisões técnicas inscritas no código e seus efeitos sociotécnicos.

Essas áreas serão formalizadas em projetos no diretório `01_AUDITS/` assim que a primeira investigação inédita estiver pronta para publicação.

---

### 💻 Execução Local / Deploy

O projeto é uma aplicação estática, construída em HTML, CSS, JavaScript e arquivos JSON.

#### 1. Clonar o Repositório
```bash
git clone https://github.com/vasconcel/escombros-log.git
cd escombros-log
```

#### 2. Execução Local
Para carregar `data/projects.json` sem erros de CORS, rode um servidor local:

```bash
# Python 3
python -m http.server
```
Acesse: `http://localhost:8000`

*Alternativa: Use o VS Code com a extensão **Live Server**.*

#### 3. Deploy (GitHub Pages)
1.  Use a branch `main`.
2.  Vá em **Settings** → **Pages**.
3.  Selecione `/ (root)` como diretório.

---

### 🤝 Colaboração

O laboratório é um projeto de conhecimento aberto e em evolução contínua. Sugestões, *issues*, estudos de caso e interlocuções são bem-vindas.

*   **Researcher:** Gabriel V. Silva
*   **Email:** `gabriel.vasconcel@outlook.com`
*   **GitHub:** [@vasconcel](https://github.com/vasconcel)

---

### 📄 Licença

*   Os **códigos** serão distribuídos sob **MIT License**.
*   **Conteúdos textuais** seguem a filosofia:

**// OPEN KNOWLEDGE — NO_RIGHTS_RESERVED**
Podem ser reutilizados livremente, preservando a integridade autoral.

<p align="center">
    <code>// OPEN KNOWLEDGE — MIT LICENSE — NO_RIGHTS_RESERVED</code>
</p>
