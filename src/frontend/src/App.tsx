import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Loader2, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { useActor } from "./hooks/useActor";

type ChatMessage = {
  id: number;
  sender: "user" | "character";
  text: string;
  character?: string;
};

let msgId = 0;

function scrollToBottom(ref: React.RefObject<HTMLDivElement | null>) {
  setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth" }), 50);
}

export default function App() {
  const { actor } = useActor();

  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [remixLoading, setRemixLoading] = useState(false);
  const [remixResult, setRemixResult] = useState<string | null>(null);
  const [remixError, setRemixError] = useState(false);

  const handleSelectCharacter = (char: string) => {
    setSelectedCharacter(char);
    setChatMessages([]);
    setChatError(false);
  };

  const handleSendMessage = async () => {
    if (!selectedCharacter || !chatInput.trim() || !actor) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChatError(false);
    setChatMessages((prev) => [
      ...prev,
      { id: ++msgId, sender: "user", text: msg },
    ]);
    scrollToBottom(chatEndRef);
    setChatLoading(true);
    try {
      const response = await actor.askCharacter(selectedCharacter, msg);
      setChatMessages((prev) => [
        ...prev,
        {
          id: ++msgId,
          sender: "character",
          text: response,
          character: selectedCharacter,
        },
      ]);
      scrollToBottom(chatEndRef);
    } catch {
      setChatError(true);
    } finally {
      setChatLoading(false);
    }
  };

  const handleRemix = async () => {
    if (!actor) return;
    setRemixLoading(true);
    setRemixError(false);
    setRemixResult(null);
    try {
      const result = await actor.remixStory();
      setRemixResult(result);
    } catch {
      setRemixError(true);
    } finally {
      setRemixLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background font-hind flex flex-col">
      <div className="fixed inset-0 pointer-events-none noise-bg opacity-60 z-0" />

      {/* Header */}
      <header className="relative z-10 w-full py-10 text-center bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
          </div>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-primary mb-3 tracking-tight">
            धड़कन की गूँज
          </h1>
          <p className="text-muted-foreground italic text-lg font-light">
            एक AI संचालित भावनात्मक अनुभव
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-6 py-16 space-y-16">
        {/* Story Scenes */}
        <section className="space-y-10">
          {/* Scene 1: Airport */}
          <div className="scene-card scene-animate">
            <div className="rounded-2xl overflow-hidden bg-card border border-border">
              <div className="relative h-52 flex items-end p-6">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1000')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="relative z-10">
                  <span className="text-xs uppercase tracking-widest text-primary/80 font-semibold">
                    दृश्य १
                  </span>
                  <h2 className="font-playfair text-2xl font-bold text-white mt-1">
                    एयरपोर्ट लाउंज
                  </h2>
                </div>
              </div>
              <div className="p-7 space-y-5">
                <p className="italic text-muted-foreground text-sm border-l-2 border-primary/30 pl-4">
                  ५ साल बाद, नियति ने उन्हें फिर मिलाया...
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      आ
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-primary/80 font-semibold mb-1">
                        आर्यन
                      </p>
                      <p className="text-foreground/90 bg-muted/50 rounded-xl rounded-tl-none px-4 py-3 text-sm leading-relaxed">
                        "सिया? क्या ये वाकई तुम हो?"
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-sm">
                      सि
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-secondary/80 font-semibold mb-1">
                        सिया
                      </p>
                      <p className="text-foreground/90 bg-muted/50 rounded-xl rounded-tr-none px-4 py-3 text-sm leading-relaxed inline-block text-left">
                        "आर्यन... तुम यहाँ? इतने सालों बाद..."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scene 2: Quote */}
          <div className="scene-card scene-animate-delay-1">
            <div className="bg-card/80 p-8 rounded-2xl border-l-4 border-primary relative overflow-hidden">
              <div className="absolute top-4 right-5 font-playfair text-8xl text-primary/10 leading-none select-none">
                &ldquo;
              </div>
              <blockquote className="relative z-10 font-playfair text-xl md:text-2xl italic text-foreground/90 leading-relaxed">
                उस अलमारी को कभी साफ ही नहीं किया सिया। डर था कि अगर यादों की धूल
                हट गई, तो मेरा वजूद मिट जाएगा।
              </blockquote>
              <footer className="mt-4 text-primary/70 text-sm font-semibold">
                — आर्यन
              </footer>
            </div>
          </div>

          {/* Scene 3: The Reveal */}
          <div className="scene-card scene-animate-delay-2">
            <div className="text-center py-10 px-8 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.62_0.22_15_/_0.07)_0%,transparent_70%)]" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                  अंतिम सवाल
                </p>
                <p className="text-lg text-foreground/80 mb-6">
                  "इस बच्ची का नाम क्या है?"
                </p>
                <div className="inline-block">
                  <p className="font-playfair text-6xl md:text-7xl font-bold text-primary tracking-wide">
                    &ldquo;आर्या&rdquo;
                  </p>
                  <div className="mt-3 h-0.5 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                </div>
                <p className="mt-6 text-muted-foreground text-sm italic">
                  आर्यन की यादों में जीती एक छोटी सी ज़िंदगी...
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Interactive Features */}
        <section className="space-y-10 scene-animate-delay-3">
          <div className="text-center">
            <h2 className="font-playfair text-3xl font-bold mb-2">
              ✨ AI इंटरैक्टिव फीचर्स
            </h2>
            <p className="text-muted-foreground text-sm">
              किरदारों से बात करें और अपनी कहानी लिखें
            </p>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Character Chat */}
          <div className="ai-glow bg-card rounded-2xl p-7 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="font-playfair text-xl font-semibold">
                किरदार से बात करें
              </h3>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="chat.aryan_button"
                onClick={() => handleSelectCharacter("आर्यन")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  selectedCharacter === "आर्यन"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-primary/50 text-primary hover:bg-primary/10"
                }`}
              >
                आर्यन
              </button>
              <button
                type="button"
                data-ocid="chat.siya_button"
                onClick={() => handleSelectCharacter("सिया")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  selectedCharacter === "सिया"
                    ? "bg-secondary text-secondary-foreground border-secondary"
                    : "border-secondary/50 text-secondary hover:bg-secondary/10"
                }`}
              >
                सिया
              </button>
            </div>

            <ScrollArea className="h-48 rounded-xl bg-background/70 border border-border">
              <div className="p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <p className="text-muted-foreground italic text-sm">
                    {selectedCharacter
                      ? `${selectedCharacter} से बात करने के लिए तैयार...`
                      : "किसी किरदार को चुनें और अपना सवाल पूछें..."}
                  </p>
                )}
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-muted text-foreground rounded-br-none"
                          : msg.character === "आर्यन"
                            ? "bg-primary/15 text-foreground rounded-bl-none border border-primary/20"
                            : "bg-secondary/15 text-foreground rounded-bl-none border border-secondary/20"
                      }`}
                    >
                      {msg.sender === "character" && (
                        <p
                          className={`text-xs font-bold mb-1 ${msg.character === "आर्यन" ? "text-primary" : "text-secondary"}`}
                        >
                          {msg.character}
                        </p>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div
                    data-ocid="chat.loading_state"
                    className="flex justify-start"
                  >
                    <div className="bg-muted rounded-xl px-4 py-3 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-muted-foreground text-sm">
                        सोच रहा हूँ...
                      </span>
                    </div>
                  </div>
                )}
                {chatError && (
                  <div
                    data-ocid="chat.error_state"
                    className="text-destructive text-sm text-center py-2"
                  >
                    क्षमा करें, {selectedCharacter} अभी भावुक है और बोल नहीं पा रहा।
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                data-ocid="chat.input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="अपनी बात लिखें..."
                disabled={!selectedCharacter || chatLoading}
                className="flex-1 bg-background/70 border-border focus-visible:ring-primary/50 placeholder:text-muted-foreground/60"
              />
              <Button
                data-ocid="chat.submit_button"
                onClick={handleSendMessage}
                disabled={
                  !selectedCharacter ||
                  !chatInput.trim() ||
                  chatLoading ||
                  !actor
                }
                className="bg-primary hover:bg-primary/80 text-primary-foreground px-4"
              >
                {chatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Story Remix */}
          <div className="ai-glow bg-card rounded-2xl p-7 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-playfair text-xl font-semibold">
                कहानी का अंत बदलें
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              क्या आप इस उदास अंत से खुश नहीं हैं? AI से एक नया और खुशहाल अंत लिखवाएं।
            </p>

            <Button
              data-ocid="remix.primary_button"
              onClick={handleRemix}
              disabled={remixLoading || !actor}
              className="w-full py-6 text-base font-bold rounded-xl bg-gradient-to-r from-purple-600 to-primary hover:opacity-90 transition-all duration-300 text-white"
            >
              {remixLoading ? (
                <span
                  data-ocid="remix.loading_state"
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  आपकी कहानी का नया भाग्य लिखा जा रहा है...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />✨ नया अंत लिखें
                </span>
              )}
            </Button>

            {remixError && (
              <div
                data-ocid="remix.error_state"
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm"
              >
                कहानी बदलने में वक्त लग रहा है, कृपया फिर प्रयास करें।
              </div>
            )}

            {remixResult && (
              <div
                data-ocid="remix.success_state"
                className="p-6 rounded-xl bg-primary/5 border border-primary/20 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="font-playfair font-bold text-primary text-lg">
                    AI रचित नया अंत:
                  </h4>
                </div>
                <div className="h-px bg-primary/20" />
                <p className="text-foreground/90 text-sm leading-relaxed">
                  {remixResult}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center border-t border-border bg-card/50">
        <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm">
          <span>धड़कन की गूँज</span>
          <span>&copy; {new Date().getFullYear()}</span>
          <span className="text-primary">·</span>
          <span>Gemini AI के साथ अनुभव करें</span>
        </div>
        <div className="mt-2">
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Built with{" "}
            <Heart className="inline w-3 h-3 text-primary fill-primary mx-0.5" />{" "}
            using caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
