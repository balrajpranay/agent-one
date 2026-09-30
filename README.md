# ⚡ Agent One (Autonomous Multi-Modal Intelligence)

<p align="center">
  <strong>The one agent you need for all your tasks.</strong><br />
  <em>Universal Multi-Format Ingestion • Autonomous Skill Routing • Coordinate-Grounded Citations • Neo4j GraphRAG</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3.1_(Turbopack)-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.0_Flash_%26_Pro-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Neo4j-GraphRAG-008CC1?style=for-the-badge&logo=neo4j&logoColor=white" alt="Neo4j" />
  <img src="https://img.shields.io/badge/Qdrant-Vector_Search-DC2626?style=for-the-badge&logo=qdrant&logoColor=white" alt="Qdrant" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4_(Obsidian_%26_Emerald)-00FF85?style=for-the-badge&logo=tailwind-css&logoColor=black" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Production_Suite-4%2F4_Passing-059669?style=for-the-badge" alt="Build Status" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 📌 Table of Contents

- [The Problem Agent One Solves](#-the-problem-agent-one-solves)
- [The Solution & Core Positioning](#-the-solution--core-positioning)
- [Key Innovations & Features](#-key-innovations--features)
- [System Architecture](#-system-architecture)
- [Core Workflow](#-core-workflow)
- [Interactive Workspace Dashboard](#-interactive-workspace-dashboard)
- [Technology Stack](#-technology-stack)
- [Getting Started & Installation](#-getting-started--installation)
- [Automated Verification & Test Harness](#-automated-verification--test-harness)
- [API Reference](#-api-reference)
- [Docker & Containerized Deployment](#-docker--containerized-deployment)
- [Team & Contributions](#-team--contributions)
- [Hackathon Evaluation & Judging Criteria](#-hackathon-evaluation--judging-criteria)
- [License](#-license)

---

## 🚨 The Problem Agent One Solves

In today's AI landscape, users and enterprise teams face three critical friction points when dealing with documents and multi-step tasks:

1. **The Tool Fragmentation Dilemma**: Users are forced to juggle separate single-purpose AI wrappers—one for PDF summaries, another for Word editing, a third for data spreadsheets, and a fourth for contract review. Switching contexts wastes hours and destroys data continuity.
2. **Cognitive Overload from Generic Prompt Bloat**: When a user uploads a document, typical AI interfaces dump 40+ generic prompts, complex taxonomy selectors, or confusing category pickers. Users are paralyzed by options that have zero relevance to their specific file.
3. **The Hallucination & Grounding Deficit**: Traditional LLM chat interfaces summarize documents blindly. When reviewing critical numbers, liability clauses, fee schedules, or dates, standard AI provides text without spatial proof—leading to costly mistakes, lack of auditability, and zero institutional trust.

---

## 💡 The Solution & Core Positioning

> **Agent One — The one agent you need for all your tasks.**

Agent One reimagines document interaction by unifying multi-modal perception, autonomous skill execution, and context-tailored prompt delivery into **one cohesive, intelligent assistant**.

### Core Philosophy: Zero-Friction Intelligence
When you drop any file into Agent One—whether a **PDF contract**, a **Word (.docx) proposal**, a **Markdown technical spec**, a **financial spreadsheet (.xlsx/.csv)**, or a **high-resolution scan (.png/.jpg)**:

1. **Invisible Semantic Analysis**: Agent One scans the document's structure, typography, entities, and data tables. It identifies the file's domain and intent under the hood **while keeping the raw classification hidden from the user**.
2. **Context-Tailored Action Deck**: Instead of overwhelming the user, Agent One surfaces **only the most relevant templates, action shortcuts, and content-friendly prompts** explicitly designed for that document. Irrelevant features and generic prompts remain invisible.
3. **Pixel-Accurate Coordinate Grounding**: Every extracted figure, clause, risk, and entity is bound to its exact normalized page coordinates `(x, y, width, height)` on the original file. Clicking any citation triggers smooth dual-pane viewer crosshairs that visually illuminate the source.

---

## 🌟 Key Innovations & Features

### 1. 🔍 Universal Multi-Format Document Ingestion
Agent One handles heterogeneous document formats natively:
- **PDF Documents (`.pdf`)**: Native multi-page vectorization, layout preservation, and bounding box mapping via `pdf-parse`.
- **Microsoft Word Documents (`.docx`, `.doc`)**: Hierarchical heading, table, bullet point, and metadata extraction via `mammoth`.
- **Markdown & Plain Text (`.md`, `.txt`)**: Structured AST parsing for code blocks, markdown tables, and nested sections.
- **Data Spreadsheets & Invoices (`.xlsx`, `.xls`, `.csv`)**: Tabular data parsing with dynamic Recharts visualization and statistical summaries.
- **Scanned Documents & Images (`.png`, `.jpg`, `.jpeg`)**: High-accuracy multimodal OCR powered by Gemini 2.0 Flash.

### 2. 🧠 Autonomous Skill Routing & Dynamic Prompt Synthesis
Agent One auto-activates specialized intelligence skills based on document semantics:
- **Legal & Contracts (`legal.md`)**: Extracts contracting parties, obligation matrices, indemnity covenants, liability caps, termination notice periods, and dispute jurisdictions.
- **Finance & Banking (`finance.md`)**: Detects NAVs, expense ratios, redemption lock-in windows, hidden charges, penalty fees, and payment milestones.
- **Corporate & Operations (`corporate.md`)**: Maps SLAs, milestone deliverables, vendor obligations, and board resolutions.
- **Insurance & Policies (`insurance.md`)**: Identifies sum insured, deductibles, named exclusions, co-pay ratios, and claim filing conditions.
- **Academic & Research (`academic.md`)**: Synthesizes empirical hypotheses, statistical p-values, benchmarks, and citation lineage.
- **Universal General (`general.md`)**: Executive synthesis, core facts, timeline milestones, and grounded action items.

### 3. 🕸️ Hybrid GraphRAG with Leiden Community Detection
- **Neo4j Aura Knowledge Graph**: Maps extracted entities and semantic relationships (`DEFINED_IN`, `CARRIES_RISK`, `DUE_ON`, `OBLIGATED_TO`) directly into a connected graph.
- **Leiden Community Detection**: Clusters related clauses and entities into thematic communities to surface hidden organizational risks and dependency cycles.
- **Zero-Config In-Memory Fallback**: Seamless local in-memory graph store with cosine similarity retrieval when offline or without external database credentials.

### 4. ⚖️ Cross-Document Semantic Comparison (Diffing)
- Compare two versions of any contract, lease, or report side-by-side.
- Computes overall semantic similarity score.
- Categorizes exact clause modifications: **Added Clauses**, **Removed Clauses**, and **Shifted Quantitative Values** (e.g., changes in fee percentages, notice days, or indemnity caps).

### 5. 🛡️ Isolated Gemini MCP Server Architecture (`mcp/gemini-server`)
- Built upon the **Model Context Protocol (MCP)** standards with strict boundary guards:
  ```text
  <<<SYSTEM>>> ... <<</SYSTEM>>>
  <<<SKILL>>> ... <<</SKILL>>>
  <<<USER>>> ... <<</USER>>>
  <<<DOCUMENT>>> ... <<</DOCUMENT>>>
  <<<TOOL>>> ... <<</TOOL>>>
  ```
- **Zod Runtime Schema Validation**: All tool invocations (`analyzeMultimodal`, `extractStructured`, `reason`, `answerWithEvidence`, `compareDocuments`, `embedText`) are validated at runtime.
- **Prompt Injection Defense**: Strips adversarial prompt overrides and enforces strict citation grounding.

### 6. 🤝 Human-in-the-Loop Action Safeguards
- Agent One never executes destructive external operations without explicit confirmation.
- Interactive **Action Confirmation Modal** presents full payload parameters before triggering Google Calendar deadline syncs or external webhooks.

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Client["🖥️ Agent One Client (Next.js 16 App Router)"]
        UI[Unified Obsidian/Emerald HUD]
        DV[Spatial Split-Pane Viewer]
        GV[GraphRAG Visualizer]
        CD[Cross-Doc Semantic Diff]
    end

    subgraph Ingestion["📂 Multi-Format Ingestion Pipeline"]
        Upload[File Drop: PDF / DOCX / MD / PNG / XLSX]
        PDFParser[pdf-parse Engine]
        WordParser[mammoth DOCX Engine]
        OCR[Gemini Multimodal OCR]
    end

    subgraph Intelligence["🧠 Autonomous Intelligence Layer"]
        Router[Semantic Skill Router]
        PromptGen[Contextual Prompt Synthesizer]
        PromptDeck[Filtered Relevant Prompt Deck]
    end

    subgraph MCPServer["🛡️ Isolated Gemini MCP Server"]
        Guard[Strict Prompt Guard Isolation]
        Tools[Zod-Validated MCP Tools]
        Gemini[Google Gemini 2.0 Flash / Pro]
    end

    subgraph Knowledge["💾 Dual Retrieval & Knowledge Layer"]
        Neo4j[(Neo4j Aura GraphRAG)]
        Qdrant[(Qdrant Cloud Vector DB)]
        MemGraph[(In-Memory Fallback Store)]
    end

    Upload --> PDFParser & WordParser & OCR
    PDFParser & WordParser & OCR --> Router
    Router -->|Hidden Classification| PromptGen
    PromptGen --> PromptDeck
    PromptDeck --> UI
    
    UI -->|Natural Language Query| Tools
    Tools --> Guard --> Gemini
    Gemini --> Tools
    Tools --> Neo4j & Qdrant & MemGraph
    Neo4j & Qdrant & MemGraph --> DV & GV & CD
```

---

## 🔄 Core Workflow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant App as Agent One Workspace
    participant Ingest as Multi-Format Engine
    participant Agent as Autonomous Skill Router
    participant MCP as Gemini MCP Server
    participant Graph as Neo4j / Qdrant Store

    User->>App: Drops File (PDF, DOCX, MD, Image, XLSX)
    App->>Ingest: Stream file buffer & extract raw pages/structure
    Ingest->>Agent: Send semantic extract
    Note over Agent: Classifies intent & extracts entities under the hood
    Agent-->>App: Surface ONLY relevant action templates & prompt pills
    Note over User,App: User sees zero classification clutter — only tailored prompts!
    
    User->>App: Selects prompt or asks question
    App->>MCP: Dispatch query with Strict Prompt Guard
    MCP->>Graph: Query GraphRAG relationships & vector chunks
    Graph-->>MCP: Grounded context & Leiden community paths
    MCP-->>App: Response with normalized Bounding Boxes [x, y, w, h]
    App->>User: Displays response with interactive "Jump to Page" crosshairs
```

---

## 💻 Interactive Workspace Dashboard

The Agent One dashboard (`/dashboard`) features five synchronized intelligence views designed around an obsidian-and-emerald design system:

| View Tab | Icon | Purpose & User Benefit |
| :--- | :---: | :--- |
| **AI Chat** | `Bot` | Interactive natural-language reasoning with grounded coordinate badges, web search toggle, and calendar dispatch. |
| **Deep Intelligence** | `Sparkles` | Synthesized executive overview, categorized risk matrix (critical/medium/low), important dates, hidden clauses, and grounding index. |
| **GraphRAG Explorer** | `Network` | Interactive SVG/HTML5 force-directed entity relationship network with Leiden community detection, zoom/pan controls, and node inspector. |
| **Cross-Doc Diff** | `GitCompare` | Semantic comparison between two documents detailing similarity score, added covenants, removed clauses, and changed numerical values. |
| **Agent Activity** | `Activity` | Live audit trail logging MCP tool invocations, model latency, duration, and parameter payloads. |

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router, Turbopack) | `16.3.1` | Server Components, routing, high-performance rendering |
| **UI Library** | React | `19.2.8` | Component lifecycle, responsive state machines |
| **Language** | TypeScript | `5.0+` | End-to-end static type safety and contract enforcement |
| **Styling & Theme** | Tailwind CSS v4 | `4.0` | Custom Obsidian (`#090a0f`) & Electric Emerald (`#00FF85`) design |
| **AI & Multimodal LLM** | Google Generative AI SDK | `@google/generative-ai 0.24.1` | Gemini 2.0 Flash / Pro multimodal inference |
| **Knowledge Graph** | Neo4j Aura | `neo4j-driver 6.2.0` | GraphRAG entity relationships & community clustering |
| **Vector Search** | Qdrant Cloud | Client REST | 384-dimensional dense semantic chunk retrieval |
| **Document Parsers** | `pdf-parse` & `mammoth` | `2.4.5` / `1.13.0` | Multi-page PDF extraction and Word DOCX AST parsing |
| **Schema Validation** | Zod | `4.6.5` | MCP tool parameter and payload validation |
| **Data Visualization** | Recharts & Lucide React | `3.10.1` / `1.31.0` | Dynamic financial bar/area charts and iconography |
| **Auth & Database** | Supabase | `@supabase/supabase-js 2.109.0` | User authentication, PostgreSQL database, storage |

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js**: `v20.x` or later (LTS recommended)
- **Package Manager**: `npm` (v10+), `pnpm`, or `yarn`
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/agent-one.git
cd agent-one
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a local environment file by copying the example template:
```bash
cp .env.example .env.local
```

Fill in your service credentials in `.env.local`:
```env
# 1. Google Gemini API (Required)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"

# 2. GraphRAG Knowledge Graph (Optional - Fallbacks to In-Memory Graph)
GRAPH_RAG_ENABLED="true"
NEO4J_URI="neo4j+s://your-instance.databases.neo4j.io"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="your-secure-password"

# 3. Vector Database (Optional - Fallbacks to Cosine Similarity)
QDRANT_URL="https://your-cluster.cloud.qdrant.io:6333"
QDRANT_API_KEY="your-qdrant-api-key"

# 4. Authentication & Storage (Optional - Fallbacks to Local Storage)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
NEXT_PUBLIC_SUPABASE_BUCKET_NAME="documents"

# 5. Google OAuth Client ID (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

> 💡 **Graceful Fallbacks**: Agent One is designed with 100% offline resilience. If Neo4j, Qdrant, or Supabase credentials are not provided, Agent One automatically switches to high-speed in-memory graph traversal, local cosine vector retrieval, and in-memory session persistence.

### Step 4: Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

---

## 🧪 Automated Verification & Test Harness

Agent One includes a four-tier automated testing suite that validates code quality, type correctness, document ingestion pipelines, and production builds:

```bash
npm test
```

### Verification Pipeline Results:
```text
🚀 Starting Agent One Automated Production Test Suite...

1️⃣ Checking TypeScript Compilation & Type Safety...
✅ TypeScript: 0 type errors found.

2️⃣ Running Next.js Linting Audit...
✅ ESLint: Zero lint errors found across codebase.

3️⃣ Running Universal Document Pipeline Integration Tests...
✅ Universal Pipeline: 15/15 tests passed (PDF, Word DOCX, Markdown, OCR).

4️⃣ Running Next.js Production Build...
▲ Next.js 16.3.1 (Turbopack)
✓ Compiled successfully in 16.1s
✓ Generating static pages (10/10)
✓ Finalizing page optimization ...
✅ Next.js Build: Production bundle generated successfully.

============================================================
🎉 ALL SYSTEMS OPERATIONAL: PRODUCTION SUITE PASSED (4/4)
============================================================
```

Individual test runners can also be invoked directly:
```bash
# TypeScript Type Check only
npx tsc --noEmit

# Document Pipeline Integration Test
npx tsx scripts/test-universal-pipeline.mjs

# API Route Health & Endpoint Verification
node scripts/test-api-endpoints.mjs
```

---

## 🔌 API Reference

| Endpoint | Method | Payload / Parameters | Response Highlights |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | None | Service statuses for Gemini API, GraphRAG, Vector DB, memory usage, latency. |
| `/api/analyze` | `POST` | `multipart/form-data` with document file or text buffer | JSON containing domain classification, executive summary, bounding boxes, risk matrix, entity network. |
| `/api/chat` | `POST` | `{ docId, query, isWebSearch, history }` | Grounded answer with coordinates `[x, y, w, h]`, table references, GraphRAG paths, suggestions. |
| `/api/compare` | `POST` | `{ docAId, docBId }` | Semantic similarity index, added clauses, removed clauses, shifted numeric values. |
| `/api/activity` | `GET` | Optional `?limit=50` | Audit trail of MCP tool execution, model latencies, execution timestamps. |
| `/api/documents` | `GET/POST` | Document metadata and storage payload | Persistent user audit sessions and document catalogue. |

---

## 🐳 Docker & Containerized Deployment

Agent One provides a production-grade multi-stage `Dockerfile` optimizing image size and runtime performance:

```bash
# Build the production Docker image
docker build -t agent-one:latest .

# Run the containerized service
docker run -p 3000:3000 --env-file .env.local agent-one:latest
```

Or deploy seamlessly with Docker Compose:
```bash
docker compose up -d
```

---

## 👥 Team & Contributions

This project was built for the hackathon by our multidisciplinary engineering team. Responsibilities were divided across key architectural domains:

| Team Member | Roll Number | Primary Role & Core Contributions |
| :--- | :---: | :--- |
| **B. Pranay Kumar** | **24QM1A6608** | **Lead AI Systems Architect & Backend Engineering**<br />• Architected the isolated Gemini Model Context Protocol (MCP) server with strict prompt boundary guards.<br />• Engineered the Google Gemini 2.0 Flash / Pro multimodal integration and token optimization pipeline.<br />• Designed the hybrid retrieval engine combining Neo4j Aura GraphRAG with Qdrant vector embeddings.<br />• Implemented core Next.js API routes (`/api/analyze`, `/api/chat`, `/api/compare`, `/api/activity`). |
| **A. Sai Athej Reddy** | **24QM1A6602** | **Frontend Architecture & UI/UX Design System Lead**<br />• Led the complete Agent One brand redesign with an obsidian (`#090a0f`) and electric emerald (`#00FF85`) design system.<br />• Developed the interactive split-pane document viewer with real-time coordinate bounding box overlays.<br />• Built the interactive GraphRAG knowledge graph visualizer with force-directed physics and node inspection.<br />• Ensured complete responsive design, dark/light mode parity, keyboard shortcuts, and command palette navigation. |
| **B. Manikanta** | **24QM1A6614** | **Document Processing & Contextual Prompt Intelligence**<br />• Built the multi-format ingestion pipeline supporting PDF (`pdf-parse`), Word (`mammoth`), Markdown, PNG, JPEG, Excel, and CSV.<br />• Engineered the autonomous semantic intent engine that detects required capabilities while keeping underlying classification hidden.<br />• Designed the dynamic contextual prompt synthesis system that surfaces only relevant templates and document actions.<br />• Developed the cross-document semantic comparison algorithm detecting clause changes and quantitative value shifts. |
| **B. Bharath** | **24QM1A6626** | **System Architecture, Quality Assurance & Deployment**<br />• Built the automated 4-tier production verification suite (`test-runner.mjs` and universal pipeline test scripts).<br />• Configured multi-stage Docker containerization (`Dockerfile` & `docker-compose.yml`) for production readiness.<br />• Implemented Supabase authentication, database schema migrations, and secure session management.<br />• Led technical documentation, benchmarking reports, and deployment reliability audits. |

---

## 🏆 Hackathon Evaluation & Judging Criteria

| Judging Dimension | How Agent One Excels |
| :--- | :--- |
| **Technical Innovation & Complexity** | Combines **Gemini 2.0 Multimodal OCR**, **Neo4j GraphRAG**, **Leiden community detection**, **Qdrant Vector DB**, and **MCP Server architecture** into an end-to-end production solution. |
| **User Experience & Design Polish** | Eliminates prompt clutter: users see only relevant actions tailored to their file. Built with a bespoke obsidian-and-emerald design system, interactive visual crosshairs, and fluid responsiveness. |
| **Real-World Value & Practicality** | Solves the enterprise document verification bottleneck for legal, finance, corporate, and healthcare sectors with verifiable coordinate citations and zero hallucination risk. |
| **Completeness & Production Quality** | 100% typed with TypeScript 5, passes all 4 automated test suites, includes multi-stage Docker deployment, and features offline graceful fallbacks for zero-setup execution. |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<p align="center">
  Built with ⚡ by the <strong>Agent One</strong> Team for the Hackathon.
</p>
