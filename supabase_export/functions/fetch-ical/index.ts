import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import ICAL from "https://esm.sh/ical.js@1.5.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { url } = await req.json()

        if (!url) {
            return new Response(JSON.stringify({ error: 'URL is required' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        console.log("Fetching iCal from:", url);
        const icalResponse = await fetch(url);
        if (!icalResponse.ok) {
            throw new Error(`Failed to fetch iCal: ${icalResponse.statusText}`);
        }

        const icalData = await icalResponse.text();
        const jcalData = ICAL.parse(icalData);
        const comp = new ICAL.Component(jcalData);
        const type = "vevent"; // We only care about events
        const vevents = comp.getAllSubcomponents(type);

        const events = vevents.map((vevent: any) => {
            const event = new ICAL.Event(vevent);

            // Handle Duration vs End Date
            let endDate = event.endDate;
            if (!endDate && event.duration) {
                endDate = event.startDate.clone();
                endDate.addDuration(event.duration);
            }

            return {
                title: event.summary || 'Réservation',
                start: event.startDate.toJSDate().toISOString(),
                end: endDate ? endDate.toJSDate().toISOString() : event.startDate.toJSDate().toISOString(),
                description: event.description || '',
                uid: event.uid,
                location: event.location || ''
            };
        });

        console.log(`Parsed ${events.length} events from ${url}`);

        return new Response(JSON.stringify({ events }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    } catch (error: any) {
        console.error("Error processing iCal:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
