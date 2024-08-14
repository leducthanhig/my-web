const ver = document.getElementById('old-ver');
const clearBtn = document.getElementById('clear');
let startUpFn;

function version1() {
    const container = document.getElementById('container1')
    const box = document.getElementById('box');
    const slider = document.getElementById('slider');
    let isDraging = false, delta = 0, updateProperties;
    
    function startUp() {
        container.title = '';
        container.style.cursor = 'pointer';
        container.style.backgroundImage = '';
        container.lastElementChild.style.display = 'block';
        container.addEventListener('click', triggerFileUpload);
        
        box.title = '';
        box.style.cursor = 'pointer';
        box.style.backgroundImage = '';
        box.lastElementChild.style.display = 'block';
        box.addEventListener('click', triggerFileUpload);
    }
    
    function triggerFileUpload(e) {
        if (!e.target.title) {
            e.stopPropagation();
            e.currentTarget.firstElementChild.click();
        }
    }
    
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            container.requestFullscreen().then(updateProperties);
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
                readFile(file, e.currentTarget);
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
                box.style.backgroundPositionX = container.style.backgroundPositionX = ''
                box.style.backgroundPositionY = container.style.backgroundPositionY = `${(9/16 - img.height/img.width) * container.clientWidth / 2}px`;
            }
            else {
                box.style.backgroundSize = `auto ${container.clientWidth * (9/16)}px`;
                box.style.backgroundPositionX = container.style.backgroundPositionX = `${(16/9 - img.width/img.height) * container.clientWidth * (9/16) / 2}px`;
                box.style.backgroundPositionY = container.style.backgroundPositionY = ''
            }
        };
        target.style.cursor = 'initial';
        target.removeEventListener('click', triggerFileUpload);
        target.lastElementChild.style.display = 'none';
    }
    
    function readFile(file, target) {
        if (file && file.type.includes('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                target.title = file.name;
                loadImage(e.target.result, target);
            };
            reader.readAsDataURL(file);
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
    document.onkeyup = e => {
        if (e.key === 'Enter') {
            toggleFullScreen();
        }
    };
    
    startUpFn = startUp;

    startUp();
}

function version0() {
    const container = document.getElementById('container');
    const left = container.firstElementChild;
    const right = container.lastElementChild;
    let isDraging = false;
    
    function startUp() {
        left.title = '';
        left.style.cursor = 'pointer';
        left.style.backgroundImage = '';
        left.lastElementChild.style.display = 'block';
        left.addEventListener('click', triggerFileUpload);
        
        left.title = '';
        right.style.cursor = 'pointer';
        right.style.backgroundImage = '';
        right.lastElementChild.style.display = 'block';
        right.addEventListener('click', triggerFileUpload);
    }
    
    function triggerFileUpload(e) {
        e.stopPropagation();
        e.currentTarget.firstElementChild.click();
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
                readFile(file, e.currentTarget);
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
                left.style.backgroundPositionX = '';
                right.style.backgroundPositionX = `-${container.clientWidth / 2}px`;
                left.style.backgroundPositionY = right.style.backgroundPositionY = `${(9/16 - img.height/img.width) * container.clientWidth / 2}px`;
            }
            else {
                left.style.backgroundSize = right.style.backgroundSize = `auto ${container.clientHeight}px`;
                left.style.backgroundPositionX = `${(16/9 - img.width/img.height) * container.clientHeight / 2}px`;
                right.style.backgroundPositionX = `-${(img.width/img.height) * container.clientHeight / 2}px`;
                left.style.backgroundPositionY = right.style.backgroundPositionY = '';
            }
        }
        target.style.cursor = 'initial';
        target.removeEventListener('click', triggerFileUpload);
        target.lastElementChild.style.display = 'none';
    }
    
    function readFile(file, target) {
        if (file && file.type.includes('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                target.title = file.name;
                loadImage(e.target.result, target);  
            };
            reader.readAsDataURL(file);
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

    startUpFn = startUp;

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
    clearBtn.onclick = startUpFn;
}

ver.addEventListener('change', switchVersion);

version1();

clearBtn.onclick = startUpFn;