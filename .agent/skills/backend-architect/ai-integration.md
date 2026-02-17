---
name: ai-integration-specialist
description: Integrates AI capabilities (LLMs, embeddings, computer vision) into web applications using APIs and SDKs. Covers prompt engineering, RAG patterns, streaming responses, and cost optimization. Use when adding chatbots, semantic search, content generation, or AI-powered features.
---

# AI Integration Specialist

## LLM Integration Basics

**API Providers:**
- OpenAI (GPT-4, GPT-4o)
- Anthropic (Claude 3.5 Sonnet)
- Google (Gemini Pro)
- Open-source (Llama via Together AI)

**Basic Integration:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

async function generateResponse(userMessage: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: userMessage }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}
```

## Streaming Responses

```typescript
async function* streamResponse(userMessage: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: userMessage }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    yield content; // Send to frontend token-by-token
  }
}

// Frontend usage
for await (const token of streamResponse(message)) {
  appendToChat(token);
}
```

## RAG (Retrieval-Augmented Generation)

**Use Case:** Answer questions using your own data

**Architecture:**
1. **Indexing:** Chunk documents → embeddings → vector DB
2. **Retrieval:** User query → embedding → find similar chunks
3. **Generation:** Context + query → LLM → answer

**Implementation:**
```typescript
import { OpenAI } from 'openai';
import { PineconeClient } from '@pinecone-database/pinecone';

const openai = new OpenAI();
const pinecone = new PineconeClient();

// 1. Index documents (one-time)
async function indexDocument(text: string, id: string) {
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  await pinecone.index('docs').upsert([{
    id,
    values: embedding.data[0].embedding,
    metadata: { text }
  }]);
}

// 2. Query with RAG
async function answerQuestion(question: string) {
  // Get embedding for question
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: question,
  });

  // Find relevant documents
  const results = await pinecone.index('docs').query({
    vector: embedding.data[0].embedding,
    topK: 3,
    includeMetadata: true,
  });

  // Build context
  const context = results.matches
    .map(match => match.metadata.text)
    .join('\n\n');

  // Generate answer with context
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Answer based on context. If context doesn\'t contain answer, say so.'
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${question}`
      }
    ],
  });

  return completion.choices[0].message.content;
}
```

## Prompt Engineering

**Best Practices:**
- Clear instructions: "Summarize in 3 bullet points"
- Provide context and background
- Use examples (few-shot learning)
- Specify output format: "Respond in JSON"
- Add constraints: "Keep under 100 words"

**Structured Outputs:**
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Extract key info from email: ...' }
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'email_analysis',
      schema: {
        type: 'object',
        properties: {
          sender: { type: 'string' },
          urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
          action_required: { type: 'boolean' },
        },
        required: ['sender', 'urgency'],
      },
    },
  },
});
```

## Cost Optimization

**Strategies:**
- Use cheaper models for simple tasks (gpt-4o-mini)
- Cache responses (same input → same output)
- Limit `max_tokens` (prevent runaway costs)
- Batch requests when possible

**Caching Example:**
```typescript
import { Redis } from '@upstash/redis';
const redis = new Redis({ /* ... */ });

async function getCachedCompletion(prompt: string) {
  const cached = await redis.get(`llm:${prompt}`);
  if (cached) return cached;

  const response = await generateResponse(prompt);
  await redis.set(`llm:${prompt}`, response, { ex: 3600 });
  
  return response;
}
```

## Function Calling (Tool Use)

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string' },
        },
        required: ['location'],
      },
    },
  },
];

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Weather in Jakarta?' }],
  tools,
  tool_choice: 'auto',
});

// LLM decides to call function
const toolCall = completion.choices[0].message.tool_calls?.[0];
if (toolCall?.function.name === 'get_weather') {
  const args = JSON.parse(toolCall.function.arguments);
  const weather = await fetchWeather(args.location);
  // Send result back to LLM for final response
}
```

## Image Generation

```typescript
const image = await openai.images.generate({
  model: 'dall-e-3',
  prompt: 'A futuristic cityscape at sunset',
  size: '1024x1024',
  quality: 'hd',
});

const imageUrl = image.data[0].url;
```

## Safety & Moderation

```typescript
const moderation = await openai.moderations.create({
  input: userMessage,
});

if (moderation.results[0].flagged) {
  return { error: 'Content violates guidelines' };
}
```

## Best Practices

- **Error handling:** API calls can fail
- **Rate limiting:** Prevent budget drain
- **Validation:** Don't trust LLM output blindly
- **Privacy:** Don't send sensitive data to third-party APIs
- **Monitoring:** Track token usage and costs

## Anti-Patterns

❌ No error handling
❌ Exposing API keys in frontend
❌ No rate limiting
❌ Ignoring token limits
❌ No caching (wasted costs)
❌ Trusting LLM output without validation
❌ No content moderation
