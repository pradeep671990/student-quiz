let selectedQuestions = [];

let currentQuestion = 0;

let userAnswers = [];

let startTime;

let totalTime = 10 * 60;

let timerInterval;


/* =========================
   SHUFFLE ARRAY
========================= */

function shuffleArray(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}


/* =========================
   START QUIZ
========================= */

async function startQuiz() {

  const studentName =
    document.getElementById('studentName').value;

  if (studentName.trim() === "") {

    alert("Please enter student name");

    return;
  }

  document.getElementById('quiz').innerHTML = "";

  document.getElementById('result').innerHTML = "";

  clearInterval(timerInterval);

  const limit =
    parseInt(
      document.getElementById('questionLimit').value
    );

  const selectedCategory =
    document.getElementById('categorySelect').value;

  // 1 MINUTE PER QUESTION

  totalTime = limit * 60;

  const totalMinutes = limit;

  // WARNING MESSAGE

  const warningMessage = `

You will get:

✔ 1 minute for each question
✔ Total Time: ${totalMinutes} Minutes
✔ No negative marking

Click OK to start quiz.

`;

  const confirmStart =
    confirm(warningMessage);

  if (!confirmStart) {

    return;
  }

  startTime = new Date();

  let loadedQuestions = [];


  /* =========================
     LOAD QUESTIONS
  ========================= */

  if (selectedCategory === "all") {

    const files = [

      'computer/questions.json',

      'gk/questions.json',

      'science/questions.json',

      'maths/questions.json',

      'sports/questions.json',

      'english/questions.json'

    ];

    for (const file of files) {

      const response =
        await fetch(file);

      const data =
        await response.json();

      loadedQuestions =
        loadedQuestions.concat(data);
    }

  }

  else {

    const response =
      await fetch(selectedCategory);

    loadedQuestions =
      await response.json();
  }


  /* =========================
     RANDOMIZE QUESTIONS
  ========================= */

  let shuffledQuestions =
    shuffleArray(loadedQuestions);


  /* =========================
     LIMIT QUESTIONS
  ========================= */

  selectedQuestions =
    shuffledQuestions.slice(
      0,
      Math.min(limit, shuffledQuestions.length)
    );


  /* =========================
     RESET QUESTION TRACKING
  ========================= */

  currentQuestion = 0;

  userAnswers = [];


  /* =========================
     LOAD QUESTIONS
  ========================= */

  loadQuestions();

  startTimer();
}


/* =========================
   LOAD SINGLE QUESTION
========================= */

function loadQuestions() {

  const quizDiv =
    document.getElementById('quiz');

  quizDiv.innerHTML = "";

  document.getElementById('questionCount').innerHTML =
    `Question ${currentQuestion + 1}
     of ${selectedQuestions.length}`;

  const q =
    selectedQuestions[currentQuestion];

  let options =
    shuffleArray([...q.options]);

  let html = `

    <div class="question">

      <p>

        <b>
          Q${currentQuestion + 1}.
          ${q.question}
        </b>

      </p>

  `;

  options.forEach(option => {

    const checked =
      userAnswers[currentQuestion] === option
      ? 'checked'
      : '';

    html += `

      <label>

        <input
          type="radio"
          name="question"
          value="${option}"
          ${checked}
          onchange="saveAnswer('${option}')"
        >

        ${option}

      </label>

      <br>
    `;
  });

  html += `</div>`;

  quizDiv.innerHTML = html;

  updateProgressBar();
}


/* =========================
   SAVE ANSWER
========================= */

function saveAnswer(answer) {

  userAnswers[currentQuestion] = answer;
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

  if (
    currentQuestion <
    selectedQuestions.length - 1
  ) {

    currentQuestion++;

    loadQuestions();
  }
}


/* =========================
   PREVIOUS QUESTION
========================= */

function previousQuestion() {

  if (currentQuestion > 0) {

    currentQuestion--;

    loadQuestions();
  }
}


/* =========================
   PROGRESS BAR
========================= */

function updateProgressBar() {

  const progress =
    ((currentQuestion + 1)
    / selectedQuestions.length)
    * 100;

  const progressBar =
    document.getElementById('progressBar');

  progressBar.style.width =
    `${progress}%`;

  progressBar.innerHTML =
    `${Math.round(progress)}%`;
}


/* =========================
   TIMER
========================= */

function startTimer() {

  timerInterval = setInterval(() => {

    let minutes =
      Math.floor(totalTime / 60);

    let seconds =
      totalTime % 60;

    seconds =
      seconds < 10
      ? '0' + seconds
      : seconds;

    document.getElementById('timer').innerHTML =
      `Time Left: ${minutes}:${seconds}`;

    totalTime--;

    // AUTO SUBMIT

    if (totalTime < 0) {

      clearInterval(timerInterval);

      alert(
        "Time is over! Quiz will be submitted automatically."
      );

      submitQuiz();
    }

  }, 1000);
}


/* =========================
   SUBMIT QUIZ
========================= */

function submitQuiz() {

  clearInterval(timerInterval);

  let score = 0;

  let resultHTML = "";

  const endTime = new Date();

  const timeTaken =
    Math.floor(
      (endTime - startTime) / 1000
    );

  selectedQuestions.forEach((q, index) => {

    const selected =
      userAnswers[index];

    if (selected) {

      if (selected === q.answer) {

        score++;

        resultHTML += `
          <p class="correct">

            ✅ Q${index + 1}: Correct

          </p>
        `;

      } else {

        resultHTML += `
          <p class="wrong">

            ❌ Q${index + 1}: Wrong

            <br>

            Your Answer:
            ${selected}

            <br>

            Correct Answer:
            ${q.answer}

          </p>
        `;
      }

    } else {

      resultHTML += `
        <p class="wrong">

          ⚠️ Q${index + 1}: Not Attempted

          <br>

          Correct Answer:
          ${q.answer}

        </p>
      `;
    }

  });


  /* =========================
     PERCENTAGE
  ========================= */

  const percentage =
    ((score / selectedQuestions.length) * 100)
    .toFixed(2);


  /* =========================
     REACTIONS
  ========================= */

  let reaction = "";

  if (percentage < 55) {

    reaction =
      "😢 Fail! Keep practicing and try again.";
  }

  else if (percentage >= 55 && percentage < 75) {

    reaction =
      "🙂 Good Job! You can do even better.";
  }

  else if (percentage >= 75 && percentage < 90) {

    reaction =
      "😃 Very Good Performance!";
  }

  else if (percentage >= 90 && percentage < 100) {

    reaction =
      "🔥 Excellent Work! Outstanding Score!";
  }

  else if (percentage == 100) {

    reaction =
      "🏆 PERFECT SCORE! GENIUS!";
  }


  /* =========================
     SAVE HISTORY
  ========================= */

  const studentName =
    document.getElementById('studentName').value;

  const selectedCategory =
    document.getElementById('categorySelect').value;

  saveHistory({

    studentName: studentName,

    category: selectedCategory,

    score: score,

    total: selectedQuestions.length,

    percentage: percentage,

    timeTaken:
      `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`,

    date:
      new Date().toLocaleString()

  });


  /* =========================
     RESULT DISPLAY
  ========================= */

  document.getElementById('result').innerHTML = `

    <h2>
      Your Score:
      ${score}/${selectedQuestions.length}
    </h2>

    <h2>
      Percentage:
      ${percentage}%
    </h2>

    <h2>
      ${reaction}
    </h2>

    <h3>
      Time Taken:
      ${Math.floor(timeTaken / 60)}m
      ${timeTaken % 60}s
    </h3>

    <hr>

    ${resultHTML}
  `;
}


/* =========================
   SAVE HISTORY
========================= */

function saveHistory(data) {

  let history =
    JSON.parse(
      localStorage.getItem('quizHistory')
    ) || [];

  history.push(data);

  localStorage.setItem(
    'quizHistory',
    JSON.stringify(history)
  );

  loadHistory();
}


/* =========================
   LOAD HISTORY
========================= */

function loadHistory() {

  let history =
    JSON.parse(
      localStorage.getItem('quizHistory')
    ) || [];

  let html = "";

  history.reverse().forEach((item, index) => {

    html += `

      <div class="question">

        <p>
          <b>Attempt ${index + 1}</b>
        </p>

        <p>
          Student:
          <b>${item.studentName}</b>
        </p>

        <p>
          Category:
          ${item.category}
        </p>

        <p>
          Score:
          ${item.score}/${item.total}
        </p>

        <p>
          Percentage:
          ${item.percentage}%
        </p>

        <p>
          Time Taken:
          ${item.timeTaken}
        </p>

        <p>
          Date:
          ${item.date}
        </p>

      </div>
    `;
  });

  document.getElementById('history').innerHTML =
    html;
}


/* =========================
   LOAD HISTORY ON PAGE LOAD
========================= */

// loadHistory();
// let selectedQuestions = [];

// let startTime;

// let totalTime = 10 * 60;

// let timerInterval;

// let currentQuestion = 0;

// let userAnswers = [];


/* =========================
   SHUFFLE ARRAY
========================= */

function shuffleArray(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}


/* =========================
   START QUIZ
========================= */

async function startQuiz() {

  const studentName =
    document.getElementById('studentName').value;

  if (studentName.trim() === "") {

    alert("Please enter student name");

    return;
  }

  document.getElementById('quiz').innerHTML = "";

  document.getElementById('result').innerHTML = "";

  clearInterval(timerInterval);

  const limit =
    parseInt(
      document.getElementById('questionLimit').value
    );

  const selectedCategory =
    document.getElementById('categorySelect').value;

  totalTime = limit * 60;

  const totalMinutes = limit;

  const warningMessage = `

You will get:

✔ 1 minute for each question
✔ Total Time: ${totalMinutes} Minutes
✔ No negative marking

Click OK to start quiz.

`;

  const confirmStart =
    confirm(warningMessage);

  if (!confirmStart) {

    return;
  }

  startTime = new Date();

  let loadedQuestions = [];


  /* =========================
     LOAD QUESTIONS
  ========================= */

  if (selectedCategory === "all") {

    const files = [

      'computer/questions.json',

      'gk/questions.json',

      'science/questions.json',

      'maths/questions.json',

      'sports/questions.json',

      'english/questions.json'

    ];

    for (const file of files) {

      const response =
        await fetch(file);

      const data =
        await response.json();

      loadedQuestions =
        loadedQuestions.concat(data);
    }

  }

  else {

    const response =
      await fetch(selectedCategory);

    loadedQuestions =
      await response.json();
  }


  /* =========================
     RANDOMIZE QUESTIONS
  ========================= */

  let shuffledQuestions =
    shuffleArray(loadedQuestions);


  /* =========================
     LIMIT QUESTIONS
  ========================= */

  selectedQuestions =
    shuffledQuestions.slice(
      0,
      Math.min(limit, shuffledQuestions.length)
    );


  /* =========================
     RESET QUESTION FLOW
  ========================= */

  currentQuestion = 0;

  userAnswers = [];


  /* =========================
     LOAD QUESTIONS
  ========================= */

  loadQuestions();

  startTimer();
}


/* =========================
   LOAD QUESTIONS
========================= */

function loadQuestions() {

  const quizDiv =
    document.getElementById('quiz');

  quizDiv.innerHTML = "";

  document.getElementById('questionCount').innerHTML =
    `Question ${currentQuestion + 1}
     of ${selectedQuestions.length}`;

  const q =
    selectedQuestions[currentQuestion];

  let options =
    shuffleArray([...q.options]);

  let html = `

    <div class="question">

      <p>

        <b>
          Q${currentQuestion + 1}.
          ${q.question}
        </b>

      </p>
  `;

  options.forEach(option => {

    const checked =
      userAnswers[currentQuestion] === option
      ? 'checked'
      : '';

    html += `

      <label>

        <input
          type="radio"
          name="question"
          value="${option}"
          ${checked}
          onchange="saveAnswer('${option}')"
        >

        ${option}

      </label>

      <br>
    `;
  });

  html += `</div>`;

  quizDiv.innerHTML = html;

  updateProgressBar();
}


/* =========================
   SAVE ANSWER
========================= */

function saveAnswer(answer) {

  userAnswers[currentQuestion] =
    answer;
}


/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

  if (
    currentQuestion <
    selectedQuestions.length - 1
  ) {

    currentQuestion++;

    loadQuestions();
  }
}


/* =========================
   PREVIOUS QUESTION
========================= */

function previousQuestion() {

  if (currentQuestion > 0) {

    currentQuestion--;

    loadQuestions();
  }
}


/* =========================
   UPDATE PROGRESS BAR
========================= */

function updateProgressBar() {

  const progress =
    ((currentQuestion + 1)
    / selectedQuestions.length)
    * 100;

  const progressBar =
    document.getElementById('progressBar');

  progressBar.style.width =
    `${progress}%`;

  progressBar.innerHTML =
    `${Math.round(progress)}%`;
}


/* =========================
   TIMER
========================= */

function startTimer() {

  timerInterval = setInterval(() => {

    let minutes =
      Math.floor(totalTime / 60);

    let seconds =
      totalTime % 60;

    seconds =
      seconds < 10
      ? '0' + seconds
      : seconds;

    document.getElementById('timer').innerHTML =
      `Time Left: ${minutes}:${seconds}`;

    totalTime--;

    if (totalTime < 0) {

      clearInterval(timerInterval);

      alert(
        "Time is over! Quiz will be submitted automatically."
      );

      submitQuiz();
    }

  }, 1000);
}


/* =========================
   SUBMIT QUIZ
========================= */

function submitQuiz() {

  clearInterval(timerInterval);

  let score = 0;

  let resultHTML = "";

  const endTime = new Date();

  const timeTaken =
    Math.floor(
      (endTime - startTime) / 1000
    );

  selectedQuestions.forEach((q, index) => {

    const selected =
      userAnswers[index];

    if (selected) {

      if (selected === q.answer) {

        score++;

        resultHTML += `

          <p class="correct">

            ✅ Q${index + 1}: Correct

          </p>
        `;

      } else {

        resultHTML += `

          <p class="wrong">

            ❌ Q${index + 1}: Wrong

            <br>

            Your Answer:
            ${selected}

            <br>

            Correct Answer:
            ${q.answer}

          </p>
        `;
      }

    } else {

      resultHTML += `

        <p class="wrong">

          ⚠️ Q${index + 1}: Not Attempted

          <br>

          Correct Answer:
          ${q.answer}

        </p>
      `;
    }

  });


  /* =========================
     PERCENTAGE
  ========================= */

  const percentage =
    ((score / selectedQuestions.length) * 100)
    .toFixed(2);


  /* =========================
     REACTIONS
  ========================= */

  let reaction = "";

  if (percentage < 55) {

    reaction =
      "😢 Fail! Keep practicing and try again.";
  }

  else if (percentage >= 55 && percentage < 75) {

    reaction =
      "🙂 Good Job! You can do even better.";
  }

  else if (percentage >= 75 && percentage < 90) {

    reaction =
      "😃 Very Good Performance!";
  }

  else if (percentage >= 90 && percentage < 100) {

    reaction =
      "🔥 Excellent Work! Outstanding Score!";
  }

  else if (percentage == 100) {

    reaction =
      "🏆 PERFECT SCORE! GENIUS!";
  }


  /* =========================
     SAVE HISTORY
  ========================= */

  const studentName =
    document.getElementById('studentName').value;

  const selectedCategory =
    document.getElementById('categorySelect').value;

  saveHistory({

    studentName: studentName,

    category: selectedCategory,

    score: score,

    total: selectedQuestions.length,

    percentage: percentage,

    timeTaken:
      `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`,

    date:
      new Date().toLocaleString()

  });


  /* =========================
     RESULT DISPLAY
  ========================= */

  document.getElementById('result').innerHTML = `

    <h2>
      Your Score:
      ${score}/${selectedQuestions.length}
    </h2>

    <h2>
      Percentage:
      ${percentage}%
    </h2>

    <h2>
      ${reaction}
    </h2>

    <h3>
      Time Taken:
      ${Math.floor(timeTaken / 60)}m
      ${timeTaken % 60}s
    </h3>

    <hr>

    ${resultHTML}
  `;
}


/* =========================
   SAVE HISTORY
========================= */

function saveHistory(data) {

  let history =
    JSON.parse(
      localStorage.getItem('quizHistory')
    ) || [];

  history.push(data);

  localStorage.setItem(
    'quizHistory',
    JSON.stringify(history)
  );

  loadHistory();
}


/* =========================
   LOAD HISTORY
========================= */

function loadHistory() {

  let history =
    JSON.parse(
      localStorage.getItem('quizHistory')
    ) || [];

  let html = "";

  history.reverse().forEach((item, index) => {

    html += `

      <div class="question">

        <p>
          <b>Attempt ${index + 1}</b>
        </p>

        <p>
          Student:
          <b>${item.studentName}</b>
        </p>

        <p>
          Category:
          ${item.category}
        </p>

        <p>
          Score:
          ${item.score}/${item.total}
        </p>

        <p>
          Percentage:
          ${item.percentage}%
        </p>

        <p>
          Time Taken:
          ${item.timeTaken}
        </p>

        <p>
          Date:
          ${item.date}
        </p>

      </div>
    `;
  });

  document.getElementById('history').innerHTML =
    html;
}


/* =========================
   LOAD HISTORY ON PAGE LOAD
========================= */

loadHistory();