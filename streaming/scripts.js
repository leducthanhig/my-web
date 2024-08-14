const dirPath = 'videos/';
const viewBox = document.getElementById('view-box');
const listBox = document.getElementById('list-box');

fetch(dirPath)
    .then(res => res.text())
    .then(res => {
        const parse = new DOMParser();
        const htmlDoc = parse.parseFromString(res, 'text/html');
        return htmlDoc.querySelectorAll('table a');
    })
    .then(elements => {
        for (const element of elements) {
            if (element.innerHTML != '../') {
                const li = document.createElement('li');
                const video = document.createElement('video');
                const label = document.createElement('label');
                listBox.appendChild(li);
                li.appendChild(video);
                li.appendChild(label);
                video.src = dirPath + element.href.slice(element.href.lastIndexOf('/') + 1);
                label.innerHTML = element.innerHTML.slice(0, element.innerHTML.lastIndexOf('.'));
                label.setAttribute('title', label.innerHTML);
                
                li.addEventListener('click', (e) => {
                    e.stopPropagation();
                    viewBox.firstElementChild.src = video.src.slice(video.src.indexOf(dirPath));
                    viewBox.lastElementChild.innerHTML = label.innerHTML;
                })
            }
        }
    });