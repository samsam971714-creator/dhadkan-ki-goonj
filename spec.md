# धड़कन की गूँज - Story Website

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Hindi story website: "धड़कन की गूँज" (Dhadkan Ki Goonj)
- Story display with animated scenes (airport lounge, emotional quote, final reveal)
- AI Interactive Features section:
  - Chat with story characters (Aryan or Siya) via Gemini API
  - Story remix / alternate ending generator via Gemini API
- Gemini API calls routed through backend http-outcalls (not exposed in frontend)
- Dark theme (slate-900 background, rose-500 accents)
- Hindi fonts (Hind, Poppins)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select http-outcalls component for Gemini API backend calls
2. Generate Motoko backend with:
   - `askCharacter(character: Text, userMessage: Text) -> async Text` - proxies chat to Gemini
   - `remixStory() -> async Text` - generates alternate ending via Gemini
3. Build React frontend matching the original HTML design:
   - Header with title and subtitle
   - Story scenes with fade-in animations
   - Character chat UI with Aryan/Siya selection
   - Story remix section with loading state
   - Footer
