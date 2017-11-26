
let maxSize;
let idInterval;
let state = 'hidden';

window.onload = function () {
  console.log('Document loaded');

  document.getElementById('new-post').addEventListener('click', showInputField);
  maxSize = document.getElementById('new-form-container').clientHeight;
  const newForm = document.getElementById('new-form-container');
  newForm.style.height = '0px';
  function showInputField () {
    state = newForm.style.visibility == 'visible' ? 'hidden' : 'visible';
    if (idInterval) {
      clearInterval(idInterval);
    }
    idInterval = setInterval(() => {
      if (state === 'visible') {
        newForm.style.visibility = 'visible';
        let currentSize = newForm.clientHeight;
        if (currentSize < maxSize) {
          currentSize += 5;
          newForm.style.height = `${currentSize}px`;
        } else {
          clearInterval(idInterval);
        }
      } else {
        let currentSize = newForm.clientHeight;
        if (currentSize > 0) {
          currentSize -= 5;
          newForm.style.height = `${currentSize}px`;
        } else {
          newForm.style.visibility = 'hidden';
          clearInterval(idInterval);
        }
      }
    }, 1);
  }
};
