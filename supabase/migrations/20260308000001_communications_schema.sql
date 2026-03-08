create table public.conversations (
    id uuid default gen_random_uuid () primary key,
    shop_id uuid references public.shop_profiles (profile_id) on delete cascade not null,
    supplier_id uuid references public.supplier_profiles (profile_id) on delete cascade not null,
    created_at timestamptz default now () not null,
    updated_at timestamptz default now () not null,
    unique (shop_id, supplier_id)
);

create index conversations_shop_id_idx on public.conversations (shop_id);

create index conversations_supplier_id_idx on public.conversations (supplier_id);

create table public.messages (
    id uuid default gen_random_uuid () primary key,
    conversation_id uuid references public.conversations (id) on delete cascade not null,
    sender_id uuid references public.profiles (id) on delete cascade not null,
    content text not null,
    read_at timestamptz,
    created_at timestamptz default now () not null
);

create index messages_conversation_id_idx on public.messages (conversation_id);

create index messages_sender_id_idx on public.messages (sender_id);

create type notification_type as enum ('new_message', 'order_update');

create table public.notifications (
    id uuid default gen_random_uuid () primary key,
    user_id uuid references public.profiles (id) on delete cascade not null,
    type notification_type not null,
    title text not null,
    body text not null,
    link_url text,
    read_at timestamptz,
    created_at timestamptz default now () not null
);

create index notifications_user_id_idx on public.notifications (user_id);

create index notifications_read_at_idx on public.notifications (read_at);

alter table public.conversations enable row level security;

alter table public.messages enable row level security;

alter table public.notifications enable row level security;

-- Conversations RLS
create policy "Users can view their own conversations" on public.conversations for
select using (
        shop_id in (
            select profile_id
            from public.profiles
            where
                user_id = auth.uid ()
        )
        or supplier_id in (
            select profile_id
            from public.profiles
            where
                user_id = auth.uid ()
        )
    );

create policy "Users can insert conversations they are part of" on public.conversations for insert
with
    check (
        shop_id in (
            select profile_id
            from public.profiles
            where
                user_id = auth.uid ()
        )
        or supplier_id in (
            select profile_id
            from public.profiles
            where
                user_id = auth.uid ()
        )
    );

-- Messages RLS
create policy "Users can view messages in their conversations" on public.messages for
select using (
        conversation_id in (
            select id
            from public.conversations
            where
                shop_id in (
                    select profile_id
                    from public.profiles
                    where
                        user_id = auth.uid ()
                )
                or supplier_id in (
                    select profile_id
                    from public.profiles
                    where
                        user_id = auth.uid ()
                )
        )
    );

create policy "Users can insert messages in their conversations" on public.messages for insert
with
    check (
        sender_id in (
            select id
            from public.profiles
            where
                user_id = auth.uid ()
        )
        and conversation_id in (
            select id
            from public.conversations
            where
                shop_id in (
                    select profile_id
                    from public.profiles
                    where
                        user_id = auth.uid ()
                )
                or supplier_id in (
                    select profile_id
                    from public.profiles
                    where
                        user_id = auth.uid ()
                )
        )
    );

create policy "Users can update (mark read) messages in their conversations" on public.messages for
update using (
    conversation_id in (
        select id
        from public.conversations
        where
            shop_id in (
                select profile_id
                from public.profiles
                where
                    user_id = auth.uid ()
            )
            or supplier_id in (
                select profile_id
                from public.profiles
                where
                    user_id = auth.uid ()
            )
    )
);

-- Notifications RLS
create policy "Users can view their notifications" on public.notifications for
select using (
        user_id in (
            select id
            from public.profiles
            where
                user_id = auth.uid ()
        )
    );

create policy "Users can update (mark read) their notifications" on public.notifications for
update using (
    user_id in (
        select id
        from public.profiles
        where
            user_id = auth.uid ()
    )
);

-- Triggers for Notifications
-- 1. New Message trigger
create or replace function public.handle_new_message_notification()
returns trigger as $$
declare
    conv record;
    recipient_id uuid;
    recipient_role public.user_role;
    link text;
begin
    select shop_id, supplier_id into conv from public.conversations where id = new.conversation_id;
    if new.sender_id = conv.shop_id then
        recipient_id := conv.supplier_id;
    else
        recipient_id := conv.shop_id;
    end if;

    select role into recipient_role from public.profiles where id = recipient_id;
    
    if recipient_role = 'supplier' then
        link := '/supplier/dashboard/messages?conversation=' || new.conversation_id;
    else
        link := '/shop/messages?conversation=' || new.conversation_id;
    end if;

    -- Update unread count by inserting an unread notification
    insert into public.notifications (user_id, type, title, body, link_url)
    values (
        recipient_id,
        'new_message',
        'New Message',
        'You have a new message: ' || substring(new.content from 1 for 40) || '...',
        link
    );
    return new;
end;
$$ language plpgsql security definer;

create trigger on_new_message
    after insert on public.messages
    for each row
    execute function public.handle_new_message_notification();

-- 2. Order Status trigger
create or replace function public.handle_order_status_notification()
returns trigger as $$
declare
    short_id text;
begin
    -- Only trigger if status actually changed
    if old.status is distinct from new.status then
        short_id := substring(new.id::text from 1 for 8);
        -- Notify Shop
        insert into public.notifications (user_id, type, title, body, link_url)
        values (
            new.shop_id,
            'order_update',
            'Order Status Updated',
            'Your order #' || short_id || ' has been marked as ' || new.status,
            '/shop/orders'
        );
        -- Notify Supplier
        insert into public.notifications (user_id, type, title, body, link_url)
        values (
            new.supplier_id,
            'order_update',
            'Order Status Updated',
            'Order #' || short_id || ' is now ' || new.status,
            '/supplier/dashboard/orders'
        );
    end if;
    return new;
end;
$$ language plpgsql security definer;

create trigger on_order_status_change
    after update on public.orders
    for each row
    execute function public.handle_order_status_notification();

-- Auto update conversation timestamp
create trigger handle_conversations_updated_at
    before update on public.conversations
    for each row
    execute function public.handle_updated_at();

-- Update conversation updated_at when message is sent
create or replace function public.update_conversation_timestamp()
returns trigger as $$
begin
    update public.conversations set updated_at = now() where id = new.conversation_id;
    return new;
end;
$$ language plpgsql security definer;

create trigger on_message_sent_update_conversation
    after insert on public.messages
    for each row
    execute function public.update_conversation_timestamp();