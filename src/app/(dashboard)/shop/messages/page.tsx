import { getConversations, getMessages, sendMessage } from '@/lib/actions/communications'
import { getProfile } from '@/lib/actions/profiles'
import { MessagesClient } from '@/components/communications/MessagesClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ShopMessagesPage({
    searchParams
}: {
    searchParams: Promise<{ conversation?: string }>
}) {
    const profile = await getProfile()
    if (!profile) redirect('/login')

    const resolvedParams = await searchParams
    const activeConversationId = resolvedParams.conversation

    const { conversations } = await getConversations()

    let messages: any[] = []
    if (activeConversationId) {
        const result = await getMessages(activeConversationId)
        if (result.messages) {
            messages = result.messages
        }
    }

    return (
        <div className="h-[calc(100vh-73px)] flex flex-col pt-6 px-6 max-w-[1440px] mx-auto w-full">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6 shrink-0">Messages</h1>
            <div className="flex-1 glass-panel border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm flex mb-6 min-h-0">
                <MessagesClient
                    profile={profile}
                    initialConversations={conversations || []}
                    initialMessages={messages}
                    activeConversationId={activeConversationId}
                    role="shop"
                />
            </div>
        </div>
    )
}
