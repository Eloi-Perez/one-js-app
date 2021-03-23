const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

let errorDiv = document.querySelector('#error');

let pokemonRepository = (() => {

    //Loading
    let divLoading = document.querySelector('#loading');
    let loading = document.createElement('p');
    loading.innerText = 'Loading...';
    function showLoadingMessage() {
        divLoading.appendChild(loading);
    }
    function hideLoadingMessage() {
        divLoading.removeChild(loading);
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
            console.warn('%cpokemonRepository.add() can only add Objects that contains the properties: name' + '%c, height and type.', 'color:white;', 'color:grey; text-decoration: line-through;');
        }
    }

    function loadList() {
        showLoadingMessage();
        return fetch(apiUrl).then(response => {
            return response.json();
        }).then(json => {
            json.results.forEach(item => { //results from JSON key
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
        let button = document.createElement('button');
        button.innerText = capitalize(pokemon.name);
        button.classList.add('pokemonButton');
        button.addEventListener('click', () => {
            showDetails(pokemon);
            // button.classList.toggle('pokemonButtonMark');
        });
        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    // Modal for Details
    let modalContainer = document.querySelector('#modal-container');
    function showModal(title, img, previous, next, ...text) {

        // Clear all existing modal content
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        // Add the new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'Close';
        closeButtonElement.addEventListener('click', hideModal);

        let titleElement = document.createElement('h1');
        titleElement.innerText = title;

        let imgElement = document.createElement('img')
        imgElement.setAttribute('src', img);
        imgElement.setAttribute('width', '96px');
        imgElement.setAttribute('height', '96px');
        imgElement.classList.add('modal-img');

        let contentElement = document.createElement('ul');
        contentElement.classList.add('modal-list');
        text.map((el) => {
            let listContentElement = document.createElement('li');
            listContentElement.innerText = el;
            contentElement.appendChild(listContentElement);
        });

        let prevButt;
        if (previous !== undefined) {
            prevButt = document.createElement('button');
            prevButt.classList.add('previous');
            prevButt.innerText = 'Previous';
            prevButt.addEventListener('click', () => {
                showDetails(previous);
            });
            modal.appendChild(prevButt);
        }

        let nextButt;
        if (next !== undefined) {
            nextButt = document.createElement('button');
            nextButt.classList.add('next');
            nextButt.innerText = 'Next';
            nextButt.addEventListener('click', () => {
                showDetails(next);
            });
            modal.appendChild(nextButt);
        }

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(imgElement);
        modal.appendChild(contentElement);

        modalContainer.appendChild(modal);
        modalContainer.classList.add('is-visible');

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
            // } else {
            // 	modal.addEventListener("touchstart", handleStart, true);
            // 	modal.addEventListener("touchcancel", handleMove, true);
            // 	modal.addEventListener("touchmove", handleEnd, true);
            // 	modal.addEventListener("touchend", handleEnd, true);

            // 	modal.addEventListener("mousedown", handleStart, true);
        }
    }

    function hideModal(test) {
        modalContainer.classList.remove('is-visible');
    }

    //Close Modal on ESC
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    //Close Modal on click overlay
    modalContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });

    //Call Modal
    function showDetails(pokemon) {
        loadDetails(pokemon).then(() => {
            let previous = pokemonList[pokemonList.indexOf(pokemon) - 1];
            let next = pokemonList[pokemonList.indexOf(pokemon) + 1];
            let number = '#' + (pokemonList.indexOf(pokemon) + 1);
            let height = 'Height: ' + pokemon.height + 'm';
            let ptypes = [];
            pokemon.types.map(el => {
                ptypes.push(capitalize(el.type.name));
            });
            let types = 'Types: ' + ptypes.join(', ');
            showModal(capitalize(pokemon.name), pokemon.imageUrl, previous, next, number, height, types);
        });
    }

    function find(pokemon) {
        let num = Number(pokemon);
        if (isNaN(num) === false) {
            if (num >= 1 && num <= 151) {
                let reNum = pokemonList[num - 1];
                showDetails(reNum);
            } else {
                errorDiv.innerText = 'This list only contains Pokemons 1-151';
                return console.warn('This list only contains Pokemons 1-151');
            }
        } else {
            let reIndex = pokemonList.findIndex(e => e.name === pokemon.toLowerCase());
            if (reIndex !== -1) {
                let reString = pokemonList[reIndex];
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
        showDetails: showDetails,
        loadList: loadList,
        loadDetails: loadDetails
    };

})();


pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().map(element => {
        pokemonRepository.addListItem(element);


        // let big = ''
        // if (element.height > 1.1) {big = ' Wow, that’s big!'} else { big = ''}
        // document.write(`<p><span class="name">${element.name}</span> <span class="height">height: ${element.height}m</span> <span class="type">${element.type}</span><span class="big"> ${big}</span></p>`);
    });
});

//Search Button
function getSearch() {
    const val = document.querySelector('#site-search').value;
    errorDiv.innerText = ''
    pokemonRepository.find(val);
  }

document.querySelector('#searchButton').addEventListener('click', getSearch);
document.querySelector('#site-search').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        getSearch();
    }
});
