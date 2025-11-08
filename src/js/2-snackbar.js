import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.form'),
};

const generatePromise = ({ state, delay }) => {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  return promise;
};

const hadnleSubmit = e => {
  e.preventDefault();

  const formData = new FormData(refs.form);
  const options = {
    state: formData.get('state'),
    delay: formData.get('delay'),
  };

  generatePromise(options)
    .then(delay =>
      iziToast.success({
        message: `✅ Fulfilled promise in ${delay}ms`,
      })
    )
    .catch(delay =>
      iziToast.error({
        message: `❌ Rejected promise in ${delay}ms`,
      })
    );

  refs.form.reset();
};

refs.form.addEventListener('submit', hadnleSubmit);
