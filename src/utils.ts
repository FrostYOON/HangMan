export function makeElementVisible(element: HTMLElement) {
  element.classList.remove('invisible');
  element.classList.add('visible');
}

export function makeElementInvisible(element: HTMLElement) {
  element.classList.remove('visible');
  element.classList.add('invisible');
}