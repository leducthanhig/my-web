const theme = document.getElementById('theme');

function switchTheme() {
    if (theme.innerHTML === '☾ Dark') {
        theme.innerHTML = '☀ Light';
        document.documentElement.style.setProperty('color-scheme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        theme.innerHTML = '☾ Dark';
        document.documentElement.style.setProperty('color-scheme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

theme.onclick = switchTheme;

if (localStorage.getItem('theme') === 'light') {
    switchTheme();
}
else {
    localStorage.setItem('theme', 'dark');
}