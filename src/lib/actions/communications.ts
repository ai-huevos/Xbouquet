'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getConversations() {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    // Fetch conversations where the user is either the shop or the supplier
    const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
            *,
            shop:shop_profiles(profile_id, profiles(full_name, avatar_url)),
            supplier:supplier_profiles(profile_id, profiles(full_name, avatar_url)),
            messages (
                id, content, created_at, sender_id, read_at
            )
        `)
        // Filter by the user's profile ID
        .or(`shop_id.eq.${profile.id},supplier_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        return { error: 'Failed to fetch conversations' }
    }

    // Process to get the 'other' party and the latest message
    const processed = conversations.map((conv: any) => {
        const isShop = profile.role === 'shop'
        const otherParty = isShop ? conv.supplier : conv.shop
        // Supabase returns nested relations as arrays sometimes or objects. Let's assume object since it's 1-to-1 profiles
        const otherProfile = otherParty?.profiles || {}

        // Sort messages by created_at desc to find latest
        const sortedMessages = (conv.messages || []).sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        const latestMessage = sortedMessages[0] || null

        // Count unread messages
        const unreadCount = sortedMessages.filter((m: any) => m.sender_id !== profile.id && !m.read_at).length

        return {
            ...conv,
            otherParty: {
                id: otherParty?.profile_id,
                name: otherProfile.full_name || 'Unknown',
                avatar: otherProfile.avatar_url,
            },
            latestMessage,
            unreadCount
        }
    })

    return { conversations: processed }
}

export async function getMessages(conversationId: string) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    const { data: messages, error } = await supabase
        .from('messages')
        .select(`*, sender:profiles(full_name, avatar_url)`)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching messages:', error)
        return { error: 'Failed to fetch messages' }
    }

    // Mark unread messages as read
    const unreadMessages = messages.filter(m => m.sender_id !== profile.id && !m.read_at)
    if (unreadMessages.length > 0) {
        await supabase
            .from('messages')
            .update({ read_at: new Date().toISOString() })
            .in('id', unreadMessages.map(m => m.id))
    }

    return { messages }
}

export async function sendMessage(recipientId: string, content: string, conversationId?: string) {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    let targetConvId = conversationId

    // If no conversationId, find or create one
    if (!targetConvId) {
        const shopId = profile.role === 'shop' ? profile.id : recipientId
        const supplierId = profile.role === 'supplier' ? profile.id : recipientId

        // Try to find
        const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .eq('shop_id', shopId)
            .eq('supplier_id', supplierId)
            .single()

        if (existing) {
            targetConvId = existing.id
        } else {
            // Create new
            const { data: newConv, error: createError } = await supabase
                .from('conversations')
                .insert({ shop_id: shopId, supplier_id: supplierId })
                .select('id')
                .single()
            if (createError) return { error: 'Failed to create conversation' }
            targetConvId = newConv.id
        }
    }

    // Insert message
    const { data: message, error: messageError } = await supabase
        .from('messages')
        .insert({
            conversation_id: targetConvId,
            sender_id: profile.id,
            content
        })
        .select('*')
        .single()

    if (messageError) return { error: 'Failed to send message' }

    revalidatePath('/(dashboard)/shop/messages', 'page')
    revalidatePath('/(dashboard)/supplier/dashboard/messages', 'page')

    return { message }
}

export async function getNotifications() {
    const supabase = await createClient()

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching notifications:', error)
        return { error: 'Failed to fetch notifications' }
    }

    return { notifications }
}

export async function markNotificationRead(notificationId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)

    if (error) return { error: 'Failed to mark notification as read' }
    return { success: true }
}

export async function markAllNotificationsRead() {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return { error: 'Not authenticated' }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { error: 'Profile not found' }

    const { error } = await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('user_id', profile.id)
        .is('read_at', null)

    if (error) return { error: 'Failed to mark notifications as read' }
    return { success: true }
}

export async function getUnreadNotificationCount() {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return { count: 0 }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userData.user.id)
        .single()
    if (!profile) return { count: 0 }

    const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .is('read_at', null)

    if (error) {
        console.error('Error fetching unread count:', error)
        return { count: 0 }
    }

    return { count: count || 0 }
}

