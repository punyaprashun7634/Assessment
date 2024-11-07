let response = await fetch('../data.json');
let data = await response.json();

let filters = new Set();


let renderFunction = (item, key)=>{
    let jobCard = document.createElement('div');
    jobCard.classList.add('job-card');
    jobCard.id = key;

    if(item.featured) jobCard.classList.add('featured');

    let logoBox = document.createElement('div');
    logoBox.classList.add('logo-box');

    let img = document.createElement('img');
    img.setAttribute('src', item.logo);

    let tagsBox = document.createElement('div');
    tagsBox.classList.add('tags-box');

    let postText = document.createElement('p');
    postText.classList.add('post-text');
    postText.textContent = item.company;

    let positionText = document.createElement('p');
    positionText.classList.add('position-text');
    positionText.textContent = item.position;

    let jobDetailBox = document.createElement('div');
    jobDetailBox.classList.add('job-details-box');

    let timePostText = document.createElement('p');
    timePostText.classList.add('time-posted-text');
    timePostText.textContent = item.postedAt;

    let timingText = document.createElement('p');
    timingText.classList.add('timing-text');
    timingText.textContent = item.contract;

    let locationText = document.createElement('p');
    locationText.classList.add('location-text');
    locationText.textContent = item.location;

    let line = document.createElement('div');
    line.classList.add('line');

    let skillSetBox = document.createElement('div');
    skillSetBox.classList.add('skill-set-box');

    let role = document.createElement('button');
    role.classList.add('skill');
    role.textContent = item.role;
    skillSetBox.appendChild(role);
    
    let level = document.createElement('button');
    level.classList.add('skill');
    level.textContent = item.level;
    skillSetBox.appendChild(level);

    item.languages.forEach((language)=>{
        let languagebtn = document.createElement('button');
        languagebtn.classList.add('skill');
        languagebtn.textContent = language;
        skillSetBox.appendChild(languagebtn);
    })
    item.tools.forEach((tool)=>{
        let toolbtn = document.createElement('button');
        toolbtn.classList.add('skill');
        toolbtn.textContent = tool;
        skillSetBox.appendChild(toolbtn);
    })

    // dot div
    let dot1 = document.createElement('div');
    dot1.classList.add('dot');
    let dot2 = document.createElement('div');
    dot2.classList.add('dot');

    jobDetailBox.appendChild(timePostText);
    jobDetailBox.appendChild(dot1)
    jobDetailBox.appendChild(timingText);
    jobDetailBox.appendChild(dot2)
    jobDetailBox.appendChild(locationText);

    tagsBox.appendChild(postText);

    if(item.new){
        let newBtn = document.createElement('button');
        newBtn.classList.add('btn','new');
        newBtn.textContent = 'new!';
        tagsBox.appendChild(newBtn);
    }
    if(item.featured){
        let featureBtn = document.createElement('button');
        featureBtn.classList.add('btn', 'feature');
        featureBtn.textContent = 'featured';
        tagsBox.appendChild(featureBtn);
    }

    logoBox.appendChild(img);

    let contentBox = document.createElement('div');
    contentBox.classList.add('content-box');

    contentBox.appendChild(tagsBox);
    contentBox.appendChild(positionText);
    contentBox.appendChild(jobDetailBox);

    jobCard.appendChild(logoBox);
    jobCard.appendChild(contentBox);
    jobCard.appendChild(line);
    jobCard.appendChild(skillSetBox);

    return jobCard;
}

let dataFiller = (data)=>{
    let jobList = document.querySelector('.job-lists');
    data.forEach((item, index)=>{
        jobList.appendChild(renderFunction(item, index));
    })
}

let dataFilterFunction = ()=>{
    let qualifiedData = new Set();
    data.forEach((item, index)=>{
        let pass = true;
        for(let flt of filters){
            if(![item.role, item.level, ...item.languages, ...item.tools].find((item)=>item===flt)){
                pass = false;
            }
        }
        if(pass) qualifiedData.add(index);
    })    
    return qualifiedData;
}

let filterBox = document.querySelector('.filter-box');
let removeFilterBtns = []

let addFilter = (filter)=>{
    if(!filters.has(filter)){
        filters.add(filter);
        // adding filter button
        let filterBtn = document.createElement('div');
        filterBtn.classList.add('filter-btn');

        let filterName = document.createElement('p');
        filterName.classList.add('filter-name');
        filterName.textContent = filter;

        let removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-filter');
        removeBtn.textContent = 'X';

        filterBtn.appendChild(filterName);
        filterBtn.appendChild(removeBtn);

        filterBox.appendChild(filterBtn);

        // class toggle for animation
        let filterContainer = document.querySelector('.filter-container');
        !filterContainer.classList.contains('active') && filterContainer.classList.add('active');
        filterContainer.classList.remove('hide');
    }

    // getting qualified data to display
    let qualifiedData = dataFilterFunction();

    for(let i = 0; i<data.length; i++){
        let card = document.getElementById(i);
        if(qualifiedData.has(i)){
            card.classList.contains('hide') && card.classList.remove('hide')
        }
        else{
            !card.classList.contains('hide') && card.classList.add('hide'); 
        }
    }

    // remove button event listener

    removeFilterBtns = document.querySelectorAll('.remove-filter');
    removeFilterBtns.forEach((removeFilterBtn)=>{
        removeFilterBtn.addEventListener('click', ()=>{
            let filterBtn = removeFilterBtn.parentElement;
            deleteFilter(filterBtn.querySelector('.filter-name').innerHTML);
            filterBtn.remove();
            if(filters.size==0){
                let filterContainer = document.querySelector('.filter-container');
                filterContainer.classList.remove('active');
                filterContainer.querySelector('.clear').classList.add('hide');
            }            
        })
    }) 
    // clear button event listener
    let clearBtn = document.querySelector('.clear');
    clearBtn.addEventListener('click', ()=>{
        let filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach((filterBtn)=>{
            filterBtn.remove();
        })
        filters.clear();
        let filterContainer = document.querySelector('.filter-container');
        filterContainer.classList.remove('active');
        let jobCards = document.querySelectorAll('.job-card');
        jobCards.forEach((jobCard)=>{
            jobCard.classList.remove('hide');
        })
    })   
}

let deleteFilter = (filter)=>{
    filters.delete(filter);
    let qualifiedData = dataFilterFunction();

    for(let i = 0; i<data.length; i++){
        let card = document.getElementById(i);
        if(qualifiedData.has(i)){
            card.classList.contains('hide') && card.classList.remove('hide')
        }
        else{
            !card.classList.contains('hide') && card.classList.add('hide'); 
        }
    }
}
// filling data to show
dataFiller(data);

let skills = document.querySelectorAll('.skill');
skills.forEach((skill)=>{
    skill.addEventListener('click', ()=>{
        addFilter(skill.innerHTML);       
    })
})



