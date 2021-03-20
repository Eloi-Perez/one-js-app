const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
};

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
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
            button.classList.toggle('pokemonButtonMark');
        });
        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    // Modal for Details
    let modalContainer = document.querySelector('#modal-container');
    function showModal(title, img, ...text) {

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
        contentElement.classList.add('modal-img');
        text.map((el) => {
            let listContentElement = document.createElement('li');
            listContentElement.innerText = el;
            contentElement.appendChild(listContentElement);
        });

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(imgElement);
        modal.appendChild(contentElement);

        modalContainer.appendChild(modal);
        modalContainer.classList.add('is-visible');
    }

    function hideModal() {
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
            let height =  'Height: ' + pokemon.height + 'm';
            let ptypes = [];
            pokemon.types.map(el => {
                 ptypes.push(capitalize(el.type.name));
            });
            let types = 'Types: ' + ptypes.join(', ');
            showModal(capitalize(pokemon.name), pokemon.imageUrl, height, types);
        });
    }

    // function find(pokemon) {
    //     return pokemonList.filter(el => el['name'].toLowerCase() === pokemon.toLowerCase());
    // }

    return {
        add: add,
        // find: find,
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

// console.log(pokemonRepository.find('charizarD')); //now is happening before loading list
// let testAdd = {namse: 'Pikachu', height: 0.4, type: ['Electric']};
// pokemonRepository.add(testAdd);
