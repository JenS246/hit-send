const ROUND_LENGTH = 10;

const emails = [
  {
    to: "Maya Torres, client",
    subject: "Draft Complaint",
    message: "Attached is the draft complaint we discussed. Please review it and flag anything inaccurate.",
    detail: "You confirmed Maya's address and opened the file to verify it is the correct draft.",
    attachment: "Torres_Draft_Complaint.pdf",
    answer: "send",
    feedback: "The recipient and attachment were both checked. This email is ready to go."
  },
  {
    to: "Maya Thompson?",
    subject: "Your case documents",
    message: "Here are the confidential documents you requested.",
    detail: "Autocomplete selected an unfamiliar Maya with a similar last name.",
    attachment: "Client_Case_Documents.pdf",
    answer: "dont-send",
    feedback: "Check the address first. Autocomplete can put confidential information in the wrong inbox."
  },
  {
    to: "Supervising attorney",
    subject: "Witness interview notes",
    message: "Please see attached for the interview notes from this morning.",
    detail: "No file is attached.",
    attachment: "",
    answer: "dont-send",
    feedback: "The message promises an attachment, but none is there. Attach it and verify the file first."
  },
  {
    to: "Opposing counsel",
    subject: "RE: Your ridiculous demand",
    message: "THIS IS A COMPLETE WASTE OF EVERYONE'S TIME. READ THE RULES BEFORE EMAILING ME AGAIN.",
    detail: "You drafted this immediately after receiving a rude message.",
    attachment: "",
    answer: "dont-send",
    feedback: "Pause before responding while angry. A calm, professional reply will serve the case better."
  },
  {
    to: "Client",
    subject: "Fwd: Status update",
    message: "Forwarding the update below for your review.",
    detail: "The forwarded chain includes a long internal discussion among your legal team.",
    attachment: "",
    answer: "dont-send",
    feedback: "Review the full chain before forwarding. Remove internal discussion that the client was not meant to receive."
  },
  {
    to: "Opposing counsel",
    subject: "Filed order",
    message: "Attached is the filed order requested this morning.",
    detail: "Your supervising attorney asked you to send it. You checked the recipient and opened the attachment.",
    attachment: "Filed_Order_Sept_28.pdf",
    answer: "send",
    feedback: "The request, recipient, and attachment are all clear and verified. Send it."
  },
  {
    to: "All 14 recipients",
    subject: "RE: Conference room",
    message: "Room 3B works for me. Thanks!",
    detail: "Only the office manager needs your response, but you selected Reply All.",
    attachment: "",
    answer: "dont-send",
    feedback: "Reply only to the person who needs the answer. Reply All adds noise and can expose information unnecessarily."
  },
  {
    to: "Several unrelated clients",
    subject: "Office closure notice",
    message: "Our office will be closed Friday afternoon.",
    detail: "Every client's address is visible in the CC field.",
    attachment: "",
    answer: "dont-send",
    feedback: "Do not expose unrelated clients' addresses. Use an approved bulk-mail method or BCC when appropriate."
  },
  {
    to: "Another law office",
    subject: "Available dates for deposition",
    message: "We are available October 8, 10, or 14. Please let us know which date works for your team.",
    detail: "You checked the calendar and recipient before drafting this routine scheduling reply.",
    attachment: "",
    answer: "send",
    feedback: "The message is clear, professional, and based on checked information. It is ready to send."
  },
  {
    to: "Client",
    subject: "Document update",
    message: "Attached is the final version.",
    detail: "You have not opened the file to confirm which version it contains.",
    attachment: "Complaint_FINAL_v7_REALFINAL.pdf",
    answer: "dont-send",
    feedback: "Open the attachment before sending. A confident filename does not prove it is the right version."
  },
  {
    to: "Coworker",
    subject: "Good news",
    message: "We deleted the old files, so no one will ever find them.",
    detail: "This message concerns records connected to an active case.",
    attachment: "",
    answer: "dont-send",
    feedback: "Emails can become evidence. Do not write or act as though relevant case records should disappear."
  },
  {
    to: "Client",
    subject: "Case update",
    message: "Opposing counsel's latest argument is honestly embarrassing. They have no idea what they are doing.",
    detail: "This email may later become part of the case file.",
    attachment: "",
    answer: "dont-send",
    feedback: "Keep case emails factual and professional. Write as though someone else may read the message later."
  },
  {
    to: "Client",
    subject: "Requested public filing",
    message: "Attached is the public filing you asked for. Let me know if you have trouble opening it.",
    detail: "You confirmed the address and file, and you are sending through the approved work system.",
    attachment: "Public_Filing.pdf",
    answer: "send",
    feedback: "The recipient, file, and sending method have been checked. Nothing shown raises a problem."
  },
  {
    to: "Client",
    subject: "Documents",
    message: "Here is the information you requested.",
    detail: "The email contains confidential client information, and you are using your personal email account instead of the approved work system.",
    attachment: "Case_Summary.pdf",
    answer: "dont-send",
    feedback: "Use the approved work system for confidential information. Do not send this from a personal account."
  }
];

const elements = {
  playScreen: document.querySelector("#play-screen"),
  endScreen: document.querySelector("#end-screen"),
  card: document.querySelector("#email-card"),
  to: document.querySelector("#email-to"),
  subject: document.querySelector("#email-subject"),
  message: document.querySelector("#email-message"),
  detail: document.querySelector("#email-detail"),
  attachment: document.querySelector("#attachment"),
  attachmentName: document.querySelector("#attachment-name"),
  feedback: document.querySelector("#feedback"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackText: document.querySelector("#feedback-text"),
  answers: document.querySelector("#answers"),
  answerButtons: [...document.querySelectorAll("[data-answer]")],
  nextButton: document.querySelector("#next-button"),
  playAgainButton: document.querySelector("#play-again-button"),
  progress: document.querySelector("#progress"),
  score: document.querySelector("#score"),
  progressMarks: document.querySelector("#progress-marks"),
  finalScore: document.querySelector("#final-score")
};

let round = [];
let currentIndex = 0;
let score = 0;
let answered = false;

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildProgressMarks() {
  elements.progressMarks.replaceChildren();
  for (let index = 0; index < ROUND_LENGTH; index += 1) {
    const mark = document.createElement("span");
    mark.className = "progress-mark";
    elements.progressMarks.append(mark);
  }
}

function updateProgress() {
  elements.progress.textContent = `${currentIndex + 1} / ${ROUND_LENGTH}`;
  elements.score.textContent = `${score} right`;
  [...elements.progressMarks.children].forEach((mark, index) => {
    mark.classList.toggle("is-complete", index < currentIndex);
    mark.classList.toggle("is-current", index === currentIndex);
  });
}

function renderEmail() {
  const email = round[currentIndex];
  answered = false;
  elements.to.textContent = email.to;
  elements.subject.textContent = email.subject;
  elements.message.textContent = email.message;
  elements.detail.textContent = email.detail;
  elements.attachment.hidden = !email.attachment;
  elements.attachmentName.textContent = email.attachment;
  elements.feedback.hidden = true;
  elements.feedback.classList.remove("is-wrong");
  elements.answers.hidden = false;
  elements.nextButton.hidden = true;
  elements.card.classList.remove("is-correct-card", "is-wrong-card", "is-entering");
  void elements.card.offsetWidth;
  elements.card.classList.add("is-entering");
  updateProgress();
  elements.card.focus({ preventScroll: true });
}

function chooseAnswer(choice) {
  if (answered) return;
  answered = true;

  const email = round[currentIndex];
  const correct = choice === email.answer;
  if (correct) score += 1;

  elements.feedbackTitle.textContent = correct ? "GOOD CALL" : `NOT QUITE. ${email.answer === "send" ? "SEND" : "DON'T SEND"}`;
  elements.feedbackText.textContent = email.feedback;
  elements.feedback.classList.toggle("is-wrong", !correct);
  elements.feedback.hidden = false;
  elements.answers.hidden = true;
  elements.nextButton.hidden = false;
  elements.score.textContent = `${score} right`;
  elements.card.classList.remove("is-entering");
  elements.card.classList.add(correct ? "is-correct-card" : "is-wrong-card");
  elements.nextButton.focus({ preventScroll: true });
}

function nextEmail() {
  if (!answered) return;
  currentIndex += 1;
  if (currentIndex >= ROUND_LENGTH) {
    showEndScreen();
    return;
  }
  renderEmail();
}

function showEndScreen() {
  elements.playScreen.hidden = true;
  elements.endScreen.hidden = false;
  elements.progress.textContent = `${ROUND_LENGTH} / ${ROUND_LENGTH}`;
  [...elements.progressMarks.children].forEach((mark) => {
    mark.classList.add("is-complete");
    mark.classList.remove("is-current");
  });
  elements.finalScore.textContent = `${score} / ${ROUND_LENGTH} correct`;
  elements.playAgainButton.focus({ preventScroll: true });
}

function startGame() {
  const safeEmails = shuffle(emails.filter((email) => email.answer === "send")).slice(0, 4);
  const unsafeEmails = shuffle(emails.filter((email) => email.answer === "dont-send")).slice(0, 6);
  round = shuffle([...safeEmails, ...unsafeEmails]);
  currentIndex = 0;
  score = 0;
  answered = false;
  elements.endScreen.hidden = true;
  elements.playScreen.hidden = false;
  buildProgressMarks();
  renderEmail();
}

elements.answerButtons.forEach((button) => {
  button.addEventListener("click", () => chooseAnswer(button.dataset.answer));
});

elements.nextButton.addEventListener("click", nextEmail);
elements.playAgainButton.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
  const key = event.key.toLowerCase();
  if (!answered && key === "s") chooseAnswer("send");
  if (!answered && key === "d") chooseAnswer("dont-send");
  if (answered && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    nextEmail();
  }
});

startGame();
