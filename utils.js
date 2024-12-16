export function makeElementVisible(element) {
  element.classList.remove('invisible');
  element.classList.add('visible');
}

export function makeElementInvisible(element) {
  element.classList.remove('visible');
  element.classList.add('invisible');
}