'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendMessage } from '@/lib/actions/communications'

interface Conversation {
    id: string
    shop_id: string
    supplier_id: string
    otherParty: {
        id: string
        name: string
        avatar?: string
    }
    latestMessage?: { content: string }
    unreadCount: number
    updated_at: string
}

export function MessagesClient({
    profile,
    initialConversations,
    initialMessages,
    activeConversationId,
    role
}: {
    profile: any
    initialConversations: Conversation[]
    initialMessages: any[]
    activeConversationId?: string
    role: 'shop' | 'supplier'
}) {
    const router = useRouter()
    const [messageText, setMessageText] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages load
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [initialMessages])

    const activeConversation = initialConversations.find(c => c.id === activeConversationId)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!messageText.trim() || !activeConversation) return

        setIsSending(true)
        const result = await sendMessage(activeConversation.otherParty.id, messageText, activeConversation.id)
        setIsSending(false)

        if (!result.error) {
            setMessageText('')
            // The server action calls revalidatePath, which should refresh the data.
            // We just need to wait a tick for the router to refresh
            router.refresh()
        } else {
            alert(result.error)
        }
    }

    const selectConversation = (id: string) => {
        const basePath = role === 'shop' ? '/shop/messages' : '/supplier/messages'
        router.push(`${basePath}?conversation=${id}`)
    }

    return (
        <div className="flex w-full h-full">
            {/* Conversations List Sidebar */}
            <div className="w-1/3 min-w-[300px] border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-white/40 dark:bg-zinc-900/40">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                    <h2 className="font-semibold text-lg">Conversations</h2>
                </div>
                <div className="flex-1 overflow-y-auto w-full">
                    {initialConversations.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-sm">
                            <p>No conversations yet.</p>
                        </div>
                    ) : (
                        initialConversations.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => selectConversation(conv.id)}
                                className={`w-full text-left p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors flex items-start gap-3 ${activeConversationId === conv.id ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                            >
                                <div className="w-10 h-10 shrink-0 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                                    {conv.otherParty.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-sm truncate">{conv.otherParty.name}</h3>
                                        <span className="text-[10px] text-zinc-400">
                                            {new Date(conv.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 truncate">
                                        {conv.latestMessage?.content || 'No messages yet...'}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                        {conv.unreadCount}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Active Conversation Pane */}
            <div className="flex-1 flex flex-col bg-white/20 dark:bg-zinc-950/20 relative">
                {activeConversation ? (
                    <>
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3 bg-white/60 dark:bg-zinc-900/60 sticky top-0 z-10">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold">
                                {activeConversation.otherParty.name.charAt(0)}
                            </div>
                            <h2 className="font-semibold">{activeConversation.otherParty.name}</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {initialMessages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                                    <p>Send a message to start the conversation.</p>
                                </div>
                            ) : (
                                initialMessages.map(msg => {
                                    const isMe = msg.sender_id === profile.id
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe
                                                    ? 'bg-primary-500 text-white rounded-br-none'
                                                    : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-bl-none text-zinc-800 dark:text-zinc-200'
                                                }`}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-zinc-400 mt-1 px-1">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-white/60 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800">
                            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    disabled={isSending}
                                />
                                <button
                                    type="submit"
                                    disabled={!messageText.trim() || isSending}
                                    className="absolute right-2 w-10 h-10 rounded-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:hover:bg-primary-500 text-white flex items-center justify-center transition-colors"
                                >
                                    {isSending ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-0.5">
                                            <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                                        </svg>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm flex-col gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-zinc-300 dark:text-zinc-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    )
}
