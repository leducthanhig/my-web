const APIURL = 'https://api.jikan.moe/v4';
const form = document.getElementById('form');
const search = document.getElementById('query');
const searchResultsTitle = document.getElementById('search-results-title');
const searchResults = document.getElementById('search-results');
const pageNav = document.getElementById('page-nav');
const pages = new Map()
const popupBox = document.getElementById('popup-box');
const page = document.getElementById('page');
let totalPage = 0, curPage = 1, searchItem = '';

function searchAnime() {
    searchResults.innerHTML = '<br>Searching...';
    fetch(`${APIURL}/${searchItem ? 'anime?q=' + searchItem : 'seasons/now?continuing'}&sfw&page=${curPage}&limit=21`)
        .then(res => res.json())
        .then(response => {
            if (response.data.length == 0) {
                searchResults.innerHTML = '<br>Not found!';
            }
            else {
                if (!totalPage) {
                    totalPage = response.pagination.last_visible_page;
                    for (let i = 0; i < Math.min(7, totalPage) + 2; i++) {
                        const btn = document.createElement('button');
                        btn.addEventListener('click', (e) => {
                            if (btn.innerText == '...') e.stopPropagation();
                            if (curPage != btn.innerText && !btn.hasAttribute('disabled')) {
                                if (btn.innerText == '...') {
                                    const rect = btn.getBoundingClientRect();
                                    popupBox.style.left = `${rect.left + window.scrollX}px`;
                                    popupBox.style.top = `${rect.top + window.scrollY + btn.offsetHeight + 10}px`;
                                    popupBox.style.display = 'flex';
                                }
                                else if (btn.innerText == 'Prev') {
                                    curPage--;
                                }
                                else if (btn.innerText == 'Next') {
                                    curPage++;
                                }
                                else {
                                    curPage = Number(btn.innerText);
                                }
                                
                                if (pages.has(curPage)) {
                                    showResults(pages.get(curPage));
                                }
                                else {
                                    searchAnime();
                                }
                            }
                        });
                        pageNav.appendChild(btn);
                    }
                }
                const prev = pageNav.firstElementChild;
                const next = pageNav.lastElementChild;
                prev.innerText = 'Prev';
                prev.setAttribute('disabled', 'true');
                next.innerText = 'Next';
                pages.set(curPage, response.data);
                showResults(response.data);
            }
        });
}

function showResults(res) {
    searchResults.innerHTML = '';
    res.forEach(element => {
        const div_card = document.createElement('a');
        div_card.setAttribute('class', 'card');
        
        const image = document.createElement('img');
        image.setAttribute('class', 'thumbnail');
        
        const title = document.createElement('h3');
        title.setAttribute('class', 'title');
        
        div_card.href = element.url;
        
        title.innerHTML = `${element.titles[0].title}`;
        image.src = element.images.webp.large_image_url;
        image.alt = div_card.title = title.innerText;

        div_card.appendChild(image);
        div_card.appendChild(title);

        searchResults.appendChild(div_card);
    });
    
    const prev = pageNav.firstElementChild;
    const next = pageNav.lastElementChild;
    if (curPage == 1) {
        prev.setAttribute('disabled', 'true');
    }
    else {
        prev.removeAttribute('disabled');
    }
    if (curPage == totalPage) {
        next.setAttribute('disabled', 'true');
    }
    else {
        next.removeAttribute('disabled');
    }
    
    const children = pageNav.children;
    for (let i = 1; i < Math.min(totalPage, 7) + 1; i++) {
        if (i == 1) {
            children[i].innerText = '1';
        }
        else if (i == Math.min(totalPage, 7)) {
            children[i].innerText = totalPage;
        }
        else if (totalPage < 8) {
            children[i].innerText = i;
        }
        else {
            if (curPage < 5) {
                if (i <= 5) {
                    children[i].innerText = i;
                }
                else {
                    children[i].innerText = '...';
                }
            }
            else if (curPage > totalPage - 4) {
                if (i >= 3) {
                    children[i].innerText = i + totalPage - 7;
                }
                else {
                    children[i].innerText = '...';
                }
            }
            else {
                switch (i) {
                case 3:
                    children[i].innerText = curPage - 1;
                    break;
                case 4:
                    children[i].innerText = curPage;
                    break;
                case 5:
                    children[i].innerText = curPage + 1;
                    break;
                default:
                    children[i].innerText = '...';
                }
            }
        }
        if (children[i].innerText == curPage) {
            children[i].setAttribute('id', 'cur-page');
        }
        else {
            children[i].removeAttribute('id');
        }
    }
}

function updateSearchHistory() {
    let exist = false;
    for (const option of document.querySelector('#search-history').children) {
        if (option.value == searchItem) {
            exist = true;
            break;
        }
    }
    if (!exist) {
        const option = document.createElement('option');
        option.value = searchItem;
        document.querySelector('#search-history').appendChild(option);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (search.value) {
        searchItem = search.value.trim();
        totalPage = 0; curPage = 1;
        pages.clear();
        searchResultsTitle.style.setProperty('display', 'block');
        searchResultsTitle.innerText = 'Search results for "' + searchItem + '"';
        search.value = '';
        while (pageNav.childElementCount) {
            pageNav.firstElementChild.remove();
        }
        updateSearchHistory();
        searchAnime();
    }
});

document.addEventListener('click', (e) => {
    if (e.target != popupBox && e.target != popupBox.firstElementChild && e.target != page && popupBox.style.display == 'flex') {
        popupBox.style.display = 'none';
    }
});

popupBox.addEventListener('submit', (e) => {
    e.preventDefault();
    const tmp = Number(page.value);
    if (tmp != curPage && tmp <= totalPage) {
        popupBox.style.display = 'none';
        curPage = tmp;
        page.value = '';
        if (pages.has(curPage)) {
            showResults(pages.get(curPage));
        }
        else {
            searchAnime();
        }
    }
});

searchAnime();