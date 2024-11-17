# Gmail Chat RAG Application

An AI-powered chat interface for your Gmail inbox that allows you to have natural conversations about your email contents using advanced RAG (Retrieval Augmented Generation) technology.

## Features

- 🔒 **Secure Gmail Integration** - Access your emails securely through Google OAuth
- 💬 **Natural Language Queries** - Ask questions about your emails in natural language
- 🤖 **AI-Powered Responses** - Get intelligent responses with context from your email history
- 📎 **Smart Email Retrieval** - Automatically finds and links to relevant emails
- 🎯 **Vector Search** - Utilizes pgvector for semantic search capabilities
- 🧠 **RAG Architecture** - Combines retrieval-based and generative AI approaches

## Technical Architecture

### RAG Implementation

This application implements a Retrieval Augmented Generation (RAG) system with the following components:

1. **Email Processing Pipeline**
   - Extracts text content from Gmail messages
   - Generates embeddings using OpenAI's text-embedding-3-small model
   - Stores vectors in Supabase's pgvector extension

2. **Semantic Search**
   - Uses cosine similarity to find relevant email content
   - Implements efficient vector search using IVFFlat indexes
   - Returns contextually similar emails based on user queries

3. **Response Generation**
   - Retrieves relevant email context using vector similarity
   - Augments GPT-4 prompts with retrieved context
   - Generates natural language responses with source citations

## Getting Started

### Prerequisites

- Node.js 18.x or later
- A Google Cloud Platform account with Gmail API enabled
- An OpenAI API key
- A Supabase account and project with pgvector extension enabled

### Environment Variables

Create a `.env.local` file with the following variables:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# OpenAI
OPENAI_API_KEY=your_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gmail-chat-rag.git
cd gmail-chat-rag
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start using the application.

## Technology Stack

- 🔷 **TypeScript** - Type-safe development
- ⚡ **Next.js 14** - React framework with App Router
- 🎨 **Tailwind CSS** - Utility-first CSS
- 🎯 **tRPC** - End-to-end typesafe APIs
- 🎪 **shadcn/ui** - Beautiful UI components
- 📧 **Gmail API** - Email integration
- 🗃️ **Supabase + pgvector** - Vector database for semantic search
- 🤖 **OpenAI API** - GPT-4 and text embeddings
- 🔍 **Vector Search** - Semantic similarity search with pgvector

<img width="621" alt="img" src="https://github.com/user-attachments/assets/13f0ad7c-729f-40d0-bb5c-7f5fa91222f3">

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Next.js team for the amazing framework
- Built with ❤️ using OpenAI's GPT-4 technology
- Powered by Supabase's pgvector implementation
