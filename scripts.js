const switchThemeBtn = document.getElementById('switch-theme');

function switchTheme() {
    if (switchThemeBtn.checked) {
        switchThemeBtn.innerHTML = '☾ Dark';
        document.documentElement.style.setProperty('color-scheme', 'light');
        localStorage.setItem('theme', 'light');
    }
    else {
        switchThemeBtn.innerHTML = '☀ Light';
        document.documentElement.style.setProperty('color-scheme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

switchThemeBtn.onclick = switchTheme;

if (localStorage.getItem('theme') === 'light') {
    switchTheme();
}
else {
    localStorage.setItem('theme', 'dark');
}