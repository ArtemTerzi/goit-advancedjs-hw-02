import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const timer = {
  userSelectedDate: Date.now(),
  intervalId: null,
  refs: {
    buttonEl: document.querySelector('button[data-start]'),
    inputEl: document.querySelector('input#datetime-picker'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  },

  start() {
    timer.refs.inputEl.disabled = true;
    timer.refs.buttonEl.disabled = true;

    timer.intervalId = setInterval(() => {
      const timeDelta = timer.userSelectedDate - Date.now();

      if (timeDelta <= 0) {
        timer.stop();

        return;
      }

      const { days, hours, minutes, seconds } = timer.convertMs(timeDelta);

      timer.refs.days.textContent = timer.addLeadingZero(days);
      timer.refs.hours.textContent = timer.addLeadingZero(hours);
      timer.refs.minutes.textContent = timer.addLeadingZero(minutes);
      timer.refs.seconds.textContent = timer.addLeadingZero(seconds);
    }, 1000);
  },

  stop() {
    clearInterval(timer.intervalId);

    timer.refs.inputEl.disabled = false;
  },

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  },
};

timer.refs.buttonEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      timer.refs.buttonEl.disabled = true;
    } else {
      timer.userSelectedDate = selectedDates[0];
      timer.refs.buttonEl.disabled = false;
    }
  },
};

flatpickr('input#datetime-picker', options);

timer.refs.buttonEl.addEventListener('click', timer.start);
