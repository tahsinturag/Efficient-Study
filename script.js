let startTime;
let intervalId;
let isRunning = false;
let elapsedTime = 0;
let selectedCourse = '';
let results = [];

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('laps');
const resultsContainer = document.getElementById('resultsContainer');
const selectedCourseTime = document.getElementById('selectedCourseTime');
const lapTimes = document.getElementById('lapTimes');

function updateDisplay(time) {
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  display.textContent = `${hours}:${minutes}:${seconds}`;
}

function startStop() {
  if (!isRunning) {
    startTime = Date.now() - elapsedTime * 1000;
    intervalId = setInterval(() => {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      updateDisplay(elapsedTime);
    }, 1000);
    isRunning = true;
    startStopBtn.textContent = 'Stop';
    resetBtn.disabled = true;
    lapBtn.disabled = false;
  } else {
    clearInterval(intervalId);
    isRunning = false;
    startStopBtn.textContent = 'Start';
    resetBtn.disabled = false;
    lapBtn.disabled = true;

    if (selectedCourse) {
      results.push({ course: selectedCourse, time: elapsedTime });
      updateResults();
    }
  }
}

function reset() {
  clearInterval(intervalId);
  isRunning = false;
  elapsedTime = 0;
  startStopBtn.textContent = 'Start';
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  updateDisplay(0);
  lapsContainer.innerHTML = '';
  selectedCourseTime.textContent = '';
  lapTimes.textContent = '';
}

function lap() {
  const lapTime = elapsedTime;
  const lapItem = document.createElement('div');
  lapItem.classList.add('stopwatch-lap');
  lapItem.textContent = `Lap ${lapsContainer.childElementCount + 1}: ${formatTime(lapTime)}`;
  lapsContainer.appendChild(lapItem);
  lapsContainer.scrollTop = lapsContainer.scrollHeight;

  const lapTimeItem = document.createElement('div');
  lapTimeItem.textContent = `Lap ${lapsContainer.childElementCount}: ${formatTime(lapTime)}`;
  lapTimes.appendChild(lapTimeItem);
}

function formatTime(time) {
  const hours = String(Math.floor(time / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
  const seconds = String(time % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function updateResults() {
  selectedCourseTime.textContent = `Time consumed for ${selectedCourse}: ${formatTime(elapsedTime)}`;
  lapTimes.innerHTML = results.map((result, index) => `<div>${result.course}: ${formatTime(result.time)}</div>`).join('');
}

startStopBtn.addEventListener('click', startStop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

document.addEventListener('DOMContentLoaded', () => {
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownContent = document.getElementById('dropdownContent');
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownBtn.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', (event) => {
      event.preventDefault();
      selectedCourse = event.target.textContent;
      dropdownBtn.textContent = selectedCourse;
      dropdownContent.style.display = 'none';
    });
  });

  // Close the dropdown if the user clicks outside of it
  window.addEventListener('click', (event) => {
    if (!event.target.matches('.dropbtn')) {
      if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
      }
    }
  });
});

function updateTimeDifference() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();

  let targetHour = 4;
  let targetMinute = 0;
  let targetSecond = 0;

  let differenceHours = targetHour - currentHour;
  let differenceMinutes = targetMinute - currentMinute;
  let differenceSeconds = targetSecond - currentSecond;

  if (differenceSeconds < 0) {
      differenceSeconds += 60;
      differenceMinutes--;
  }
  if (differenceMinutes < 0) {
      differenceMinutes += 60;
      differenceHours--;
  }
  if (differenceHours < 0) {
      differenceHours += 24;
  }

  const currentTimeElement = document.getElementById('current-time');
  const timeDifferenceElement = document.getElementById('time-difference');

  currentTimeElement.textContent = `Current Time: ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:${currentSecond.toString().padStart(2, '0')}`;
  timeDifferenceElement.textContent = `I've still Time: ${differenceHours} hours, ${differenceMinutes} minutes, ${differenceSeconds} seconds`;
}

// Update the time difference every second
setInterval(updateTimeDifference, 1000);

// Initial call to display the time difference immediately
updateTimeDifference();



