if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // Uložení stavu do paměti prohlížeče
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}
