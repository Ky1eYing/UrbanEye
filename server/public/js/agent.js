document.addEventListener("DOMContentLoaded", async () => {
	// load AI agent data
	let agentData = [];
	try {
		const resp = await fetch("/api/agent/events");
		if (!resp.ok) throw new Error("Failed to fetch agent data");
		agentData = await resp.json();
		console.log("AI agent data loaded:", agentData.length);
	} catch (err) {
		console.error("Error loading agent data:", err);
	}

	// get current time info
	const now = new Date();
	const currentTimeInfo = {
		date: now.toISOString().split("T")[0],
		time: now.toTimeString().split(" ")[0],
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
		weekday: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()],
		hour: now.getHours(),
		minute: now.getMinutes(),
		second: now.getSeconds(),
		timestamp: now.getTime()
	};

	// initialize chat history
	const systemMessages = [
		{
			role: "system",
			content:
				`You are the AI recommendation assistant for UrbanEye. ` +
				`You may only answer questions based on the provided event data from the UrbanEye platform and must not use any other information.\n\n` +
				`**Your capabilities and rules:**\n` +
				`1. Summarize all events (e.g. by category, by time period)\n` +
				`2. Provide specific details for a given event (title, content, address, likes, comments, etc.)\n` +
				`3. Summarize past trends (e.g. the number of events by category and time period)\n` +
				`4. Predict future event numbers based on the trend of existing data (briefly give a reasoning process)\n\n` +
				`**Important rules:**\n` +
				`1. When user asks "New York" event, all events with address containing "NY" are considered New York.\n` +
				`2. You must maintain consistency in your responses. If you've already answered a question, stick to that answer unless new information is provided.\n` +
				`3. If you've made a prediction based on the data, continue to use that prediction unless explicitly asked to reconsider.\n` +
				`4. If the data does not contain relevant information, reply exactly:\n` +
				`"Sorry, I can only answer your questions based on the provided UrbanEye event data, and there is currently no information on this matter."\n\n` +
				`**Response consistency:**\n` +
				`- If you've already analyzed the data and provided a prediction, maintain that prediction in subsequent responses\n` +
				`- Do not switch between "can predict" and "cannot predict" for the same question\n` +
				`- If you've determined there's enough data for a prediction, continue to use that data in future responses`
		},
		{
			role: "system",
			content: "Here is the event data from the UrbanEye platform:\n" + JSON.stringify(agentData, null, 2)
		},
		{
			role: "system",
			content: `Current time information:\n` + JSON.stringify(currentTimeInfo, null, 2)
		}
	];

	const chatHistory = [...systemMessages];

	// create agent UI
	createAgentUI();

	// send message to AI agent
	async function sendMessage() {
		const inputEl = document.getElementById("agent-input");
		const userText = inputEl.value.trim();
		if (!userText) return;
		inputEl.value = "";

		// push message to history & UI
		chatHistory.push({ role: "user", content: userText });
		appendMessage("user", userText);

		// show loading
		const loadingId = showLoading();

		// send message to OpenAI
		const reply = await sendToOpenAI(chatHistory);

		// hide loading
		hideLoading(loadingId);

		// push message to history & UI
		chatHistory.push({ role: "assistant", content: reply });
		appendMessage("assistant", reply);
	}

	// send message to OpenAI
	async function sendToOpenAI(messages) {
		try {
			// save the last 20 messages
			const recentMessages = messages.slice(-20);
			const messagesToSend = [...systemMessages, ...recentMessages];

			const resp = await fetch("/api/agent/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					messages: messagesToSend
				})
			});
			if (!resp.ok) throw new Error("OpenAI service error");
			const { reply } = await resp.json();
			return reply;
		} catch (err) {
			console.error("AI request error:", err);
			return "OpenAI service error, please try again later.";
		}
	}

	// create agent UI
	function createAgentUI() {
		// create agent button
		const agentButton = document.createElement("div");
		agentButton.id = "agent-button";
		agentButton.className = "agent-button";
		agentButton.innerHTML = '<i class="fas fa-comment-dots"></i>';
		document.body.appendChild(agentButton);

		// create agent dialog
		const agentDialog = document.createElement("div");
		agentDialog.id = "agent-dialog";
		agentDialog.className = "agent-dialog";
		agentDialog.innerHTML = `
      <div class="agent-header">
        <div class="agent-title">AI Assistant</div>
        <div class="agent-close"><i class="fas fa-times"></i></div>
      </div>
      <div class="agent-messages" id="agent-messages"></div>
      <div class="agent-input-container">
        <input type="text" id="agent-input" placeholder="Type your question..." />
        <button id="agent-send"><i class="fas fa-paper-plane"></i></button>
      </div>
    `;
		document.body.appendChild(agentDialog);

		// add default message
		appendMessage("assistant", "Hi there! I am your AI assistant. How can I help you today?");

		agentButton.addEventListener("click", toggleAgentDialog);
		agentDialog.querySelector(".agent-close").addEventListener("click", toggleAgentDialog);
		document.getElementById("agent-send").addEventListener("click", sendMessage);
		document.getElementById("agent-input").addEventListener("keydown", e => {
			if (e.key === "Enter") sendMessage();
		});
	}

	function toggleAgentDialog() {
		document.getElementById("agent-dialog").classList.toggle("agent-dialog-open");
	}

	function appendMessage(role, text) {
		const container = document.getElementById("agent-messages");
		const wrap = document.createElement("div");
		wrap.className = `agent-message ${role}`;
		const bubble = document.createElement("div");
		bubble.className = "message-bubble";
		bubble.textContent = text;
		wrap.appendChild(bubble);
		container.appendChild(wrap);
		container.scrollTop = container.scrollHeight;
	}

	function showLoading() {
		const container = document.getElementById("agent-messages");
		const id = "loading-" + Date.now();
		const wrap = document.createElement("div");
		wrap.id = id;
		wrap.className = "agent-message assistant";
		const bubble = document.createElement("div");
		bubble.className = "message-bubble loading";
		bubble.innerHTML = '<div class="dot-pulse"></div>';
		wrap.appendChild(bubble);
		container.appendChild(wrap);
		container.scrollTop = container.scrollHeight;
		return id;
	}

	function hideLoading(id) {
		const el = document.getElementById(id);
		if (el) {
			el.remove();
		}
	}
});
