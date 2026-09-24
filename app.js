(function () {
  "use strict";

  const STORAGE_KEY = "ae-interview-lab-v1";

  const panelInfo = {
    leader: { name: "Sales Leader", focus: "Ownership, judgment, and results", initials: "SL", avatar: "avatar-leader" },
    ae: { name: "Account Executive", focus: "Discovery, influence, and execution", initials: "AE", avatar: "avatar-ae" },
    partner: { name: "Cross-functional Partner", focus: "Collaboration, trust, and communication", initials: "XP", avatar: "avatar-partner" }
  };

  const modeInfo = {
    guided: { label: "Guided practice", count: 3, prep: 0, answer: 0, coach: true },
    panel: { label: "Mock panel", count: 6, prep: 30, answer: 120, coach: false },
    pressure: { label: "Pressure round", count: 5, prep: 15, answer: 90, coach: false }
  };

  const questions = [
    { id: "q1", panel: "leader", competency: "Ownership", focus: "ownership", text: "Tell me about a time you took ownership of a problem that was outside your formal responsibilities.", followups: ["What would have happened if you had not stepped in?", "Which part of that outcome can be attributed specifically to your actions?"] },
    { id: "q2", panel: "leader", competency: "Accountability", focus: "resilience", text: "Describe a time you missed a goal or expectation. What did you do after you realized you were off track?", followups: ["When did you communicate the risk to others?", "What changed in your process afterward?"] },
    { id: "q3", panel: "leader", competency: "Prioritization", focus: "priorities", text: "Tell me about a time several important priorities competed for your attention. How did you decide what to do first?", followups: ["What did you consciously choose not to do?", "How did your choices affect the business result?"] },
    { id: "q4", panel: "leader", competency: "Growth mindset", focus: "learning", text: "Tell me about feedback that was difficult to hear but ultimately improved your performance.", followups: ["What observable behavior did you change?", "How did you know the change was working?"] },
    { id: "q5", panel: "leader", competency: "AE readiness", focus: "ownership", text: "Give me an example of when you operated beyond the expectations of your SDR role.", followups: ["How is that behavior relevant to an AE role?", "What did you still need from others to be successful?"] },
    { id: "q6", panel: "leader", competency: "Business judgment", focus: "priorities", text: "Tell me about a time you chose not to pursue an activity or opportunity because it was not the best use of resources.", followups: ["What evidence informed that decision?", "How did you communicate your recommendation?"] },

    { id: "q7", panel: "ae", competency: "Discovery", focus: "discovery", text: "Tell me about a time you uncovered a customer need that was different from the issue first presented.", followups: ["Which question changed the direction of the conversation?", "How did you validate that the deeper need mattered?"] },
    { id: "q8", panel: "ae", competency: "Objection handling", focus: "discovery", text: "Describe a time a prospect strongly resisted your recommendation or outreach. How did you respond?", followups: ["How did you distinguish the stated objection from the underlying concern?", "What did you do when your first response did not work?"] },
    { id: "q9", panel: "ae", competency: "Qualification", focus: "discovery", text: "Tell me about a time you determined that an opportunity was not ready—or not worth pursuing.", followups: ["What evidence led you to that conclusion?", "How did you protect the relationship while being direct?"] },
    { id: "q10", panel: "ae", competency: "Adaptability", focus: "resilience", text: "Describe a customer conversation that did not go as planned. How did you adjust in the moment?", followups: ["What signal told you that your original approach was not working?", "What would you prepare differently now?"] },
    { id: "q11", panel: "ae", competency: "Value communication", focus: "discovery", text: "Tell me about a time you connected a product or capability to a meaningful customer business outcome.", followups: ["How did you know that outcome mattered to the customer?", "What business language did you use instead of product language?"] },
    { id: "q12", panel: "ae", competency: "Resilience", focus: "resilience", text: "Tell me about a prospecting or sales setback that required you to change your strategy rather than simply work harder.", followups: ["What assumption did you have to challenge?", "What evidence showed the new strategy was better?"] },

    { id: "q13", panel: "partner", competency: "Influence", focus: "influence", text: "Tell me about a time you influenced an outcome without having formal authority.", followups: ["Why did the other person choose to support your recommendation?", "What resistance did you have to overcome?"] },
    { id: "q14", panel: "partner", competency: "Collaboration", focus: "collaboration", text: "Describe a time you partnered with an AE or another team to improve a customer or business outcome.", followups: ["What did you contribute that the other person could not?", "How did you handle differences in priorities or working styles?"] },
    { id: "q15", panel: "partner", competency: "Conflict", focus: "collaboration", text: "Tell me about a productive disagreement with a colleague. How did you protect the relationship while addressing the issue?", followups: ["What part of their perspective was valid?", "What changed because you addressed the disagreement?"] },
    { id: "q16", panel: "partner", competency: "Communication", focus: "influence", text: "Give me an example of explaining a complex issue to someone who did not share your expertise.", followups: ["How did you check for understanding?", "What did you remove or simplify—and why?"] },
    { id: "q17", panel: "partner", competency: "Trust", focus: "collaboration", text: "Tell me about a time you had to rebuild trust after a misunderstanding, mistake, or missed commitment.", followups: ["What did accountability look like in that situation?", "How did the relationship change afterward?"] },
    { id: "q18", panel: "partner", competency: "Coachability", focus: "learning", text: "Describe a time you asked for help or feedback before someone offered it.", followups: ["What made you recognize the need for input?", "How did you apply what you received?"] }
  ];

  const rubric = [
    ["Relevant, well-structured responses", 15, "Selected examples that directly answered the question and used a clear STAR+L progression."],
    ["Personal ownership and specific actions", 25, "Made individual decisions, behaviors, and contributions unmistakable instead of relying on “we.”"],
    ["AE-level judgment and behavior", 20, "Demonstrated customer judgment, prioritization, influence, and ownership expected of an AE."],
    ["Meaningful business or customer results", 20, "Connected actions to measurable or observable outcomes that mattered."],
    ["Reflection and learning", 10, "Explained what changed in future behavior and how the lesson will transfer to the AE role."],
    ["Communication and presence", 10, "Answered concisely, used confident language, and stayed composed under follow-up pressure."]
  ];

  const defaultState = {
    mode: "guided",
    focus: "all",
    name: "",
    questionIds: [],
    currentIndex: 0,
    responses: {},
    ratings: {},
    actionGate: false,
    resultGate: false,
    nextFocus: ""
  };

  function safeParse(value) {
    try { return JSON.parse(value); } catch (_) { return null; }
  }

  function loadState() {
    if (typeof window === "undefined" || !window.localStorage) return Object.assign({}, defaultState);
    const saved = safeParse(window.localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === "object" ? Object.assign({}, defaultState, saved) : Object.assign({}, defaultState);
  }

  let state = loadState();
  const audioStore = new Map();
  let mediaRecorder = null;
  let mediaStream = null;
  let audioChunks = [];
  let recordingStartedAt = 0;
  let recordingTicker = null;
  let timerId = null;
  let timerPhase = "ready";
  let timerSeconds = 0;
  let toastTimer = null;
  let hasCelebrated = false;

  function saveState() {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function shuffled(items, rng = Math.random) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(rng() * (index + 1));
      [copy[index], copy[swap]] = [copy[swap], copy[index]];
    }
    return copy;
  }

  function selectQuestions(bank, count, focus = "all", rng = Math.random) {
    let pool = focus === "all" ? bank.slice() : bank.filter((item) => item.focus === focus);
    const chosen = [];
    if (focus === "all") {
      ["leader", "ae", "partner"].forEach((panel) => {
        const panelPool = shuffled(pool.filter((item) => item.panel === panel), rng);
        if (panelPool[0]) chosen.push(panelPool[0]);
      });
    }
    pool = shuffled(bank.filter((item) => !chosen.some((selected) => selected.id === item.id) && (focus === "all" || item.focus === focus)), rng);
    chosen.push(...pool.slice(0, Math.max(0, count - chosen.length)));
    if (chosen.length < count) {
      const fallback = shuffled(bank.filter((item) => !chosen.some((selected) => selected.id === item.id)), rng);
      chosen.push(...fallback.slice(0, count - chosen.length));
    }
    return shuffled(chosen.slice(0, count), rng);
  }

  function calculateScore(ratings) {
    return Math.round(rubric.reduce((total, item, index) => {
      const rating = Number(ratings[index]);
      return total + (Number.isFinite(rating) ? (rating / 4) * item[1] : 0);
    }, 0));
  }

  function evaluateReadiness(currentState) {
    const complete = rubric.every((_, index) => Number.isFinite(Number(currentState.ratings[index])));
    const score = calculateScore(currentState.ratings);
    return {
      complete,
      score,
      scorePassed: complete && score >= 80,
      ready: complete && score >= 80 && Boolean(currentState.actionGate) && Boolean(currentState.resultGate)
    };
  }

  function rankedCompetencies(ratings, direction = "desc") {
    return rubric
      .map((item, index) => ({ name: item[0], rating: Number(ratings[index]) }))
      .filter((item) => Number.isFinite(item.rating))
      .sort((a, b) => direction === "desc" ? b.rating - a.rating : a.rating - b.rating);
  }

  function evaluatorFeedback(currentState) {
    const result = evaluateReadiness(currentState);
    if (!result.complete) {
      return "Complete the evidence review and I’ll help you identify what the panel is likely to remember.";
    }
    const strongest = rankedCompetencies(currentState.ratings, "desc").slice(0, 2).map((item) => item.name).join(" and ");
    const growth = rankedCompetencies(currentState.ratings, "asc")[0]?.name || "your evidence";
    if (result.ready) {
      return `You did it! Your strongest demonstrated skills were ${strongest}. You gave the panel credible evidence of AE readiness—carry that same clarity and confidence into the real interview.`;
    }
    if (result.scorePassed) {
      return "Your overall performance is strong. Make your personal actions and measurable results unmistakable so the panel never has to infer your contribution.";
    }
    return `You have useful experience to work with. Your next opportunity is to strengthen ${growth} with one specific action, outcome, and lesson.`;
  }

  function launchConfetti() {
    if (typeof document === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = document.getElementById("confettiLayer");
    if (!layer) return;
    layer.innerHTML = "";
    const colors = ["#0063a3", "#003054", "#fbad26", "#20a36d", "#f36f56", "#7e57c2"];
    for (let index = 0; index < 84; index += 1) {
      const piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty("--duration", `${2.8 + Math.random() * 2.2}s`);
      piece.style.setProperty("--delay", `${Math.random() * .75}s`);
      piece.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
      piece.style.setProperty("--spin", `${360 + Math.random() * 900}deg`);
      piece.style.transform = `scale(${.65 + Math.random() * .75})`;
      layer.appendChild(piece);
    }
    window.setTimeout(() => { layer.innerHTML = ""; }, 6000);
  }

  function formatTime(seconds) {
    const safe = Math.max(0, Number(seconds) || 0);
    return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
  }

  function countWords(value) {
    const text = String(value || "").trim();
    return text ? text.split(/\s+/).length : 0;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }

  function currentQuestion() {
    return questions.find((item) => item.id === state.questionIds[state.currentIndex]);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2500);
  }

  function selectTab(name) {
    document.querySelectorAll("[role='tab'][data-tab]").forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".tab-panel").forEach((panel) => {
      const active = panel.id === `panel-${name}`;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (name === "debrief") renderDebrief();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectMode(mode) {
    state.mode = mode;
    document.querySelectorAll("[data-mode]").forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });
    saveState();
  }

  function startInterview() {
    state.name = document.getElementById("learnerName").value.trim();
    state.focus = document.getElementById("focusSelect").value;
    state.currentIndex = 0;
    state.responses = {};
    state.ratings = {};
    state.actionGate = false;
    state.resultGate = false;
    state.nextFocus = "";
    state.questionIds = selectQuestions(questions, modeInfo[state.mode].count, state.focus).map((item) => item.id);
    audioStore.forEach((item) => URL.revokeObjectURL(item.url));
    audioStore.clear();
    saveState();
    document.getElementById("tab-interview").disabled = false;
    document.getElementById("tab-debrief").disabled = true;
    renderQuestion();
    selectTab("interview");
  }

  function renderQuestion() {
    stopMainTimer();
    if (mediaRecorder && mediaRecorder.state === "recording") stopRecording();
    const question = currentQuestion();
    if (!question) return;
    const panel = panelInfo[question.panel];
    const response = state.responses[question.id] || {};
    const mode = modeInfo[state.mode];

    document.getElementById("candidateLabel").textContent = state.name || "Candidate";
    document.getElementById("modeLabel").textContent = mode.label;
    document.getElementById("questionProgress").textContent = `Question ${state.currentIndex + 1} of ${state.questionIds.length}`;
    document.getElementById("questionProgressBar").style.width = `${((state.currentIndex + 1) / state.questionIds.length) * 100}%`;
    document.getElementById("questionNumber").textContent = `Question ${String(state.currentIndex + 1).padStart(2,"0")}`;
    document.getElementById("questionText").textContent = question.text;
    document.getElementById("competencyChip").textContent = question.competency;
    document.getElementById("panelName").textContent = panel.name;
    document.getElementById("panelFocus").textContent = panel.focus;
    const avatar = document.getElementById("panelAvatar");
    avatar.textContent = panel.initials;
    avatar.className = `avatar ${panel.avatar}`;
    document.getElementById("responseText").value = response.text || "";
    updateWordCount();
    document.getElementById("followupBox").hidden = !response.followupShown;
    document.getElementById("followupText").textContent = response.followup || "";
    document.getElementById("previousQuestion").disabled = state.currentIndex === 0;
    document.getElementById("saveNext").innerHTML = state.currentIndex === state.questionIds.length - 1 ? "Finish interview <span aria-hidden=\"true\">→</span>" : "Save and continue <span aria-hidden=\"true\">→</span>";
    const coach = document.getElementById("coachDrawer");
    coach.open = mode.coach;

    setResponseMode(response.responseMode || "type");
    renderAudioState(question.id);
    resetMainTimer();
    document.getElementById("questionText").focus({ preventScroll: true });
  }

  function persistTypedResponse() {
    const question = currentQuestion();
    if (!question) return;
    const response = state.responses[question.id] || {};
    response.text = document.getElementById("responseText").value;
    response.responseMode = document.getElementById("audioResponseTab").classList.contains("is-active") ? "audio" : "type";
    state.responses[question.id] = response;
    saveState();
  }

  function updateWordCount() {
    document.getElementById("wordCount").textContent = `${countWords(document.getElementById("responseText").value)} words`;
  }

  function setResponseMode(mode) {
    const audio = mode === "audio";
    document.getElementById("typeResponseTab").classList.toggle("is-active", !audio);
    document.getElementById("typeResponseTab").setAttribute("aria-selected", String(!audio));
    document.getElementById("audioResponseTab").classList.toggle("is-active", audio);
    document.getElementById("audioResponseTab").setAttribute("aria-selected", String(audio));
    document.getElementById("typedResponsePanel").hidden = audio;
    document.getElementById("audioResponsePanel").hidden = !audio;
    const question = currentQuestion();
    if (question) {
      state.responses[question.id] = Object.assign({}, state.responses[question.id], { responseMode: mode });
      saveState();
    }
  }

  function revealFollowup() {
    const question = currentQuestion();
    const response = state.responses[question.id] || {};
    if (!response.followup) response.followup = question.followups[Math.floor(Math.random() * question.followups.length)];
    response.followupShown = true;
    state.responses[question.id] = response;
    document.getElementById("followupText").textContent = response.followup;
    document.getElementById("followupBox").hidden = false;
    saveState();
  }

  function responseHasEvidence(questionId) {
    const response = state.responses[questionId] || {};
    return countWords(response.text) >= 12 || audioStore.has(questionId);
  }

  function saveAndContinue() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
      showToast("Recording stopped and saved. Select continue again when it is ready.");
      return;
    }
    persistTypedResponse();
    const question = currentQuestion();
    if (!responseHasEvidence(question.id)) {
      showToast("Type at least a brief response or record an audio answer before continuing.");
      return;
    }
    if (state.currentIndex < state.questionIds.length - 1) {
      state.currentIndex += 1;
      saveState();
      renderQuestion();
      window.scrollTo({ top: 280, behavior: "smooth" });
    } else {
      document.getElementById("tab-debrief").disabled = false;
      renderDebrief();
      selectTab("debrief");
    }
  }

  function previousQuestion() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
      showToast("Recording stopped and saved before changing questions.");
      return;
    }
    persistTypedResponse();
    if (state.currentIndex > 0) {
      state.currentIndex -= 1;
      saveState();
      renderQuestion();
    }
  }

  function resetMainTimer() {
    stopMainTimer();
    const mode = modeInfo[state.mode];
    timerPhase = mode.prep > 0 ? "ready" : "untimed";
    timerSeconds = mode.prep > 0 ? mode.prep : 0;
    updateMainTimer();
  }

  function stopMainTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  function startPrepOrResponse() {
    const mode = modeInfo[state.mode];
    if (mode.prep === 0) {
      showToast("Guided practice is untimed.");
      return;
    }
    if (timerId) {
      stopMainTimer();
      updateMainTimer();
      return;
    }
    if (timerPhase === "ready") {
      timerPhase = "prep";
      timerSeconds = mode.prep;
    } else if (timerPhase === "prep-paused") {
      timerPhase = "prep";
    } else if (timerPhase === "answer-paused") {
      timerPhase = "answer";
    } else if (timerPhase === "complete") {
      timerPhase = "answer";
      timerSeconds = mode.answer;
    }
    timerId = setInterval(tickMainTimer, 1000);
    updateMainTimer();
  }

  function tickMainTimer() {
    timerSeconds -= 1;
    const mode = modeInfo[state.mode];
    if (timerSeconds <= 0 && timerPhase === "prep") {
      timerPhase = "answer";
      timerSeconds = mode.answer;
      showToast("Preparation time is over. Begin your response.");
    } else if (timerSeconds <= 0 && timerPhase === "answer") {
      timerPhase = "complete";
      timerSeconds = 0;
      stopMainTimer();
      showToast("Time. Finish your current thought and close your answer.");
    }
    updateMainTimer();
  }

  function updateMainTimer() {
    const labels = { ready: "Ready", prep: "Preparation", answer: "Response", complete: "Time", untimed: "Untimed" };
    document.getElementById("timerPhase").textContent = labels[timerPhase] || "Paused";
    document.getElementById("timerDisplay").textContent = timerPhase === "untimed" ? "—:—" : formatTime(timerSeconds);
    const button = document.getElementById("timerControl");
    if (timerPhase === "untimed") button.textContent = "No timer";
    else if (timerId) button.textContent = "Pause";
    else if (timerPhase === "ready") button.textContent = "Start prep";
    else if (timerPhase === "complete") button.textContent = "Restart response";
    else button.textContent = "Resume";
    document.getElementById("timerCard").classList.toggle("is-overtime", timerPhase === "complete");
  }

  async function startRecording() {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      showToast("Audio recording is not supported in this browser. Use the typed response instead.");
      return;
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.addEventListener("dataavailable", (event) => { if (event.data.size > 0) audioChunks.push(event.data); });
      mediaRecorder.addEventListener("stop", finalizeRecording, { once: true });
      mediaRecorder.start();
      recordingStartedAt = Date.now();
      recordingTicker = setInterval(updateRecordingTime, 250);
      document.getElementById("recordButton").classList.add("is-recording");
      document.getElementById("recordingStatus").textContent = "Recording… click to stop";
      document.getElementById("audioResult").hidden = true;
    } catch (_) {
      showToast("Microphone access was not available. You can continue with a typed response.");
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  }

  function finalizeRecording() {
    clearInterval(recordingTicker);
    const question = currentQuestion();
    const duration = Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000));
    const mimeType = mediaRecorder.mimeType || "audio/webm";
    const blob = new Blob(audioChunks, { type: mimeType });
    const existing = audioStore.get(question.id);
    if (existing) URL.revokeObjectURL(existing.url);
    const url = URL.createObjectURL(blob);
    audioStore.set(question.id, { blob, url, duration });
    if (mediaStream) mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
    mediaRecorder = null;
    renderAudioState(question.id);
    showToast("Audio response saved locally for this session.");
  }

  function updateRecordingTime() {
    const seconds = Math.floor((Date.now() - recordingStartedAt) / 1000);
    document.getElementById("recordingTime").textContent = formatTime(seconds);
  }

  function toggleRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") stopRecording();
    else startRecording();
  }

  function renderAudioState(questionId) {
    const data = audioStore.get(questionId);
    const button = document.getElementById("recordButton");
    button.classList.remove("is-recording");
    document.getElementById("recordingStatus").textContent = data ? "Recording complete" : "Ready to record";
    document.getElementById("recordingTime").textContent = data ? formatTime(data.duration) : "00:00";
    document.getElementById("audioResult").hidden = !data;
    if (data) {
      document.getElementById("audioPlayback").src = data.url;
      const download = document.getElementById("downloadAudio");
      download.href = data.url;
      download.download = `ae-interview-response-${state.currentIndex + 1}.webm`;
    } else {
      document.getElementById("audioPlayback").removeAttribute("src");
    }
  }

  function retakeRecording() {
    const question = currentQuestion();
    const existing = audioStore.get(question.id);
    if (existing) URL.revokeObjectURL(existing.url);
    audioStore.delete(question.id);
    renderAudioState(question.id);
    startRecording();
  }

  function renderRubric() {
    const list = document.getElementById("rubricList");
    list.innerHTML = rubric.map((item, index) => `
      <article class="rubric-item">
        <div class="rubric-head"><div><h3>${escapeHtml(item[0])}</h3><p>${escapeHtml(item[2])}</p></div><span class="weight-badge">${item[1]} pts</span></div>
        <div class="rating-row" role="group" aria-label="Rate ${escapeHtml(item[0])}">
          ${[0,1,2,3,4].map((rating) => `<button class="rating-button ${Number(state.ratings[index]) === rating ? "is-selected" : ""}" type="button" data-rubric="${index}" data-rating="${rating}" aria-pressed="${Number(state.ratings[index]) === rating}">${rating} · ${["Not shown","Emerging","Capable","Strong","AE-ready"][rating]}</button>`).join("")}
        </div>
      </article>`).join("");
    list.querySelectorAll("[data-rubric]").forEach((button) => button.addEventListener("click", () => {
      state.ratings[button.dataset.rubric] = Number(button.dataset.rating);
      saveState();
      renderDebrief();
    }));
  }

  function renderDebrief() {
    renderRubric();
    const answered = state.questionIds.filter((id) => responseHasEvidence(id)).length;
    const totalWords = Object.values(state.responses).reduce((total, response) => total + countWords(response.text), 0);
    document.getElementById("answeredCount").textContent = answered;
    document.getElementById("typedWordTotal").textContent = totalWords;
    document.getElementById("audioCount").textContent = audioStore.size;
    document.getElementById("actionGate").checked = state.actionGate;
    document.getElementById("resultGate").checked = state.resultGate;
    document.getElementById("nextFocus").value = state.nextFocus || "";

    const result = evaluateReadiness(state);
    document.getElementById("scoreValue").textContent = result.score;
    document.getElementById("scoreRing").style.setProperty("--score-angle", `${result.score * 3.6}deg`);
    const chip = document.getElementById("statusChip");
    chip.className = "status-chip";
    if (!result.complete) {
      chip.classList.add("status-incomplete");
      chip.textContent = "Rubric incomplete";
      document.getElementById("statusTitle").textContent = "Finish the evidence review.";
      document.getElementById("statusMessage").textContent = "Rate every competency and confirm both evidence gates.";
    } else if (result.ready) {
      chip.classList.add("status-ready");
      chip.textContent = "Interview ready";
      document.getElementById("statusTitle").textContent = "Your readiness is credible.";
      document.getElementById("statusMessage").textContent = "You met the score and demonstrated the action and results an interview panel needs to hear.";
    } else {
      chip.classList.add("status-practice");
      chip.textContent = "Rehearse again";
      document.getElementById("statusTitle").textContent = result.scorePassed ? "Close the evidence gaps." : "Strengthen the weakest proof.";
      document.getElementById("statusMessage").textContent = result.scorePassed ? "Your score meets the standard, but action and result evidence must also be clear." : "Use your lowest-rated competency to focus the next practice round.";
    }
    document.getElementById("scoreGateIcon").textContent = result.scorePassed ? "✓" : "○";
    document.getElementById("scoreGateText").textContent = result.complete ? `${result.score} points ${result.scorePassed ? "meets" : "does not meet"} the standard` : "80 points required";
    document.getElementById("actionGateIcon").textContent = state.actionGate ? "✓" : "○";
    document.getElementById("resultGateIcon").textContent = state.resultGate ? "✓" : "○";
    document.getElementById("evaluatorMessage").textContent = evaluatorFeedback(state);
    document.getElementById("evaluatorCard").classList.toggle("is-celebrating", result.ready);
    if (result.ready && !hasCelebrated) {
      hasCelebrated = true;
      window.requestAnimationFrame(launchConfetti);
    } else if (!result.ready) {
      hasCelebrated = false;
    }
  }

  function weakestCompetencies() {
    return rankedCompetencies(state.ratings, "asc")
      .slice(0,2)
      .map((item) => item.name)
      .join("; ");
  }

  function buildDebriefText() {
    const result = evaluateReadiness(state);
    return [
      "AE Interview Lab — Readiness Debrief",
      `Candidate: ${state.name || "Candidate"}`,
      `Practice mode: ${modeInfo[state.mode].label}`,
      `Readiness score: ${result.score}/100`,
      `Personal action gate: ${state.actionGate ? "Met" : "Not met"}`,
      `Meaningful results gate: ${state.resultGate ? "Met" : "Not met"}`,
      `Responses completed: ${state.questionIds.filter((id) => responseHasEvidence(id)).length}/${state.questionIds.length}`,
      `Lowest-rated evidence: ${weakestCompetencies() || "Complete the rubric"}`,
      `Next rehearsal focus: ${state.nextFocus || "Not entered"}`
    ].join("\n");
  }

  async function copyDebrief() {
    try {
      await navigator.clipboard.writeText(buildDebriefText());
      showToast("Debrief copied.");
    } catch (_) {
      showToast("Copy was blocked. Use Print / save PDF instead.");
    }
  }

  function practiceAgain() {
    selectTab("setup");
    document.getElementById("tab-interview").disabled = true;
    document.getElementById("tab-debrief").disabled = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAll() {
    if (!window.confirm("Reset all interview responses, ratings, and local recordings?")) return;
    stopMainTimer();
    if (mediaRecorder && mediaRecorder.state === "recording") stopRecording();
    audioStore.forEach((item) => URL.revokeObjectURL(item.url));
    audioStore.clear();
    state = Object.assign({}, defaultState, { questionIds: [], responses: {}, ratings: {} });
    saveState();
    document.getElementById("learnerName").value = "";
    document.getElementById("focusSelect").value = "all";
    selectMode("guided");
    practiceAgain();
    showToast("Interview practice reset.");
  }

  function bindEvents() {
    document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => selectMode(button.dataset.mode)));
    document.getElementById("learnerName").value = state.name || "";
    document.getElementById("focusSelect").value = state.focus || "all";
    document.getElementById("startInterview").addEventListener("click", startInterview);
    document.getElementById("responseText").addEventListener("input", () => { updateWordCount(); persistTypedResponse(); });
    document.getElementById("typeResponseTab").addEventListener("click", () => setResponseMode("type"));
    document.getElementById("audioResponseTab").addEventListener("click", () => setResponseMode("audio"));
    document.getElementById("followupButton").addEventListener("click", revealFollowup);
    document.getElementById("timerControl").addEventListener("click", startPrepOrResponse);
    document.getElementById("recordButton").addEventListener("click", toggleRecording);
    document.getElementById("retakeButton").addEventListener("click", retakeRecording);
    document.getElementById("previousQuestion").addEventListener("click", previousQuestion);
    document.getElementById("saveNext").addEventListener("click", saveAndContinue);
    document.getElementById("actionGate").addEventListener("change", (event) => { state.actionGate = event.target.checked; saveState(); renderDebrief(); });
    document.getElementById("resultGate").addEventListener("change", (event) => { state.resultGate = event.target.checked; saveState(); renderDebrief(); });
    document.getElementById("nextFocus").addEventListener("input", (event) => { state.nextFocus = event.target.value; saveState(); });
    document.getElementById("copyDebrief").addEventListener("click", copyDebrief);
    document.getElementById("printDebrief").addEventListener("click", () => window.print());
    document.getElementById("practiceAgain").addEventListener("click", practiceAgain);
    document.getElementById("resetButton").addEventListener("click", resetAll);
  }

  function init() {
    selectMode("guided");
    renderRubric();
    bindEvents();
  }

  if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", init);
  if (typeof module !== "undefined" && module.exports) module.exports = { questions, rubric, modeInfo, selectQuestions, calculateScore, evaluateReadiness, evaluatorFeedback, formatTime, countWords };
})();
