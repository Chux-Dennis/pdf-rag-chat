import readline from "readline";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";

(async () => {
  // 1. Load PDF
  const loader = new PDFLoader("sample_topic.pdf");
  const docs = await loader.load();

  // 2. Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 200,
  });
  let splitDocs = await splitter.splitDocuments(docs);

  // 3. Clean metadata
  splitDocs = splitDocs.map((doc, i) => ({
    ...doc,
    metadata: {
      id: `doc_${i}`,
      source: String(doc.metadata.source || "unknown"),
      page: Number(doc.metadata.loc?.pageNumber || 0),
    },
  }));

  // 4. Setup embeddings with Ollama
  const embeddings = new OllamaEmbeddings({
    model: "nomic-embed-text",
  });

  // 5. Create (or connect to) collection
  const vectorStore = await Chroma.fromDocuments(splitDocs, embeddings, {
    collectionName: "pdf_collection_qwen",
    url: "http://localhost:8000",
  });

  console.log("✅ PDF uploaded to ChromaDB (pdf_collection_qwen)");

  // 6. Setup Gemma2 model
  const model = new ChatOllama({ model: "gemma2:2b" });
  const parser = new StringOutputParser();

  // 7. Interactive Q&A
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = () => {
    rl.question("\n❓ Ask a question about the PDF: ", async (userQuery) => {
      if (userQuery.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      // Search vector store with user query
      const results = await vectorStore.similaritySearch(userQuery, 4);

      // Build context
      const context = results.map(r => r.pageContent).join("\n\n");

      // Ask model
      const answer = await model
        .pipe(parser)
        .invoke(
          `You are an assistant. 
           Use only the context below to answer the question.
           If the context is not enough, say "I could not find that in the PDF."

           Context:
           ${context}

           Question: ${userQuery}`
        );

      console.log("\n💡 Answer:\n", answer);

      askQuestion(); // loop again
    });
  };

  askQuestion();
})();
