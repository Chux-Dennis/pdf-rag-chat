#  PDF Q&A with Chroma + Ollama

This project demonstrates how to build a **local knowledge base from a PDF** and query it interactively using **LangChain**, **ChromaDB**, and **Ollama models**.
It combines **vector search** with **LLMs** to provide context-aware answers from your documents.

---

##  Features

* Load and parse a PDF file with **LangChain PDFLoader**.
* Split text into smaller chunks with **RecursiveCharacterTextSplitter** for better retrieval.
* Generate embeddings using **Ollama embeddings (`nomic-embed-text`)**.
* Store and manage embeddings in **ChromaDB**.
* Perform semantic search against the vector database.
* Use a **local Ollama model (`gemma2:2b`)** for Q&A with natural language queries.
* Interactive CLI loop to continuously ask questions about the PDF.

---

## 🛠️ Requirements

* **Node.js** (v18 or higher recommended)
* **ChromaDB** running locally (`http://localhost:8000`) (Run a Docker container of Chroma preferrably.)
* **Ollama** installed with the following models:

  * [`nomic-embed-text`](https://ollama.ai/library/nomic-embed-text) (for embeddings)
  * [`gemma2:2b`](https://ollama.ai/library/gemma2) (for answering questions)

---

## 📂 Project Structure

```
project/
│── sample_topic.pdf       # Example PDF used for knowledge base
│── index.ts               # Main script
│── package.json           # Dependencies
└── README.md              # Documentation
```

---

## How It Works

1. **PDF Loading** → Reads `sample_topic.pdf` into memory.
2. **Chunking** → Splits the text into 500-character overlapping chunks.
3. **Metadata Cleaning** → Stores each chunk with `id`, `source`, and `page`.
4. **Embeddings** → Converts chunks into vectors using Ollama’s `nomic-embed-text`.
5. **Vector Store** → Saves embeddings in a ChromaDB collection.
6. **Interactive Search** → On each user query:

   * Perform semantic search in ChromaDB.
   * Retrieve the most relevant chunks.
   * Provide context to the LLM (`gemma2:2b`).
   * Return a natural language answer.

---

##  Usage

1. Start **ChromaDB** locally: 

   ```bash
   chroma run --path ./chroma
   ```
   Alternatively , you can run a docker container of Chroma image.
2. Ensure Ollama is running and models are pulled:

   ```bash
   ollama pull nomic-embed-text
   ollama pull gemma2:2b
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Run the script:

   ```bash
   ts-node index.ts
   ```
5. Ask questions about the PDF in the terminal:

   ```
   ❓ Ask a question about the PDF: What are the applications of AI?
   💡 Answer: AI aids in healthcare (diagnosis, drug discovery), finance (fraud detection, risk analysis), education (adaptive learning), and entertainment (recommendation engines).
   ```

Type `exit` to quit the interactive loop.

---

##  Key Concepts

* **Vector Databases** store embeddings for semantic search.
* **Embeddings** turn text into high-dimensional vectors so similar meanings cluster together.
* **Retrieval-Augmented Generation (RAG)** → Combines vector search results with an LLM to ground answers in your documents.
* **LangChain** simplifies the pipeline of loaders, splitters, embeddings, and model calls.

---

## 📌 Next Steps

* Replace `sample_topic.pdf` with your own documents.
* Extend to handle multiple PDFs.
* Swap in different Ollama models (e.g., `qwen2`, `llama3`) for Q&A.
* Connect to a **database** instead of PDFs for a richer knowledge base.

---

##  Credits

* [LangChain](https://js.langchain.com/)
* [ChromaDB](https://www.trychroma.com/)
* [Ollama](https://ollama.ai/)
* [Ana Vee's Medium Post](https://medium.com/keeping-up-with-ai/how-i-built-a-rag-based-ai-chatbot-from-my-personal-data-88eec0d3483c)

---
