const ver = document.getElementById('old-ver');
const comboBoxes = document.getElementById('combo-boxes');
const kind = document.getElementById('kind');
const fileName = document.getElementById('file-name');
const modelLeft = document.getElementById('model-left');
const modelRight = document.getElementById('model-right');
const dirPath = 'Test Models';
const data = [];
let loadFn;

function version1() {
    const container = document.getElementById('container1')
    const box = document.getElementById('box');
    const slider = document.getElementById('slider');
    const clearBtn = document.getElementById('clear');
    let isDraging = false, delta = 0, updateProperties;
    
    function startUp() {
        container.title = '';
        container.style.cursor = 'pointer';
        container.style.backgroundImage = '';
        container.style.backgroundPosition = '';
        container.lastElementChild.style.display = 'block';
        container.addEventListener('click', triggerFileUpload);
        
        box.title = '';
        box.style.cursor = 'pointer';
        box.style.backgroundImage = '';
        box.style.backgroundPosition = '';
        box.lastElementChild.style.display = 'block';
        box.addEventListener('click', triggerFileUpload);
    }
    
    function triggerFileUpload(e) {
        if (!e.target.title) {
            e.stopPropagation();
            if (e.target.nodeName != 'INPUT') {
                e.currentTarget.firstElementChild.click();
            }
        }
    }
    
    function toggleFullScreen(element) {
        if (!document.fullscreenElement) {
            element.requestFullscreen().then(updateProperties);
        } else if (document.exitFullscreen) {
            document.exitFullscreen().then(updateProperties);
        }
    }

    function handleFileChangeEvent(e) {
        const file = e.target.files[0];
        readFile(file, e.target.parentElement);
        e.target.value = '';
    }
    
    function handleDropEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
            const item = e.dataTransfer.items[0];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                readFile(file, e.target);
            }
        }
    }
    
    function loadImage(url, target) {
        target.style.backgroundImage = `url('${url}')`;
        const img = new Image();
        img.src = url;
        
        img.onload = updateProperties = () => {
            if (img.width / img.height > 16 / 9) {
                box.style.backgroundSize = `${container.clientWidth}px`;
                box.style.backgroundPositionY = container.style.backgroundPositionY = `${(9/16 - img.height/img.width) * container.clientWidth / 2}px`;
            }
            else {
                box.style.backgroundSize = `auto ${container.clientWidth * (9/16)}px`;
                box.style.backgroundPositionX = container.style.backgroundPositionX = `${(16/9 - img.width/img.height) * container.clientWidth * (9/16) / 2}px`;
            }
        };
    }

    function readFile(file, target) {
        if (file && file.type.includes('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadImage(e.target.result, target);
            };
            reader.readAsDataURL(file);
            target.title = file.name;
            target.style.cursor = 'initial';
            target.removeEventListener('click', triggerFileUpload);
            target.lastElementChild.style.display = 'none';
        }
        else {
            alert('This file format is unsupported!');
        }
    }
    
    slider.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDraging = true;
    });
    document.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        isDraging = false;
    });
    container.addEventListener('mousemove', (e) => {
        e.stopPropagation();
        if (isDraging) {
            delta += e.movementX;
            delta = Math.min(container.clientWidth / 2, delta);
            delta = Math.max(-container.clientWidth / 2, delta);
            box.style.width = `${container.clientWidth / 2 + delta}px`;
        }
    });
    container.firstElementChild.addEventListener("change", handleFileChangeEvent);
    box.firstElementChild.addEventListener("change", handleFileChangeEvent);
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    container.addEventListener('drop', handleDropEvent);
    box.addEventListener('drop', handleDropEvent);
    clearBtn.addEventListener('click', startUp);
    document.addEventListener('keyup', e => {
        if (e.key === 'f') {
            toggleFullScreen(container);
        }
    }, false);
    
    loadFn = (url1, url2) => {
        loadImage(url1, box);
        loadImage(url2, container);
    };

    startUp();
}

function version0() {
    const container = document.getElementById('container')
    const left = container.firstElementChild;
    const right = container.lastElementChild;
    const clearBtn = document.getElementById('clear');
    let isDraging = false;
    
    function startUp() {
        left.style.cursor = 'pointer';
        left.style.backgroundSize = 'contain';
        left.style.backgroundImage = '';
        left.style.backgroundPosition = '';
        left.lastElementChild.style.display = 'block';
        left.addEventListener('click', triggerFileUpload);
        
        right.style.cursor = 'pointer';
        right.style.backgroundSize = 'contain';
        right.style.backgroundImage = '';
        right.style.backgroundPosition = '';
        right.lastElementChild.style.display = 'block';
        right.addEventListener('click', triggerFileUpload);
    }
    
    function triggerFileUpload(e) {
        if (e.currentTarget == left || e.currentTarget == right) {
            e.stopPropagation();
            e.currentTarget.firstElementChild.click();
        }
    }
    
    function handleFileChangeEvent(e) {
        const file = e.target.files[0];
        readFile(file, e.target.parentElement);
        e.target.value = '';
    }
    
    function handleDropEvent(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
            const item = e.dataTransfer.items[0];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                readFile(file, e.target);
            }
        }
    }
    
    function loadImage(url, target) {
        target.style.backgroundImage = `url('${url}')`;
        const img = new Image();
        img.src = url;

        img.onload = () => {
            if (img.width / img.height > 16 / 9) {
                left.style.backgroundSize = right.style.backgroundSize = `${container.clientWidth}px`;
                left.style.backgroundPositionY = right.style.backgroundPositionY = `${(9/16 - img.height/img.width) * container.clientWidth / 2}px`;
                right.style.backgroundPositionX = `-${container.clientWidth / 2}px`;
            }
            else {
                left.style.backgroundSize = right.style.backgroundSize = `auto ${container.clientHeight}px`;
                left.style.backgroundPositionX = `${(16/9 - img.width/img.height) * container.clientHeight / 2}px`;
                right.style.backgroundPositionX = `-${(img.width/img.height) * container.clientHeight / 2}px`;
            }
        }
    }

    function readFile(file, target) {
        if (file && file.type.includes('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadImage(e.target.result, target);
                
            };
            reader.readAsDataURL(file);
            target.title = file.name;
            target.style.cursor = 'initial';
            target.removeEventListener('click', triggerFileUpload);
            target.lastElementChild.style.display = 'none';
        }
    }

    container.addEventListener('mousedown', () => {
        isDraging = true;
    });
    container.addEventListener('mouseup', () => {
        isDraging = false;
    });
    container.addEventListener('mousemove', (e) => {
        if (isDraging) {
            left.style.backgroundPosition = `${Number(left.style.backgroundPositionX.slice(0, -2)) + e.movementX}px ${Number(left.style.backgroundPositionY.slice(0, -2)) + e.movementY}px`;
            right.style.backgroundPosition = `${Number(right.style.backgroundPositionX.slice(0, -2)) + e.movementX}px ${Number(right.style.backgroundPositionY.slice(0, -2)) + e.movementY}px`;
        }
    });
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (left.style.backgroundSize.includes('auto')) {
            left.style.backgroundSize = right.style.backgroundSize = `auto ${Math.max(Number(left.style.backgroundSize.slice(5, -2)) + e.deltaY * -1.7, 1)}px`;
        }
        else {
            left.style.backgroundSize = right.style.backgroundSize = `${Math.max(Number(left.style.backgroundSize.slice(0, -2)) + e.deltaY * -1.7, 1)}px`;
        }
    });
    left.firstElementChild.addEventListener("change", handleFileChangeEvent);
    right.firstElementChild.addEventListener("change", handleFileChangeEvent);
    left.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    right.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    left.addEventListener('drop', handleDropEvent);
    right.addEventListener('drop', handleDropEvent);
    clearBtn.addEventListener('click', startUp);

    loadFn = (url1, url2) => {
        loadImage(url1, left);
        loadImage(url2, right);
    };

    startUp();
}

function switchVersion() {
    const mainChildren = document.getElementsByTagName('main')[0].children;
    if (ver.checked) {
        mainChildren[0].style.display = 'none';
        mainChildren[1].style.display = 'flex';
        version0();
    }
    else {
        mainChildren[0].style.display = 'flex';
        mainChildren[1].style.display = 'none';
        version1();
    }
}

async function fetchFileList(dirPath) {
    const res = await fetch(dirPath);
    const res_text = await res.text();
    const parser = new DOMParser();
    return parser.parseFromString(res_text, 'text/html').getElementsByTagName('a');
}

function getData() {
    fetchFileList(dirPath)
    .then(elements => {
        for (const element of elements) {
            if (element.innerText == '../') continue;
            data.push({kind: element.innerText.slice(0, -1), fileNames: [], models: []});
        }
    })
    .then(() => {
        for (const item of data) {
            const option = document.createElement('option');
            option.innerText = item.kind.slice(5);
            kind.appendChild(option);

            fetchFileList(`${dirPath}/${item.kind}`)
            .then(elements => {
                for (const element of elements) {
                    if (element.innerText == '../') continue;
                    if (element.innerText.includes(item.kind)) {
                        item.models.push(element.innerText);
                    }
                    else {
                        item.fileNames.push(element.innerText);
                    }
                }
            });
        }
    });
}

ver.addEventListener('change', switchVersion);
kind.addEventListener('change', () => {
    fileName.innerHTML = '<option>--Choose a file name--</option>';
    modelLeft.innerHTML = '<option>--Choose a model for the left--</option>';
    modelRight.innerHTML = '<option>--Choose a model for the right--</option>';
    
    if (kind.value != '--Choose a kind--') {
        for (const item of data[kind.selectedIndex - 1].fileNames) {
            const option = document.createElement('option');
            option.innerText = item.slice(0, item.lastIndexOf('.'));
            fileName.appendChild(option);
        }
    }
});
fileName.addEventListener('change', () => {
    if (fileName.value != '--Choose a file name--') {
        modelLeft.innerHTML = '<option>--Raw--</option>';
        modelRight.innerHTML = '<option>--Raw--</option>';
        const path = `${dirPath}/${data[kind.selectedIndex - 1].kind}/${data[kind.selectedIndex - 1].fileNames[fileName.selectedIndex - 1]}`;
        loadFn(path, path);

        for (const item of data[kind.selectedIndex - 1].models) {
            const option = document.createElement('option');
            option.innerText = item.slice(String(`Test_${kind.value}`).length + 1, -1);
            modelLeft.appendChild(option.cloneNode(true));
            modelRight.appendChild(option);
        }
    }
    else {
        modelLeft.innerHTML = '<option>--Choose a model for the left--</option>';
        modelRight.innerHTML = '<option>--Choose a model for the right--</option>';
    }
});


getData();
version1();