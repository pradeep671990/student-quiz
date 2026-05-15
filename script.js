let questions = [];
let startTime = new Date();

let totalTime = 10 * 60;
let timerInterval;

fetch('questions.json')
  .then(response => response.json())
  .then(data => {

    questions = data;

    loadQuestions();

    startTimer();
  });

function loadQuestions() {

  const quizDiv = document.getElementById('quiz');

  document.getElementById('questionCount').innerHTML =
    "Questions: " + questions.length;

  questions.forEach((q, index) => {

    let html = `
      <div class="question">
        <p><b>Q${index + 1}. ${q.question}</b></p>
    `;

    q.options.forEach(option => {

      html += `
        <label>
          <input type="radio" name="q${index}" value="${option}">
          ${option}
        </label><br>
      `;
    });

    html += `</div>`;

    quizDiv.innerHTML += html;
  });
}

function startTimer() {

  timerInterval = setInterval(() => {

    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('timer').innerHTML =
      `Time Left: ${minutes}:${seconds}`;

    totalTime--;

    if (totalTime < 0) {

      clearInterval(timerInterval);

      submitQuiz();
    }

  }, 1000);
}

function submitQuiz() {

  clearInterval(timerInterval);

  let score = 0;

  let resultHTML = "";

  const endTime = new Date();

  const timeTaken = Math.floor((endTime - startTime) / 1000);

  questions.forEach((q, index) => {

    const selected = document.querySelector(
      `input[name="q${index}"]:checked`
    );

    if (selected) {

      if (selected.value === q.answer) {

        score++;

        resultHTML += `
          <p class="correct">
          Q${index + 1}: Correct
          </p>
        `;

      } else {

        resultHTML += `
          <p class="wrong">
          Q${index + 1}: Wrong
          <br>
          Correct Answer: ${q.answer}
          </p>
        `;
      }

    } else {

      resultHTML += `
        <p class="wrong">
        Q${index + 1}: Not Attempted
        <br>
        Correct Answer: ${q.answer}
        </p>
      `;
    }

  });

  document.getElementById('result').innerHTML = `
    <h2>Your Score: ${score}/${questions.length}</h2>

    <h3>
      Time Taken:
      ${Math.floor(timeTaken / 60)}m
      ${timeTaken % 60}s
    </h3>

    ${resultHTML}
  `;
}
