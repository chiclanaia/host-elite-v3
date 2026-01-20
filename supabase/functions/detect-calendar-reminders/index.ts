
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // Calculate window: approx 24 hours from now
        const now = new Date();
        const targetStart = new Date(now.getTime() + (23 * 60 * 60 * 1000));
        const targetEnd = new Date(now.getTime() + (25 * 60 * 60 * 1000));

        console.log(`Checking events between ${targetStart.toISOString()} and ${targetEnd.toISOString()}`);

        // 1. Fetch upcoming events
        // Assuming properties table has owner_id
        const { data: events, error: eventError } = await supabase
            .from('calendar_events')
            .select('*, properties(owner_id)')
            .gte('start', targetStart.toISOString())
            .lte('start', targetEnd.toISOString());

        if (eventError) throw eventError;
        if (!events) return new Response(JSON.stringify({ success: true, message: "No events found" }));

        const results = [];

        // 2. Process each event
        for (const event of events) {
            const ownerId = event.properties?.owner_id;
            if (!ownerId) continue;

            // Check for existing reminder notification to avoid duplicates
            // Payload comparison in SQL might be tricky with contains, 
            // safer to check for similar title/time or use a dedicated 'payload->event_id' check if possible
            const { data: existing } = await supabase
                .from('notifications')
                .select('id')
                .eq('user_id', ownerId)
                .eq('type', 'event')
                .filter('payload->>event_id', 'eq', event.id)
                .maybeSingle();

            if (!existing) {
                // Create notification
                const { error: insertError } = await supabase
                    .from('notifications')
                    .insert({
                        user_id: ownerId,
                        title: `Rappel : ${event.title}`,
                        message: `L'événement "${event.title}" commence demain à ${new Date(event.start).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`,
                        type: 'event',
                        payload: { event_id: event.id, property_id: event.property_id }
                    });

                if (insertError) {
                    console.error(`Error inserting notification for event ${event.id}:`, insertError);
                } else {
                    results.push(`Notification sent for event ${event.id}`);
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            processed: events.length,
            actions: results
        }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (err: any) {
        console.error("Function error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
})
