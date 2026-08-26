/* Story page tools */
function toggleTools() {
  document.getElementById('toolsDD').classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.tools-dd')) {
    const dd = document.getElementById('toolsDD');
    if (dd) dd.classList.remove('open');
  }
});

/* Text size */
let fs = parseInt(localStorage.getItem('ush-text-size')) || 16;
const storyBody = document.getElementById('storyBody');
const sizeNum = document.getElementById('sizeNum');
if (storyBody) { storyBody.style.fontSize = fs + 'px'; }
if (sizeNum) { sizeNum.textContent = fs; }

function resize(d) {
  fs = Math.max(13, Math.min(26, fs + d));
  if (storyBody) storyBody.style.fontSize = fs + 'px';
  if (sizeNum) sizeNum.textContent = fs;
  localStorage.setItem('ush-text-size', fs);
}

/* Dark mode (base site is light — this toggle now goes dark instead of "light") */
function toggleLight() {
  document.body.classList.toggle('dark-mode');
  const on = document.body.classList.contains('dark-mode');
  const icon = document.getElementById('modeIcon');
  const label = document.getElementById('modeLabel');
  if (icon) icon.textContent = on ? '☀️' : '🌙';
  if (label) label.textContent = on ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('ush-dark-mode', on);
}

if (localStorage.getItem('ush-dark-mode') === 'true') {
  document.body.classList.add('dark-mode');
  const icon = document.getElementById('modeIcon');
  const label = document.getElementById('modeLabel');
  if (icon) icon.textContent = '☀️';
  if (label) label.textContent = 'Light Mode';
}
