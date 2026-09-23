function showToolNotice(toolName) {
  const toast = document.getElementById("tool-toast");
  const message = document.getElementById("tool-toast-message");
  message.textContent = `${toolName} đang được hoàn thiện. Hãy quay lại sớm nhé!`;
  toast.classList.remove("hidden");
  toast.classList.add("flex");
  window.clearTimeout(window.toolToastTimer);
  window.toolToastTimer = window.setTimeout(() => {
    toast.classList.add("hidden");
    toast.classList.remove("flex");
  }, 3500);
}

function showToolTab(tabName) {
  document.querySelectorAll("[data-tool-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.toolPanel !== tabName);
  });

  document.querySelectorAll("[data-tool-tab]").forEach((tab) => {
    const isActive = tab.dataset.toolTab === tabName;
    tab.classList.toggle("ring-2", isActive);
    tab.classList.toggle("ring-blue-500", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  const panel = document.querySelector(`[data-tool-panel="${tabName}"]`);
  if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });

  if (tabName === "ai-chat") {
    window.setTimeout(
      () => document.getElementById("ai-chat-input").focus(),
      350,
    );
  }
}

// CC AI Chat
function openAIChat() {
  showToolTab("ai-chat");
}

function closeAIChat() {
  document.getElementById("ai-chat-panel").classList.add("hidden");
}

const aiChatHistory = [];

function appendChatMessage(role, text) {
  const messages = document.getElementById("ai-chat-messages");
  messages.classList.remove("items-center", "justify-center", "text-center");
  messages.classList.add(
    "items-stretch",
    "justify-start",
    "gap-3",
    "overflow-y-auto",
  );

  const wrapper = document.createElement("div");
  wrapper.className =
    role === "user" ? "flex justify-end" : "flex justify-start";

  const bubble = document.createElement("div");
  bubble.className =
    role === "user"
      ? "max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-3 text-left text-sm text-white shadow-sm"
      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-left text-sm leading-relaxed text-black-600";
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

document
  .getElementById("ai-chat-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("ai-chat-input");
    const submitButton = event.currentTarget.querySelector(
      "button[type=submit]",
    );
    const question = input.value.trim();
    if (!question || submitButton.disabled) return;

    appendChatMessage("user", question);
    input.value = "";
    input.disabled = true;
    submitButton.disabled = true;
    submitButton.classList.add("opacity-60", "cursor-wait");
    const loadingBubble = appendChatMessage("model", "C.C AI đang suy nghĩ...");

    try {
      const response = await fetch(`${apiUrl}/tools/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: aiChatHistory,
        }),
      });
      const result = await response.json();
      loadingBubble.parentElement.remove();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Không thể nhận phản hồi từ AI.");
      }

      appendChatMessage("model", result.answer);
      aiChatHistory.push({ role: "user", text: question });
      aiChatHistory.push({ role: "model", text: result.answer });
    } catch (error) {
      loadingBubble.textContent =
        error.message || "Đã xảy ra lỗi khi kết nối AI.";
      loadingBubble.classList.remove("bg-slate-100", "text-slate-600");
      loadingBubble.classList.add("bg-red-50", "text-red-600");
    } finally {
      input.disabled = false;
      submitButton.disabled = false;
      submitButton.classList.remove("opacity-60", "cursor-wait");
      input.focus();
    }
  });

document.getElementById("mobile-menu-btn").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});
