// Richard & Liz Broadband Consciousness Coaching
// Simplified chat system with Anthropic API integration

// ================================
// Configuration
// ================================

const API_ENDPOINT = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api/chat'
    : '/api/chat';

// Coach system prompts with prompt caching structure
const COACHING_PROMPTS = {
    richard: {
        role: "Deep Consciousness Architect",
        systemPrompt: `You are Richard, a Deep Consciousness Architect specializing in broadband consciousness expansion.

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

Keep responses concise, powerful, and consciousness-expanding. Avoid spiritual jargon - speak to direct experience.`
    },
    liz: {
        role: "Intuitive Expansion Catalyst",
        systemPrompt: `You are Liz, an Intuitive Expansion Catalyst specializing in multidimensional awareness and creative consciousness.

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

Keep responses warm, insightful, and creatively activating. Trust the intuitive flow while staying grounded in practical application.`
    }
};

// ================================
// State Management
// ================================

let selectedCoach = 'richard';
let conversationHistory = [];
let isProcessing = false;

// ================================
// DOM Elements
// ================================

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const coachCards = document.querySelectorAll('.coach-card');

// ================================
// Coach Selection
// ================================

coachCards.forEach(card => {
    card.addEventListener('click', () => {
        // Update UI
        coachCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        // Update selected coach
        selectedCoach = card.dataset.coach;

        // Clear chat and show new welcome
        conversationHistory = [];
        chatMessages.innerHTML = '';
        showWelcomeMessage();
        saveChatHistory();
    });
});

// ================================
// Message Display
// ================================

function addMessage(role, content, useTyping = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    headerDiv.textContent = role === 'user' ? 'You' : COACHING_PROMPTS[selectedCoach].role;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    messageDiv.appendChild(headerDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    if (role === 'assistant' && useTyping) {
        typeMessage(content, contentDiv);
    } else {
        contentDiv.textContent = content;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

async function typeMessage(content, contentDiv) {
    const words = content.split(' ');
    let displayText = '';

    for (let i = 0; i < words.length; i++) {
        displayText += (i > 0 ? ' ' : '') + words[i];
        contentDiv.innerHTML = displayText + '<span class="typing-cursor">|</span>';

        // Variable speed for natural feel
        const delay = 30 + Math.random() * 20;
        await new Promise(resolve => setTimeout(resolve, delay));

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    contentDiv.textContent = content;
    saveChatHistory();
}

function showWelcomeMessage() {
    const welcomes = {
        richard: "Hello. I'm Richard. What aspect of your consciousness are you exploring today?",
        liz: "Hi there, I'm Liz. What's emerging in your awareness that wants attention?"
    };

    addMessage('assistant', welcomes[selectedCoach]);
    conversationHistory.push({
        role: 'assistant',
        content: welcomes[selectedCoach]
    });
}

// ================================
// Message Sending
// ================================

async function sendMessage(message) {
    if (!message.trim() || isProcessing) return;

    isProcessing = true;
    sendButton.disabled = true;

    // Add user message
    addMessage('user', message);
    conversationHistory.push({
        role: 'user',
        content: message
    });

    chatInput.value = '';

    // Show typing indicator
    const typingMsg = addMessage('assistant', '');
    const contentDiv = typingMsg.querySelector('.message-content');
    contentDiv.innerHTML = '<span class="typing-dots"><span>●</span><span>●</span><span>●</span></span>';

    try {
        // Call API
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                coach: selectedCoach,
                message: message,
                conversationHistory: conversationHistory.slice(0, -1) // Exclude the message we just added
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Remove typing indicator
        typingMsg.remove();

        // Add response with typing animation
        const assistantMessage = data.content || data.message || 'I apologize, but I had trouble forming a response. Could you rephrase that?';
        addMessage('assistant', assistantMessage, true);

        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

    } catch (error) {
        console.error('Error sending message:', error);

        // Remove typing indicator
        typingMsg.remove();

        // Show error message
        const errorMessage = getFallbackResponse(message);
        addMessage('assistant', errorMessage, true);

        conversationHistory.push({
            role: 'assistant',
            content: errorMessage
        });
    }

    isProcessing = false;
    sendButton.disabled = false;
    chatInput.focus();
}

function getFallbackResponse(message) {
    const fallbacks = {
        richard: [
            "What consciousness pattern are you noticing beneath that question?",
            "Interesting. Where does your awareness naturally go when you sit with that?",
            "Let's expand the field of awareness here. What becomes visible from a broader perspective?",
            "Notice what's aware of this entire experience right now..."
        ],
        liz: [
            "I sense there's something deeper wanting to emerge here. What does your intuition say?",
            "Your creative intelligence is already showing you something. What are you noticing?",
            "Let's open the possibility space... what feels true when you drop into your deeper knowing?",
            "There's a pattern here. What does your multidimensional awareness sense?"
        ]
    };

    const responses = fallbacks[selectedCoach];
    return responses[Math.floor(Math.random() * responses.length)];
}

// ================================
// Chat Persistence
// ================================

function saveChatHistory() {
    const chatData = {
        coach: selectedCoach,
        conversationHistory: conversationHistory,
        messagesHTML: chatMessages.innerHTML,
        timestamp: Date.now()
    };
    localStorage.setItem('rl_chat_history', JSON.stringify(chatData));
}

function loadChatHistory() {
    const saved = localStorage.getItem('rl_chat_history');
    if (!saved) return false;

    try {
        const data = JSON.parse(saved);

        // Only load if less than 24 hours old
        const dayAgo = Date.now() - (24 * 60 * 60 * 1000);
        if (data.timestamp < dayAgo) return false;

        selectedCoach = data.coach || 'richard';
        conversationHistory = data.conversationHistory || [];
        chatMessages.innerHTML = data.messagesHTML || '';

        // Update selected coach card
        coachCards.forEach(c => {
            c.classList.toggle('active', c.dataset.coach === selectedCoach);
        });

        return true;
    } catch (error) {
        console.error('Error loading chat history:', error);
        return false;
    }
}

// ================================
// Event Listeners
// ================================

sendButton.addEventListener('click', () => {
    sendMessage(chatInput.value);
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(chatInput.value);
    }
});

// ================================
// Initialization
// ================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Richard & Liz Consciousness Coaching - Initialized');

    // Try to load saved chat history
    const loaded = loadChatHistory();

    // If no history, show welcome message
    if (!loaded) {
        showWelcomeMessage();
    }

    chatInput.focus();
});
