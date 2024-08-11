const container = document.getElementById('container')
const box = document.getElementById('box');
const slider = document.getElementById('slider');
const clearBtn = document.getElementById('clear');
let isDraging = false, delta = 0;

function triggerFileUpload(e) {
    if ([container, box, container.lastElementChild, box.lastElementChild].includes(e.target)) {
        e.stopPropagation();
        e.currentTarget.firstElementChild.click();
    }
}

function startUp() {
    container.style.cursor = 'pointer';
    container.style.backgroundImage = '';
    container.lastElementChild.style.display = 'block';
    container.addEventListener('click', triggerFileUpload);
    
    box.style.cursor = 'pointer';
    box.style.backgroundImage = '';
    box.lastElementChild.style.display = 'block';
    box.addEventListener('click', triggerFileUpload);
}

function containerLoadImage(file) {
    if (file && file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            container.style.backgroundImage = `url(${e.target.result})`;
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                let width, height;
                if (img.width / img.height > 16 / 9) {
                    width = container.clientWidth;
                    height = img.height * width / img.width;
                }
                else {
                    height = container.clientHeight;
                    width = img.width * height / img.height;
                }
                container.style.backgroundPositionX = `${(container.clientWidth - width) / 2}px`;
                container.style.backgroundPositionY = `${(container.clientHeight - height) / 2}px`;
            }
        };
        reader.readAsDataURL(file);
        container.title = file.name;
        container.style.cursor = 'initial';
        container.removeEventListener('click', triggerFileUpload);
        container.lastElementChild.style.display = 'none';
    }
    else {
        alert('This file format is unsupported!');
    }
}

function boxLoadImage(file) {
    if (file && file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            box.style.backgroundImage = `url(${e.target.result})`;
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                let width, height;
                if (img.width / img.height > 16 / 9) {
                    width = container.clientWidth;
                    height = img.height * width / img.width;
                    box.style.backgroundSize = `${container.clientWidth}px`;
                }
                else {
                    height = container.clientHeight;
                    width = img.width * height / img.height;
                    box.style.backgroundSize = `auto ${container.clientHeight}px`;
                }
                box.style.backgroundPositionX = `${(container.clientWidth - width) / 2}px`;
                box.style.backgroundPositionY = `${(container.clientHeight - height) / 2}px`;
            }
        };
        reader.readAsDataURL(file);
        box.title = file.name;
        box.style.cursor = 'initial';
        box.removeEventListener('click', triggerFileUpload);
        box.lastElementChild.style.display = 'none';
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
        delta = Math.min(container.offsetWidth / 2, delta);
        delta = Math.max(-container.offsetWidth / 2, delta);
        box.style.width = `calc(var(--width) / 2 + ${delta}px)`;
    }
});
container.addEventListener('dragover', (e) => {
    e.preventDefault();
});
box.addEventListener('dragover', (e) => {
    e.preventDefault();
});
container.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
        const item = e.dataTransfer.items[0];
        if (item.kind === 'file') {
            const file = item.getAsFile();
            containerLoadImage(file);
        }
    }
});
box.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items) {
        const item = e.dataTransfer.items[0];
        if (item.kind === 'file') {
            const file = item.getAsFile();
            boxLoadImage(file);
        }
    }
});
container.firstElementChild.addEventListener("change", (e) => {
    const file = e.target.files[0];
    containerLoadImage(file);
    e.target.value = '';
});
box.firstElementChild.addEventListener("change", (e) => {
    const file = e.target.files[0];
    boxLoadImage(file);
    e.target.value = '';
});
clearBtn.addEventListener('click', startUp);

startUp();

/* const container = document.getElementById('container')
const left = container.firstElementChild;
const right = container.lastElementChild;
const clearBtn = document.getElementById('clear');
let isDraging = false, scale;

function triggerFileUpload(e) {
    if (e.currentTarget == left || e.currentTarget == right) {
        e.stopPropagation();
        e.currentTarget.firstElementChild.click();
    }
}

function startUp() {
    left.style.cursor = 'pointer';
    left.style.backgroundImage = '';
    left.style.backgroundSize = 'contain';
    left.lastElementChild.style.display = 'block';
    left.addEventListener('click', triggerFileUpload);
    
    right.style.cursor = 'pointer';
    right.style.backgroundImage = '';
    right.style.backgroundSize = 'contain';
    right.lastElementChild.style.display = 'block';
    right.addEventListener('click', triggerFileUpload);
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
    scale += e.deltaY * -0.3;
    scale = Math.max(scale, 1);
    left.style.backgroundSize = `${scale}%`;
    right.style.backgroundSize = `${scale}%`;
    left.style.backgroundPositionY = right.style.backgroundPositionY;
});
left.firstElementChild.addEventListener("change", (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            left.style.backgroundImage = `url(${e.target.result})`;
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                let width, height;
                if (img.width > img.height) {
                    width = left.offsetWidth;
                    height = img.height * width / img.width;
                }
                else {
                    height = left.offsetHeight;
                    width = img.width * height / img.height;
                }
                scale = width / left.offsetWidth * 100;
                left.style.backgroundPositionX = `${left.offsetWidth - width / 2}px`;
                left.style.backgroundSize = `${scale}%`;
            }
        };
        reader.readAsDataURL(file);
        left.title = file.name;
        left.style.cursor = 'initial';
        left.removeEventListener('click', triggerFileUpload);
        left.lastElementChild.style.display = 'none';
    }
});
right.firstElementChild.addEventListener("change", (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            right.style.backgroundImage = `url(${e.target.result})`;
            const img = new Image();
            img.src = e.target.result;
            
            img.onload = () => {
                let width, height;
                if (img.width > img.height) {
                    width = right.offsetWidth;
                    height = img.height * width / img.width;
                }
                else {
                    height = right.offsetHeight;
                    width = img.width * height / img.height;
                }
                scale = width / right.offsetWidth * 100;
                right.style.backgroundPositionX = `${-width / 2}px`;
                right.style.backgroundSize = `${scale}%`;
            }
        };
        reader.readAsDataURL(file);
        right.title = file.name;
        right.style.cursor = 'initial';
        right.removeEventListener('click', triggerFileUpload);
        right.lastElementChild.style.display = 'none';
    }
});
clearBtn.addEventListener('click', startUp);

startUp(); */