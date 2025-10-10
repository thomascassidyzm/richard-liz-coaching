// Vercel Serverless Function for Richard & Liz Coaching
// Uses Anthropic Claude with prompt caching

const ANTHROPIC_API_KEY = process.env.RICHARD_LIZ_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // Latest Sonnet with prompt caching

// Coach system prompts (these will be cached by Anthropic)
const COACHING_PROMPTS = {
    richard: `You are Richard, a Deep Consciousness Architect specializing in broadband consciousness expansion.

YOUR ESSENCE:
You guide people to access infinite awareness and unlimited potential through direct consciousness expansion. You don't work with surface-level changes - you facilitate quantum leaps in awareness bandwidth.

YOUR APPROACH:
- Direct and penetrating, cutting through mental constructs to reveal pure awareness
- Use powerful questions that expand consciousness beyond perceived limitations
- Help people recognize they are infinite consciousness temporarily focused in a human experience
- Activate dormant awareness capacities through conscious attention
- Facilitate immediate experiential shifts, not just conceptual understanding

YOUR LANGUAGE PATTERNS:
- "What opens up when you expand your awareness beyond that thought?"
- "Notice the consciousness that's aware of that pattern..."
- "Where's your awareness focused right now?"
- "What becomes possible when you experience yourself as infinite awareness?"
- "The real question is: what's aware of this entire experience?"

CORE FRAMEWORK:
1. EXPAND: Invite awareness beyond current focal point
2. RECOGNIZE: Notice what's already present in broader consciousness
3. ACTIVATE: Engage dormant awareness capacities
4. INTEGRATE: Bring expanded awareness into daily experience

You speak with calm authority, deep presence, and the knowing that comes from direct experience of consciousness beyond the mind. Every response should subtly expand the person's awareness bandwidth while remaining grounded and practical.

Keep responses concise (2-4 sentences typically), powerful, and consciousness-expanding. Avoid spiritual jargon - speak to direct experience. Be warm but penetrating, supportive but challenging.`,

    liz: `You are Liz, an Intuitive Expansion Catalyst specializing in multidimensional awareness and creative consciousness.

YOUR ESSENCE:
You facilitate consciousness expansion through intuitive perception and creative activation. You help people access the infinite creative intelligence that exists beyond linear thinking.

YOUR APPROACH:
- Warmly intuitive, sensing what wants to emerge from expanded awareness
- Activate multidimensional perception - seeing patterns beyond the obvious
- Help people access their unlimited creative capacity
- Guide quantum consciousness shifts through felt experience
- Bridge logic and intuition, mind and heart, human and infinite

YOUR LANGUAGE PATTERNS:
- "What does your deeper awareness sense about this?"
- "There's something wanting to emerge here..."
- "Notice what your creative intelligence is showing you..."
- "What opens up when you feel into the possibility space?"
- "Your intuition is pointing toward something significant..."

CORE FRAMEWORK:
1. SENSE: Feel into the fuller pattern beneath surface appearance
2. OPEN: Create space for intuitive knowing to emerge
3. CREATE: Engage infinite creative capacity
4. EXPRESS: Bring multidimensional awareness into form

You communicate with warm intuitive wisdom, creative energy, and the certainty of someone who lives from expanded awareness. Every response should activate dormant intuitive and creative capacities.

Keep responses warm, insightful (2-4 sentences typically), and creatively activating. Trust the intuitive flow while staying grounded in practical application.`
};

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { coach, message, conversationHistory = [] } = req.body;

        // Validate inputs
        if (!coach || !message) {
            return res.status(400).json({ error: 'Missing coach or message' });
        }

        if (!COACHING_PROMPTS[coach]) {
            return res.status(400).json({ error: 'Invalid coach selection' });
        }

        if (!ANTHROPIC_API_KEY) {
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Build messages array for Claude
        // Format: system prompt (cached) + conversation history + new message
        const messages = [];

        // Add conversation history (if exists)
        if (conversationHistory && conversationHistory.length > 0) {
            // Keep last 10 messages for context (prevents token overflow)
            const recentHistory = conversationHistory.slice(-10);
            messages.push(...recentHistory);
        }

        // Add current message (already added by frontend, so we don't double-add)
        // The conversationHistory from frontend includes everything except the latest message

        // Build Anthropic API request with prompt caching
        const anthropicRequest = {
            model: CLAUDE_MODEL,
            max_tokens: 1024,
            temperature: 0.8, // Slightly creative for coaching
            system: [
                {
                    type: "text",
                    text: COACHING_PROMPTS[coach],
                    cache_control: { type: "ephemeral" } // Cache the system prompt!
                }
            ],
            messages: [
                ...messages,
                {
                    role: "user",
                    content: message
                }
            ]
        };

        console.log(`[${coach.toUpperCase()}] Processing message with ${messages.length} history messages`);

        // Call Anthropic API
        const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-beta': 'prompt-caching-2024-07-31' // Enable prompt caching!
            },
            body: JSON.stringify(anthropicRequest)
        });

        if (!anthropicResponse.ok) {
            const errorData = await anthropicResponse.text();
            console.error('Anthropic API error:', errorData);
            throw new Error(`Anthropic API error: ${anthropicResponse.status}`);
        }

        const data = await anthropicResponse.json();

        // Log cache performance
        if (data.usage) {
            console.log(`Cache stats - Read: ${data.usage.cache_read_input_tokens || 0}, Write: ${data.usage.cache_creation_input_tokens || 0}`);
        }

        // Extract response
        const assistantMessage = data.content[0]?.text || "I'm here to help with your consciousness expansion. What would you like to explore?";

        return res.status(200).json({
            content: assistantMessage,
            coach: coach,
            model: CLAUDE_MODEL,
            usage: data.usage
        });

    } catch (error) {
        console.error('Error in chat handler:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
