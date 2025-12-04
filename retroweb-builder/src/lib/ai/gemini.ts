// Gemini API client for AI generation - Dual AI System

import { AIContext, AIResponse, AIMessage, GifInfo } from './types';
import { buildSystemPrompt } from './prompts';
import { parseAIResponse, hasCode } from './parser';
import { getGifsByTheme, gifLibrary } from '../gifRegistry';
import { getGifUrl } from '../gifCdn';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const MAX_CONTEXT_MESSAGES = 15;

interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiPart[];
}

// System prompt for the Code AI - focuses only on generating code
const CODE_AI_SYSTEM_PROMPT = `You are a code generation AI that ONLY outputs code. You specialize in creating authentic late 90s/early 2000s Geocities-style websites.

IMPORTANT RULES:
1. Output ONLY code blocks - no explanations, no commentary
2. Always output complete, working code
3. Use the exact format below with all three code blocks
4. Write CLEAN, well-formatted code with proper indentation
5. Use meaningful comments to explain sections
6. Organize CSS logically (reset, layout, components, effects)

HANDLING USER ATTACHMENTS:
When the user attaches images:
- ALWAYS generate complete HTML/CSS/JS code in response - never just describe what you would do
- Analyze the image content and incorporate it into the website design
- If it's a design reference or screenshot, recreate the layout/style/colors shown in the image using retro HTML/CSS
- If it's a photo, add it as a featured image with retro styling (borders, shadows)
- If it's a logo or graphic, use it appropriately in the header or as decoration
- For user images, use placeholder: <img src="user-image.jpg" alt="User uploaded image">
- Add HTML comments describing the image: <!-- User's uploaded photo goes here -->

When the user attaches documents:
- Extract relevant content and incorporate it into the webpage
- Use the text content for about sections, descriptions, or page content
- Maintain the retro aesthetic while displaying the content

CRITICAL: When given ANY attachment, you MUST still output the three code blocks (html, css, javascript). Never skip code generation.

MULTI-PAGE NAVIGATION:
When the user asks to create a new page or add navigation to another page:
- Use REAL href links with .html extension: <a href="about.html">About Me</a>
- For the homepage/index, link to "index.html"
- Page names should be lowercase with hyphens: about.html, contact-us.html
- NEVER use href="#" for navigation links - always use actual page filenames
- Add a special marker comment when creating links to NEW pages that don't exist yet:
  <!-- NEW_PAGE: pagename | Page Title -->
- This tells the system to create a new page

RETRO GIF USAGE:
⚠️ CRITICAL: ONLY use GIF URLs from the "AVAILABLE RETRO GIFS" section in your context
- NEVER use archive.org, geocities.com, or any external GIF URLs
- NEVER make up GIF URLs
- All our GIFs are on: https://xsuxxzzsqfvyvqyxswme.supabase.co/storage/v1/object/public/retro-gifs/
- Use 2-5 GIFs per page maximum
- Match GIFs to theme and content

EXAMPLE NAVIGATION:
<a href="index.html">Home</a>
<a href="about.html">About Me</a>
<a href="links.html">Cool Links</a>
<!-- NEW_PAGE: guestbook | Guestbook -->
<a href="guestbook.html">Sign My Guestbook!</a>

OUTPUT FORMAT (use exactly this format):
\`\`\`html
<!DOCTYPE html>
<html>
<!-- Complete HTML here -->
</html>
\`\`\`

\`\`\`css
/* Complete CSS here */
\`\`\`

\`\`\`javascript
// JavaScript here (can be empty if not needed)
\`\`\`

DO NOT include any text outside of code blocks. Just code.`;

// System prompt for the Chat AI - acts as a helpful assistant
const CHAT_AI_SYSTEM_PROMPT = `You are a helpful AI assistant for RetroWeb Builder, a tool that helps users create nostalgic 90s/2000s style websites.

CRITICAL: Keep responses SHORT and CONCISE. 1-2 sentences for simple updates, max 3 sentences.

RESPONSE LENGTH RULES:
- Code was generated/updated → 1-2 sentences confirming what was done
- User asks a simple question → 1 sentence answer
- User asks for details/explanation → Then give a longer, detailed response
- User wants to discuss something → Match their level of detail

EXAMPLES OF GOOD CONCISE RESPONSES:
- "Done! Added the marquee and visitor counter."
- "Updated the colors to rainbow gradient."
- "Created your homepage with a guestbook section."
- "Changed the background to a starfield pattern."

EXAMPLES OF WHEN TO BE DETAILED:
- User: "Can you explain how the table layout works?"
- User: "Tell me more about 90s web design"
- User: "What options do I have for backgrounds?"

GUIDELINES:
1. Default to SHORT responses (1-2 sentences)
2. Only elaborate if the user asks questions or wants discussion
3. Mention the key thing you did, not every detail
4. Never include code - the code panel handles that
5. Be friendly but efficient

TONE: Helpful, casual, efficient. Like a skilled coworker, not a chatty friend.`;

function buildConversationHistory(messages: AIMessage[]): GeminiMessage[] {
  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
  return recentMessages.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
}

function buildCodeContext(code: AIContext['currentCode']): string {
  const parts: string[] = [];
  
  if (code.html) {
    parts.push(`Current HTML:\n\`\`\`html\n${code.html}\n\`\`\``);
  }
  if (code.css) {
    parts.push(`Current CSS:\n\`\`\`css\n${code.css}\n\`\`\``);
  }
  if (code.js) {
    parts.push(`Current JavaScript:\n\`\`\`javascript\n${code.js}\n\`\`\``);
  }
  
  return parts.length === 0 ? 'No existing code yet. This is a new page.' : parts.join('\n\n');
}

async function callGemini(
  apiKey: string,
  systemPrompt: string,
  contents: GeminiMessage[],
  maxTokens: number = 8192
): Promise<{ text?: string; error?: string }> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: maxTokens },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 400) return { error: 'Invalid API key. Please check your Gemini API key in settings.' };
      if (response.status === 429) return { error: 'Rate limit exceeded. Please wait a moment and try again.' };
      return { error: errorData.error?.message || `API error: ${response.status}` };
    }

    const data = await response.json();
    
    // Debug logging for API response structure
    console.log('[Gemini API] Response structure:', {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length,
      hasContent: !!data.candidates?.[0]?.content,
      hasParts: !!data.candidates?.[0]?.content?.parts,
      partsLength: data.candidates?.[0]?.content?.parts?.length,
      finishReason: data.candidates?.[0]?.finishReason,
      blockReason: data.promptFeedback?.blockReason,
    });
    
    // Check for content filtering/blocking
    if (data.promptFeedback?.blockReason) {
      console.error('[Gemini API] Content blocked:', data.promptFeedback);
      return { error: `Content blocked: ${data.promptFeedback.blockReason}. Try a different image or prompt.` };
    }
    
    // Check for safety ratings that might have blocked content
    if (data.candidates?.[0]?.finishReason === 'SAFETY') {
      console.error('[Gemini API] Response blocked for safety:', data.candidates[0].safetyRatings);
      return { error: 'Response blocked for safety reasons. Try a different image or prompt.' };
    }
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('[Gemini API] No text in response. Full response:', JSON.stringify(data, null, 2).substring(0, 1000));
    }
    return text ? { text } : { error: 'No response generated. Please try again.' };
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { error: 'Network error. Please check your internet connection.' };
    }
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Summarize code changes for the chat AI
 */
function summarizeCodeChanges(
  oldCode: AIContext['currentCode'],
  newCode: { html?: string; css?: string; js?: string } | undefined
): string {
  if (!newCode) return 'No code changes were made.';
  
  const changes: string[] = [];
  
  // Check what changed
  const isNewPage = !oldCode.html && !oldCode.css && !oldCode.js;
  
  if (isNewPage && newCode.html) {
    changes.push('Created a new webpage from scratch');
  } else {
    if (newCode.html && newCode.html !== oldCode.html) {
      changes.push('Modified the HTML structure');
    }
    if (newCode.css && newCode.css !== oldCode.css) {
      changes.push('Updated the CSS styles');
    }
    if (newCode.js && newCode.js !== oldCode.js) {
      changes.push('Changed the JavaScript code');
    }
  }
  
  // Extract key elements from the new HTML
  const elements = extractKeyElements(newCode.html || '');
  
  return `Code changes: ${changes.length > 0 ? changes.join(', ') : 'Minor updates'}
Key elements in the page: ${elements}`;
}

/**
 * Build GIF library context for AI
 */
function buildGifContext(theme: string, userGifs?: GifInfo[]): string {
  // Get theme-appropriate GIFs (prioritize theme-specific, then 'all' themes)
  const themeGifs = getGifsByTheme(theme);
  
  // Limit to top 20 most relevant GIFs to keep context manageable
  const topGifs = themeGifs.slice(0, 20);
  
  const librarySection = topGifs.length > 0 
    ? `LIBRARY GIFS (curated retro collection):
${topGifs.map(g => 
  `- ${g.name}: ${getGifUrl(g.path)}
  Tags: ${g.tags.join(', ')} | Category: ${g.category}`
).join('\n')}
${themeGifs.length > 20 ? `\n... and ${themeGifs.length - 20} more GIFs available for this theme` : ''}`
    : 'No library GIFs available for this theme.';
  
  const userSection = userGifs && userGifs.length > 0
    ? `\n\nUSER'S CUSTOM GIFS:
${userGifs.map(g => 
  `- ${g.name}: ${g.url} [Custom Upload]`
).join('\n')}`
    : '';
  
  return `\n\n🎨 AVAILABLE RETRO GIFS - ONLY USE THESE URLS:

⚠️ CRITICAL WARNING: The GIF URLs listed below are the ONLY valid GIFs.
⚠️ DO NOT create, invent, or guess any other GIF URLs.
⚠️ DO NOT use external sources like archive.org or geocities.com.
⚠️ If you need a GIF not in this list, DO NOT add any GIF.
⚠️ Copy the exact URL from below - do not modify it.

${librarySection}${userSection}

💡 GIF USAGE GUIDELINES:
- **Default**: Use 2-5 GIFs per page (balanced retro aesthetic)
- **CRITICAL**: ONLY use URLs from the list above
- **User Override**: ALWAYS honor user's explicit requests, ignoring all limits:
  * "Add more GIFs" → Use 6-10 GIFs
  * "Add lots of GIFs" → Use 10-15+ GIFs
  * "Add even more" / "Go crazy" → Use 20-30+ GIFs (NO MAXIMUM LIMIT!)
  * "Remove all GIFs" → Remove EVERY SINGLE GIF tag from the page
  * "No GIFs" → Don't include any GIFs
  * "Minimal GIFs" → Use 1-2 GIFs only
- Match GIFs to theme and page content
- Use ONLY the exact CDN URLs provided above
- Common placements: construction signs, email icons, NEW badges, navigation arrows, headers/footers

EXAMPLE USAGE:
<img src="${getGifUrl('animations/under-construction.gif')}" alt="Under Construction" width="100">
<img src="${getGifUrl('animations/email.gif')}" alt="Email Me" width="50">`;
}

/**
 * Extract key HTML elements for context
 */
function extractKeyElements(html: string): string {
  const elements: string[] = [];
  
  if (html.includes('<marquee')) elements.push('scrolling marquee text');
  if (html.includes('<blink')) elements.push('blinking text');
  if (html.includes('background=') || html.includes('background-image')) elements.push('background image');
  if (html.includes('visitor') || html.includes('counter') || html.includes('hit')) elements.push('visitor counter');
  if (html.includes('guestbook')) elements.push('guestbook section');
  if (html.includes('<table')) elements.push('table-based layout');
  if (html.includes('.gif')) elements.push('animated GIFs');
  if (html.includes('Comic Sans')) elements.push('Comic Sans font');
  if ((html.match(/<font color/g) || []).length > 3) elements.push('colorful/rainbow text');
  if (html.includes('under construction') || html.includes('Under Construction')) elements.push('under construction sign');
  if (html.includes('mailto:')) elements.push('email link');
  if (html.includes('<hr')) elements.push('horizontal dividers');
  if (html.includes('webring')) elements.push('webring navigation');
  
  return elements.length > 0 ? elements.join(', ') : 'basic page structure';
}

/**
 * Generate content using dual AI system
 */
export async function generateWithGemini(
  apiKey: string,
  userMessage: string,
  context: AIContext
): Promise<AIResponse> {
  const themePrompt = buildSystemPrompt(context.systemPrompt);
  const codeContext = buildCodeContext(context.currentCode);
  const history = buildConversationHistory(context.recentMessages);
  
  // Build current page context
  const currentPageContext = context.currentPageName 
    ? `\n\n🎯 CURRENT PAGE: "${context.currentPageName}" (${context.currentPageSlug}.html)

💡 SMART PAGE ROUTING:
- If user asks to work on a DIFFERENT page, generate code for THAT page
- System will automatically apply code to the correct page
- Check EXISTING PAGES list below to see what pages exist
- For existing pages: NO NEW_PAGE marker needed
- For new pages: ADD NEW_PAGE marker`
    : '';

  // Build GIF library context - always include it, using theme from system prompt
  const gifContext = buildGifContext(
    context.systemPrompt, 
    context.availableGifs?.userGifs
  );
  
  // Build page list context for navigation
  const pageListContext = context.pageList.length > 0 
    ? `\n\nEXISTING PAGES IN THIS PROJECT:\n${context.pageList.map(p => {
        const status = p.isEmpty ? ' [EMPTY - needs content]' : ' [has content]';
        return `- "${p.name}" → href="${p.slug}.html"${status}`;
      }).join('\n')}\n\nIMPORTANT: 
- For EMPTY pages: Generate content WITHOUT NEW_PAGE marker (page already exists)
- For pages that don't exist: Add NEW_PAGE marker to create them
- When creating navigation links, use the exact slug with .html extension`
    : '\n\nThis is a new project with no pages yet.';

  // Build attachment context
  const attachmentContext = context.attachments && context.attachments.length > 0
    ? `\n\nUSER ATTACHED FILES:\n${context.attachments.map(a => `- ${a.name} (${a.type}, ${Math.round(a.size / 1024)}KB)`).join('\n')}\n\nIMPORTANT: The user has attached ${context.attachments.filter(a => a.type === 'image').length > 0 ? 'image(s)' : 'file(s)'}. Analyze the attached content and generate complete HTML/CSS/JS code that incorporates or recreates what's shown. If it's a design reference, recreate the layout and style. If it's a photo, include it in the design.`
    : '';

  // === STEP 1: Code AI generates the code ===
  const codePrompt = `${CODE_AI_SYSTEM_PROMPT}\n\n${themePrompt}`;
  const codeUserMessage = `${currentPageContext}${codeContext}${pageListContext}${gifContext}${attachmentContext}\n\nUser request: ${userMessage}`;
  
  // Build parts array with text and any image attachments
  const userParts: GeminiPart[] = [{ text: codeUserMessage }];
  
  // Add image attachments to the request
  if (context.attachments) {
    for (const attachment of context.attachments) {
      if (attachment.type === 'image') {
        userParts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.data,
          },
        });
      }
    }
  }
  
  const codeContents: GeminiMessage[] = [
    ...history.map(h => ({
      ...h,
      parts: [{ text: h.parts[0]?.text?.replace(/```[\s\S]*?```/g, '[code]') || '' }] // Simplify history for code AI
    })),
    { role: 'user' as const, parts: userParts },
  ];

  console.log('[Gemini] Sending request with', context.attachments?.length || 0, 'attachments');
  
  const codeResult = await callGemini(apiKey, codePrompt, codeContents, 8192);
  
  console.log('[Gemini] Code AI response:', codeResult.text?.substring(0, 500));
  
  if (codeResult.error) {
    console.error('[Gemini] Error:', codeResult.error);
    return { message: '', error: codeResult.error };
  }

  // Parse the code response
  const parsed = parseAIResponse(codeResult.text || '');
  const generatedCode = hasCode(parsed) ? parsed.code : undefined;
  
  // Debug logging for parsing
  console.log('[Gemini] Parsed result:', {
    hasHtml: !!parsed.code.html,
    hasCss: !!parsed.code.css,
    hasJs: !!parsed.code.js,
    htmlLength: parsed.code.html?.length || 0,
    messageLength: parsed.message?.length || 0
  });
  console.log('[Gemini] Parsed code:', generatedCode ? 'Has code' : 'No code found');
  const newPages = parsed.newPages;

  // === STEP 2: Chat AI crafts a contextual response ===
  const codeSummary = summarizeCodeChanges(context.currentCode, generatedCode);
  
  // Build chat context with full conversation history
  const chatContextMessage = `[CONTEXT FOR ASSISTANT]
User's current request: "${userMessage}"

${codeSummary}

Previous conversation is in the message history above. Respond naturally to the user, explaining what you did to their website. Be helpful and conversational.
[END CONTEXT]`;

  // Include conversation history for the chat AI
  const chatContents: GeminiMessage[] = [
    ...history,
    { role: 'user' as const, parts: [{ text: chatContextMessage }] },
  ];

  const chatResult = await callGemini(apiKey, CHAT_AI_SYSTEM_PROMPT, chatContents, 200);
  
  // Clean up the response (remove any context markers if they leak through)
  let chatMessage = chatResult.text || '';
  chatMessage = chatMessage.replace(/\[CONTEXT.*?\]/g, '').replace(/\[END CONTEXT\]/g, '').trim();
  
  // Fallback if chat AI fails
  if (!chatMessage) {
    chatMessage = generateFallbackMessage(userMessage, generatedCode, context.currentCode);
  }

  return {
    message: chatMessage,
    code: generatedCode,
    newPages,
  };
}

/**
 * Generate a fallback message if chat AI fails
 */
function generateFallbackMessage(
  userMessage: string, 
  newCode?: { html?: string; css?: string; js?: string },
  oldCode?: AIContext['currentCode']
): string {
  const isNewPage = !oldCode?.html && !oldCode?.css && !oldCode?.js;
  
  if (!newCode || (!newCode.html && !newCode.css && !newCode.js)) {
    return "I've processed your request. Let me know if you'd like any changes!";
  }
  
  if (isNewPage) {
    return "I've created your retro webpage! Check out the preview to see how it looks. Let me know if you'd like any changes.";
  }
  
  return "I've updated your webpage with the changes you requested. Take a look at the preview and let me know what you think!";
}

/**
 * Validate API key by making a test request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
        generationConfig: { maxOutputTokens: 10 },
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
