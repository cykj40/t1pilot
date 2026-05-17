'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useRef, useState } from 'react'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ArtifactData, T1UIMessage } from '@/types/artifacts'
import { ChatInput } from './ChatInput'
import { ChatMessage } from './ChatMessage'

const SUGGESTED_PROMPTS = [
  "What's my glucose trend today?",
  "How did yesterday's ride affect my levels?",
  'Am I in range this week?',
  'Log 45g carbs at breakfast',
]

interface AgentChatProps {
  onArtifact: (artifact: ArtifactData) => void
}

export function AgentChat({ onArtifact }: AgentChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [hasSent, setHasSent] = useState(false)

  const { messages, sendMessage, status } = useChat<T1UIMessage>({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onData: (dataPart) => {
      if (dataPart.type === 'data-artifact') {
        onArtifact(dataPart.data as ArtifactData)
      }
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new message arrival
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    setHasSent(true)
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text }],
    })
  }

  function handleSuggestedPrompt(prompt: string) {
    setInput(prompt)
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex h-10 items-center border-b border-border px-4 shrink-0">
        <span className="text-xs font-medium text-muted-foreground">Agent Chat</span>
        <span
          className={`ml-auto inline-flex items-center gap-1.5 text-[10px] ${isLoading ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}
          />
          {isLoading ? 'Thinking…' : 'Ready'}
        </span>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-4 py-4">
          {messages.length === 0 && !hasSent ? (
            <EmptyState onSelectPrompt={handleSuggestedPrompt} />
          ) : (
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="shrink-0 border-t border-border">
        <ChatInput
          input={input}
          onInputChange={(e) => setInput(e.target.value)}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
        <MedicalDisclaimer />
      </div>
    </div>
  )
}

function EmptyState({ onSelectPrompt }: { onSelectPrompt: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
        <span className="text-xl font-bold text-primary">T1</span>
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">T1Copilot</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Ask about your glucose, workouts, or log an event
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/10 hover:text-foreground transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
