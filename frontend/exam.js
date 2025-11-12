window.onload = function () {
  const studentId = localStorage.getItem("student_id");
  if (!studentId) {
    alert("❌ Verification required first!");
    window.location.href = "index.html";
    return;
  }
  document.getElementById("studentName").textContent = `Student ID: ${studentId}`;
};

document.getElementById("submitExam").addEventListener("click", () => {
  const answers = {
    q1: document.querySelector('input[name="q1"]:checked')?.value,
    q2: document.querySelector('input[name="q2"]:checked')?.value,
    q3: document.querySelector('input[name="q3"]:checked')?.value,
  };

  const correct = { q1: "Paris", q2: "Python", q3: "4" };
  let score = 0;

  for (let key in correct) {
    if (answers[key] === correct[key]) score++;
  }

  const total = Object.keys(correct).length;
  const percent = Math.round((score / total) * 100);

  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("resultBox").classList.remove("hidden");
  document.getElementById("scoreText").textContent =
    `🎯 Your Score: ${score}/${total} (${percent}%)`;
});
