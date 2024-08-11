const dirPath = 'images/'
const fileNames = [];
const gallery = document.querySelector('#gallery');
const viewBox = document.querySelector('#view-box');

function updateColumns() {
    gallery.style.setProperty('column-count', Math.floor((window.innerWidth - 30) / 210));
}

function hideViewBox() {
    if (viewBox.style.display === 'flex') {
        viewBox.style.display = 'none';
        viewBox.style.position = 'absolute';
        viewBox.firstElementChild.remove();
        document.removeEventListener('keyup', browseImages);
    }
}

function browseImages(e) {
    if (document.querySelector('#random').checked) {
        const idx = Math.round(Math.random() * (fileNames.length - 1));
        if (e.key === 'ArrowLeft') {
            viewBox.firstElementChild.src = dirPath + fileNames[idx];
        }
        else if (e.key === 'ArrowRight') {
            viewBox.firstElementChild.src = dirPath + fileNames[idx];
        }
    }
    else {
        const idx = fileNames.indexOf(decodeURIComponent(viewBox.firstElementChild.src.slice(viewBox.firstElementChild.src.indexOf(dirPath) + dirPath.length)));
        if (e.key === 'ArrowLeft' && idx > 0) {
            viewBox.firstElementChild.src = dirPath + fileNames[idx - 1];
        }
        else if (e.key === 'ArrowRight' && idx < fileNames.length - 1) {
            viewBox.firstElementChild.src = dirPath + fileNames[idx + 1];
        }
    }
}

function toggleFullScreen(element) {
    if (!document.fullscreenElement) {
        element.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

fetch(dirPath)
    .then(res => res.text())
    .then(res => {
        const parse = new DOMParser();
        const htmlDoc = parse.parseFromString(res, 'text/html');
        return htmlDoc.getElementsByTagName('a');
    })
    .then(elements => {
        for (const element of elements) {
            fileNames.push(element.innerHTML);
        }
        fileNames.shift();
        return fileNames;
    })
    .then(fileNames => {
        fileNames.forEach(fileName => {
            const img = document.createElement('img');
            img.setAttribute('src', dirPath + fileName);
            img.setAttribute('loading', 'lazy');
            gallery.appendChild(img);
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = document.createElement('img');
                img.setAttribute('src', decodeURIComponent(e.target.src.slice(e.target.src.indexOf(dirPath))));
                viewBox.style.display = 'flex';
                viewBox.style.position = 'fixed';
                viewBox.appendChild(img);
                document.addEventListener('keyup', browseImages);
            });
        });
    });

window.addEventListener('resize', updateColumns);
document.addEventListener('click', hideViewBox);
document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
        hideViewBox();
    }
});
document.addEventListener("keyup", e => {
    if (e.key === 'f') {
        toggleFullScreen(viewBox.firstElementChild);
    }
}, false);

updateColumns();