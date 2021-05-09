const $toggle = document.querySelector('.toggle')
const $body = document.querySelector('body')

function toggleTheme() {
  $body.classList.toggle('dark')
}

$toggle.addEventListener('click', toggleTheme)