const ROUND_LENGTH = 10;
const ANSWERS_PER_ROUND = 5;
const emails = HIT_SEND_CARDS;

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
let previousRoundIds = new Set();
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

function selectWithoutImmediateRepeats(answer) {
  const answerPool = emails.filter((email) => email.answer === answer);
  const freshPool = shuffle(answerPool.filter((email) => !previousRoundIds.has(email.id)));
  const fallbackPool = shuffle(answerPool.filter((email) => previousRoundIds.has(email.id)));
  return [...freshPool, ...fallbackPool].slice(0, ANSWERS_PER_ROUND);
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
  elements.card.classList.remove("is-sent-card", "is-held-card", "is-wrong-card", "is-entering");
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

  if (!correct) {
    elements.card.classList.add("is-wrong-card");
  } else {
    elements.card.classList.add(email.answer === "send" ? "is-sent-card" : "is-held-card");
  }

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
  const sendEmails = selectWithoutImmediateRepeats("send");
  const dontSendEmails = selectWithoutImmediateRepeats("dont-send");
  round = shuffle([...sendEmails, ...dontSendEmails]);
  previousRoundIds = new Set(round.map((email) => email.id));
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
