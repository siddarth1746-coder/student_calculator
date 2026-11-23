/* ==========================================================================
   STUDENT MARKS CALCULATOR - JAVASCRIPT
   First-Year College Practical Project
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. THEME SWITCHER FUNCTIONALITY (Light & Dark Theme)
// --------------------------------------------------------------------------

// DOM Elements for theme toggle
const themeToggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Function to apply a selected theme ('light' or 'dark')
function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    // Show sun icon in dark mode so the user can switch back to light mode
    themeIcon.src = "assets/icons/sun.svg";
    themeIcon.alt = "";
  } else {
    document.documentElement.removeAttribute("data-theme");
    // Show moon icon in light mode so the user can switch to dark mode
    themeIcon.src = "assets/icons/moon.svg";
    themeIcon.alt = "";
  }
}

// Check saved theme in localStorage on page load
const savedTheme = localStorage.getItem("student_calc_theme") || "light";
applyTheme(savedTheme);

// Toggle theme on button click
themeToggleBtn.addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  applyTheme(newTheme);
  localStorage.setItem("student_calc_theme", newTheme);
});


// --------------------------------------------------------------------------
// 2. DOM ELEMENT REFERENCES FOR CALCULATOR
// --------------------------------------------------------------------------

// Input Fields
const studentNameInput = document.getElementById("studentName");
const englishInput = document.getElementById("english");
const mathInput = document.getElementById("math");
const physicsInput = document.getElementById("physics");
const chemistryInput = document.getElementById("chemistry");
const computerScienceInput = document.getElementById("computerScience");

// Action Buttons
const calculateBtn = document.getElementById("calculateBtn");
const resetBtn = document.getElementById("resetBtn");

// Error Message Box
const errorMessage = document.getElementById("errorMessage");

// Result Section Elements
const resultSection = document.getElementById("resultSection");
const resStudentName = document.getElementById("resStudentName");
const resTotalMarks = document.getElementById("resTotalMarks");
const resPercentage = document.getElementById("resPercentage");
const resAverage = document.getElementById("resAverage");
const resGrade = document.getElementById("resGrade");
const resStatus = document.getElementById("resStatus");
const resPerformanceMessage = document.getElementById("resPerformanceMessage");

// Progress Bar Elements
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Subject Table Elements
const subjectTableBody = document.getElementById("subjectTableBody");
const tableTotalMarks = document.getElementById("tableTotalMarks");
const tableOverallStatus = document.getElementById("tableOverallStatus");


// --------------------------------------------------------------------------
// 3. HELPER FUNCTIONS
// --------------------------------------------------------------------------

// Function to display validation errors
function showError(message, inputElement) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  
  if (inputElement) {
    inputElement.classList.add("input-error");
    inputElement.focus();
  }
}

// Function to clear previous validation errors
function clearErrors() {
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  const allInputs = [
    studentNameInput,
    englishInput,
    mathInput,
    physicsInput,
    chemistryInput,
    computerScienceInput
  ];

  allInputs.forEach(function (input) {
    input.classList.remove("input-error");
  });
}

// Function to determine overall grade based on percentage
function calculateGrade(percentage) {
  if (percentage >= 90) {
    return "A+";
  } else if (percentage >= 80) {
    return "A";
  } else if (percentage >= 70) {
    return "B";
  } else if (percentage >= 60) {
    return "C";
  } else if (percentage >= 50) {
    return "D";
  } else if (percentage >= 40) {
    return "E";
  } else {
    return "F";
  }
}

// Function to generate a brief, helpful performance message
function getPerformanceMessage(percentage, overallPassed) {
  if (!overallPassed) {
    return "Needs Improvement. Please focus on subjects where marks are below 33 to clear the examination.";
  }
  if (percentage >= 90) {
    return "Outstanding Performance! Excellent mastery of all subjects.";
  } else if (percentage >= 80) {
    return "Very Good! Consistent high marks across subjects.";
  } else if (percentage >= 70) {
    return "Good Job! Demonstrates solid understanding and steady effort.";
  } else if (percentage >= 60) {
    return "Satisfactory Result. Regular practice will help achieve higher grades.";
  } else if (percentage >= 50) {
    return "Average Performance. Extra revision recommended for core subjects.";
  } else {
    return "Passed the examination. Dedicate more study time to improve overall score.";
  }
}

// Function to format numbers cleanly (removes unnecessary trailing zeros)
function formatNumber(num) {
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}


// --------------------------------------------------------------------------
// 4. MAIN CALCULATION FUNCTION
// --------------------------------------------------------------------------

function calculateResult() {
  // Clear any existing error highlights
  clearErrors();

  // 1. Validate Student Name
  const studentName = studentNameInput.value.trim();
  if (studentName === "") {
    showError("Please enter the student's name.", studentNameInput);
    resultSection.style.display = "none";
    return;
  }

  // 2. Define subjects list for systematic checking
  const subjects = [
    { name: "English", input: englishInput },
    { name: "Mathematics", input: mathInput },
    { name: "Physics", input: physicsInput },
    { name: "Chemistry", input: chemistryInput },
    { name: "Computer Science", input: computerScienceInput }
  ];

  const subjectData = [];
  let totalMarks = 0;
  let hasFailedAnySubject = false;

  // 3. Validate each subject's marks
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    const rawValue = subject.input.value.trim();

    // Check if marks are entered
    if (rawValue === "") {
      showError("Please enter marks for " + subject.name + ".", subject.input);
      resultSection.style.display = "none";
      return;
    }

    const marks = parseFloat(rawValue);

    // Check if input is a valid number
    if (isNaN(marks)) {
      showError("Marks for " + subject.name + " must be a valid number.", subject.input);
      resultSection.style.display = "none";
      return;
    }

    // Check if marks are within valid range (0 to 100)
    if (marks < 0 || marks > 100) {
      showError("Marks for " + subject.name + " must be between 0 and 100.", subject.input);
      resultSection.style.display = "none";
      return;
    }

    // Passing criteria per subject: Minimum 33 marks
    const isSubjectPassed = marks >= 33;
    if (!isSubjectPassed) {
      hasFailedAnySubject = true;
    }

    totalMarks += marks;

    subjectData.push({
      name: subject.name,
      marks: marks,
      status: isSubjectPassed ? "PASS" : "FAIL"
    });
  }

  // 4. Calculate Percentage and Average (out of 500 total maximum marks)
  const maximumMarks = 500;
  const percentage = (totalMarks / maximumMarks) * 100;
  const averageMarks = totalMarks / subjects.length;

  // 5. Determine Overall Grade from overall percentage
  const grade = calculateGrade(percentage);

  // 6. Determine Overall Pass/Fail Status
  // If any subject has less than 33 marks, overall result is FAIL; otherwise PASS
  const overallPassed = !hasFailedAnySubject;
  const overallStatusText = overallPassed ? "PASS" : "FAIL";

  // 7. Display Summary Information in Result Section
  resStudentName.textContent = studentName;
  resTotalMarks.textContent = formatNumber(totalMarks) + " / " + maximumMarks;
  resPercentage.textContent = percentage.toFixed(2) + "%";
  resAverage.textContent = averageMarks.toFixed(2);
  resGrade.textContent = grade;
  
  resStatus.textContent = overallStatusText;
  resStatus.className = "summary-value status-badge " + (overallPassed ? "status-pass" : "status-fail");

  // Set Performance Remark Message
  resPerformanceMessage.textContent = getPerformanceMessage(percentage, overallPassed);

  // 8. Update Progress Bar
  const displayPercentage = Math.min(Math.max(percentage, 0), 100);
  progressBar.style.width = displayPercentage.toFixed(2) + "%";
  progressText.textContent = percentage.toFixed(2) + "%";

  // 9. Build Subject-Wise Table Rows
  subjectTableBody.innerHTML = "";
  subjectData.forEach(function (item) {
    const row = document.createElement("tr");

    const statusBadgeClass = item.status === "PASS" ? "status-pass" : "status-fail";

    row.innerHTML = 
      "<td>" + item.name + "</td>" +
      "<td>100</td>" +
      "<td>" + formatNumber(item.marks) + "</td>" +
      "<td><span class='status-badge " + statusBadgeClass + "'>" + item.status + "</span></td>";

    subjectTableBody.appendChild(row);
  });

  // Update Table Footer
  tableTotalMarks.innerHTML = "<strong>" + formatNumber(totalMarks) + "</strong>";
  tableOverallStatus.innerHTML = "<span class='status-badge " + (overallPassed ? "status-pass" : "status-fail") + "'>" + overallStatusText + "</span>";

  // 10. Make Result Section Visible
  resultSection.style.display = "block";

  // Smooth scroll to results
  resultSection.scrollIntoView({ behavior: "smooth" });
}


// --------------------------------------------------------------------------
// 5. RESET FUNCTIONALITY
// --------------------------------------------------------------------------

function resetCalculator() {
  // Clear all input fields
  studentNameInput.value = "";
  englishInput.value = "";
  mathInput.value = "";
  physicsInput.value = "";
  chemistryInput.value = "";
  computerScienceInput.value = "";

  // Clear errors
  clearErrors();

  // Reset Progress Bar
  progressBar.style.width = "0%";
  progressText.textContent = "0.00%";

  // Hide Result Section
  resultSection.style.display = "none";

  // Reset Result Values
  resStudentName.textContent = "-";
  resTotalMarks.textContent = "- / 500";
  resPercentage.textContent = "- %";
  resAverage.textContent = "-";
  resGrade.textContent = "-";
  resStatus.textContent = "-";
  resStatus.className = "summary-value status-badge";
  resPerformanceMessage.textContent = "-";
  subjectTableBody.innerHTML = "";

  // Set focus back to student name
  studentNameInput.focus();
}


// --------------------------------------------------------------------------
// 6. EVENT LISTENERS
// --------------------------------------------------------------------------

calculateBtn.addEventListener("click", calculateResult);
resetBtn.addEventListener("click", resetCalculator);

// Allow pressing Enter inside input fields to calculate
document.getElementById("marksForm").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    calculateResult();
  }
});
