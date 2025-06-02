const playButton = document.getElementsByClassName("play")[0];
const lapButton = document.getElementsByClassName("lap")[0];
const resetButton = document.getElementsByClassName("reset")[0];
const clearButton = document.getElementsByClassName("lap-clear-button")[0];
const minute = document.getElementsByClassName("minute")[0];
const second = document.getElementsByClassName("sec")[0];
const centiSecond = document.getElementsByClassName("msec")[0];
const laps = document.getElementsByClassName("laps")[0];
const bg = document.getElementsByClassName("outer-circle")[0];

let isPlay = false;
let centiSec;
let sec;
let min;
let centiCounter = 0;
let secCounter = 0;
let minCounter = 0;
let lapItem = 0;

const formatTime = (value) => (value < 10 ? `0${value}` : value);

const toggleButton = () => {
  lapButton.classList.remove("hidden");
  resetButton.classList.remove("hidden");
};

const play = () => {
  if (!isPlay) {
    playButton.innerHTML = "Pause";
    bg.classList.add("animation-bg");

    min = setInterval(() => {
      minute.innerHTML = formatTime(++minCounter);
    }, 60 * 1000);

    sec = setInterval(() => {
      if (secCounter === 60) {
        secCounter = 0;
      }
      second.innerHTML = formatTime(++secCounter);
    }, 1000);

    centiSec = setInterval(() => {
      if (centiCounter === 100) {
        centiCounter = 0;
      }
      centiSecond.innerHTML = formatTime(++centiCounter);
    }, 10);

    isPlay = true;
    toggleButton();
  } else {
    playButton.innerHTML = "Play";
    clearInterval(min);
    clearInterval(sec);
    clearInterval(centiSec);
    isPlay = false;
    bg.classList.remove("animation-bg");
  }
};

const reset = () => {
  clearInterval(min);
  clearInterval(sec);
  clearInterval(centiSec);
  isPlay = false;

  playButton.innerHTML = "Play";
  bg.classList.remove("animation-bg");

  lapButton.classList.add("hidden");
  resetButton.classList.add("hidden");

  second.innerHTML = "00";
  centiSecond.innerHTML = "00";
  minute.innerHTML = "00";

  centiCounter = 0;
  secCounter = 0;
  minCounter = 0;
};

const lap = () => {
  const li = document.createElement("li");
  const number = document.createElement("span");
  const timeStamp = document.createElement("span");
  const deleteBtn = document.createElement("button");

  li.setAttribute("class", "lap-item");
  number.setAttribute("class", "number");
  timeStamp.setAttribute("class", "time-stamp");
  deleteBtn.setAttribute("class", "lap-delete-btn");
  deleteBtn.setAttribute("aria-label", "Delete lap");

  number.innerText = `#${++lapItem}`;
  timeStamp.innerHTML = `${formatTime(minCounter)} : ${formatTime(
    secCounter
  )} : ${formatTime(centiCounter)}`;
  deleteBtn.innerHTML = "×"; // multiplication sign (cross)

  li.append(number, timeStamp, deleteBtn);
  laps.append(li);

  clearButton.classList.remove("hidden");

  // Vibration feedback (if supported)
  if (navigator.vibrate) {
    navigator.vibrate(100);
  }

  // Simple beep sound
  const beep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, 100);
  };
  beep();
};

// Event delegation to handle delete button clicks on laps
laps.addEventListener("click", (e) => {
  if (e.target.classList.contains("lap-delete-btn")) {
    const li = e.target.closest("li");
    if (li) {
      li.remove();
      // Re-number remaining laps
      const remainingLaps = laps.querySelectorAll(".lap-item");
      lapItem = 0;
      remainingLaps.forEach((lapEl) => {
        lapItem++;
        lapEl.querySelector(".number").innerText = `#${lapItem}`;
      });
      // Hide Clear All button if no laps
      if (remainingLaps.length === 0) {
        clearButton.classList.add("hidden");
      }
    }
  }
});

const clearAll = () => {
  laps.innerHTML = "";
  laps.append(clearButton);
  clearButton.classList.add("hidden");
  lapItem = 0;
};

playButton.addEventListener("click", play);
resetButton.addEventListener("click", reset);
lapButton.addEventListener("click", lap);
clearButton.addEventListener("click", clearAll);
