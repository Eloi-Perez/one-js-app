const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

const errorDiv = document.querySelector('#error');

let pokemonRepository = (() => {

    //Loading
    let divLoading = document.querySelector('#loading');
    let loading = document.createElement('p');
    loading.innerText = 'Loading...';
    function showLoadingMessage() {
        divLoading.appendChild(loading);
    }
    function hideLoadingMessage() {
        if (divLoading.hasChildNodes()) {
            divLoading.removeChild(loading);
        }
    }

    //API List
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

    function getAll() {
        return pokemonList;
    }

    function add(pokemon) {
        if (typeof (pokemon) === 'object' && 'name' in pokemon) {
            pokemonList.push(pokemon);
        } else {
            console.error('%cpokemonRepository.add() can only add Objects that contains the properties: name' + '%c, height and type.', 'color:white;', 'color:grey; text-decoration: line-through;');
        }
    }

    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(response => {
            return response.json();
        }).then(json => {
            json.results.forEach(item => {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
            hideLoadingMessage();
        }).catch(e => {
            console.error(e);
            hideLoadingMessage();
        })
    }



    //API Details
    function loadDetails(item) {
        showLoadingMessage();
        let url = item.detailsUrl;
        return fetch(url).then(response => {
            return response.json();
        }).then(p => {
            item.imageUrl = p.sprites.front_default;
            item.height = p.height;
            item.weight = p.weight;
            item.types = p.types;
            hideLoadingMessage();
        }).catch(e => {
            console.error(e);
            hideLoadingMessage();
        });
    }

    //List to HTML
    function addListItem(pokemon) {
        let htmlList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        listItem.classList.add('col-lg-3', 'col-md-4');
        let button = document.createElement('button');
        button.innerText = capitalize(pokemon.name);
        button.classList.add('pokemonButton', 'p-2');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#mainModal');
        button.addEventListener('click', () => {
            showDetails(pokemon);
        });
        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    //Remove all Children from list
    function cleanList() {
        let htmlList = document.querySelector('.pokemon-list');
        while (htmlList.firstChild) {
            htmlList.removeChild(htmlList.firstChild);
        }
    }

    // Modal for Details
    let modalContainer = document.querySelector('.modal-content');
    function showModal(title, img, previous, next, ...text) {

        // Clear all existing modal content
        modalContainer.innerHTML = '';

        // Create Modal
        let modal = document.createElement('div');

        let titleContainer = document.createElement('div');
        titleContainer.classList.add('modal-header');

        let titleElement = document.createElement('h1');
        titleElement.classList.add('modal-title');
        titleElement.innerText = title;
        titleContainer.appendChild(titleElement);

        let closeElement = document.createElement('button');
        closeElement.classList.add('btn-close');
        closeElement.setAttribute('type', 'button');
        closeElement.setAttribute('data-bs-dismiss', 'modal');
        closeElement.setAttribute('aria-label', 'Close');
        titleContainer.appendChild(closeElement);

        modal.appendChild(titleContainer);

        bodyElement = document.createElement('div');
        bodyElement.classList.add('modal-body', 'container-fluid');

        let rowBody = document.createElement('div');
        rowBody.classList.add('row');

        let colImg = document.createElement('div')
        colImg.classList.add('col-6');
        let imgElement = document.createElement('img')
        imgElement.setAttribute('src', img);
        imgElement.setAttribute('width', '192px');
        imgElement.setAttribute('height', '192px');
        imgElement.classList.add('modal-img');
        colImg.appendChild(imgElement);
        rowBody.appendChild(colImg);

        let colCont = document.createElement('div')
        colCont.classList.add('col-6', 'align-self-center');
        let contentElement = document.createElement('ul');
        contentElement.classList.add('modal-list');
        text.map((el) => {
            let listContentElement = document.createElement('li');
            listContentElement.innerText = el;
            contentElement.appendChild(listContentElement);
        });
        colCont.appendChild(contentElement);
        rowBody.appendChild(colCont);

        bodyElement.appendChild(rowBody);

        modal.appendChild(bodyElement);

        footerElement = document.createElement('div');
        footerElement.classList.add('modal-footer');

        let prevButt;
        if (previous !== undefined) {
            prevButt = document.createElement('button');
            prevButt.classList.add('btn', 'btn-secondary');
            prevButt.setAttribute('type', 'button');
            prevButt.innerText = 'Previous';
            prevButt.addEventListener('click', () => {
                showDetails(previous);
            });
            footerElement.appendChild(prevButt);
        }

        let nextButt;
        if (next !== undefined) {
            nextButt = document.createElement('button');
            nextButt.classList.add('btn', 'btn-primary');
            nextButt.setAttribute('type', 'button');
            nextButt.innerText = 'Next';
            nextButt.addEventListener('click', () => {
                showDetails(next);
            });
            footerElement.appendChild(nextButt);
        }

        modal.appendChild(footerElement);

        modalContainer.appendChild(modal);

        //Swipe
        let initialX;
        let x;
        function handleStart(e) {
            initialX = e.clientX;
        }
        function handleMove(e) {
            x = e.clientX;
        }
        function handleEnd() {
            if (previous !== undefined && x < initialX) {
                showDetails(previous);
            }
            if (next !== undefined && x > initialX) {
                showDetails(next);
            }
        }
        if (window.PointerEvent) {
            modal.addEventListener("pointerdown", handleStart, true);
            modal.addEventListener("pointermove", handleMove, true);
            modal.addEventListener("pointerup", handleEnd, true);
            modal.addEventListener("pointercancel", handleEnd, true);
        }
    }

    //Call Modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            let previous = pokemonList[pokemonList.indexOf(pokemon) - 1];
            let next = pokemonList[pokemonList.indexOf(pokemon) + 1];
            let number = '#' + (pokemonList.indexOf(pokemon) + 1);
            let height = 'Height: ' + pokemon.height + 'm';
            let weight = 'Weight: ' + pokemon.weight + 'Kg';
            let ptypes = [];
            pokemon.types.map(el => {
                ptypes.push(capitalize(el.type.name));
            });
            let types = 'Types: ' + ptypes.join(', ');
            showModal(capitalize(pokemon.name), pokemon.imageUrl, previous, next, number, height, weight, types);
        });
    }

    function find(pokemon) {
        let num = Number(pokemon);
        if (isNaN(num) === false) {
            if (num >= 1 && num <= 151) {
                let reNum = pokemonList[num - 1];
                myModal.show()
                showDetails(reNum);
            } else {
                errorDiv.innerText = 'This list only contains Pokemons 1-151';
                return console.warn('This list only contains Pokemons 1-151');
            }
        } else {
            let reIndex = pokemonList.findIndex(e => e.name === pokemon);
            if (reIndex !== -1) {
                let reString = pokemonList[reIndex];
                myModal.show()
                showDetails(reString);
            } else {
                errorDiv.innerText = 'This Pokemon is not in the list, check spelling please.';
                return console.warn('This Pokemon is not in the list, check spelling please.');
            }
        }
    }

    return {
        add: add,
        find: find,
        getAll: getAll,
        addListItem: addListItem,
        cleanList: cleanList,
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails
    };

})();



pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().map(el => {
        pokemonRepository.addListItem(el);
    });
});

// for show Modal without Bootstrap button -> to call it -> myModal.show();
let myModal = new bootstrap.Modal(document.querySelector('#mainModal'), {});

//Search Button
const searchInput = document.querySelector('#site-search');
function getSearch() {
    let searchVal = searchInput.value.toLowerCase();
    errorDiv.innerText = '';
    pokemonRepository.find(searchVal);
}
const searchBtt = document.querySelector('#searchButton');
searchBtt.addEventListener('click', e => {
    e.preventDefault();
    getSearch();
});

//Show search on typing
searchInput.oninput = handleInput;
function handleInput(e) {
    pokemonRepository.cleanList();
    errorDiv.innerText = '';
    const val = e.target.value.toLowerCase();
    let array = pokemonRepository.getAll();
    let result = array;
    if (isNaN(val) === true) {
        result = array.filter(el => el.name.indexOf(val) !== -1)
        if (result.length === 0) {
            errorDiv.innerText = 'This Pokemon is not in the list, check spelling please.';
        }
    } else {
        if (val >= 1 && val <= 151) {
            result = [array[val - 1]];
        } else {
            if (val != '') {
                errorDiv.innerText = 'This list only contains Pokemons 1-151';
            }
        }
    }
    result.map(el => {
        pokemonRepository.addListItem(el);
    });
}