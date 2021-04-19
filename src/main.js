
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    generateMD();
})

const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const dateInput = document.querySelector('#date');
const contentInput = document.querySelector('#content');
const downloadButton = document.querySelector('#download');

// Set default date to "today"
dateInput.value = new Date().toLocaleDateString('en-CA').replace(/\//g, '-');

let tags = {};
function tagToggle(e) {
    let tag = e.target.textContent;
    console.log(tag);
    if (e.target.classList.contains('btn-primary')) {
        e.target.classList.remove('btn-primary');
        e.target.classList.add('btn-outline-secondary');
        delete tags[tag];
    } else {
        e.target.classList.add('btn-primary');
        e.target.classList.remove('btn-outline-secondary');
        tags[tag] = true;
    }
}
const tagButtons = document.querySelectorAll('#tags > button');
for (let index = 0; index < tagButtons.length; index++) {
    const btn = tagButtons[index];
    btn.addEventListener('click', tagToggle)
}

const outputContainer = document.querySelector('#output');


let lastURL = '';
function generateMD() {
    let date = new Date(dateInput.value + 'T07:00:00.000-05:00');
    let URL = titleInput.value.toLowerCase().replace(/[^a-zA-Z\d\s:]/g, '').replace(/(\s|:)/ig, '-');
    while (URL.match(/--/g)) URL = URL.replace(/--/g, '-')
    console.log(date, URL);

    let tagOutput = '';
    let tagCount = 0;
    for (const tag in tags) {
        if (Object.hasOwnProperty.call(tags, tag)) {
            tagOutput += '  - ' + tag + '\n'
            tagCount++;
        }
    }

    let content = contentInput.value;

    content = content.replace(/\[  /g, ' [');

    const output = `---
templateKey: blog-post
public: true
url: ${URL}
title: ${titleInput.value}
date: ${date.getTime()}
description: ${descriptionInput.value}
featuredpost: false
featuredimage: /img/orchid-text.png
tags:
${tagOutput}---
${content}`
    outputContainer.textContent = output;
    lastURL = URL;
}

function download() {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputContainer.textContent));
    element.setAttribute('download', dateInput.value + '-' + lastURL + '.md');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
downloadButton.addEventListener('click', download);
