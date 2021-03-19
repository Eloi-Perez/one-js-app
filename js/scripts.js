let pokemonRepository = ( () => {

    let divLoading = document.querySelector('#loading');
    let loading = document.createElement('p');
    loading.innerText = 'Loading...';

    function showLoadingMessage() {
        divLoading.appendChild(loading);
    }

    function hideLoadingMessage() {
        divLoading.removeChild(loading);
    }

    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll() {
        return pokemonList;
    }

    function add(pokemon) {
        if (typeof(pokemon) === 'object' && 'name' in pokemon) {
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

    function loadDetails(item) {
        showLoadingMessage();
        let url = item.detailsUrl;
        return fetch(url).then(response => {
            return response.json();
        }).then(details => {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types;
            hideLoadingMessage();
        }).catch(e => {
            console.error(e);
            hideLoadingMessage();
        });
    }

    function find(pokemon) {
        return pokemonList.filter(el => el['name'].toLowerCase() === pokemon.toLowerCase());
    }

    function addListItem (pokemon) {
        let htmlList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('pokemonButton');
        button.addEventListener('click', () => {
            showDetails(pokemon);
            button.classList.toggle('pokemonButtonMark');      
        });
        listItem.appendChild(button);
        htmlList.appendChild(listItem);
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then( () => {
            console.log(pokemon.name +' '+ pokemon.height +'m ');   //+ pokemon.type ?
       });
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


pokemonRepository.loadList().then( () => {
    pokemonRepository.getAll().map(element => {
        pokemonRepository.addListItem(element);


        // let big = ''
        // if (element.height > 1.1) {big = ' Wow, that’s big!'} else { big = ''}
        // document.write(`<p><span class="name">${element.name}</span> <span class="height">height: ${element.height}m</span> <span class="type">${element.type}</span><span class="big"> ${big}</span></p>`);
    });
});

console.log(pokemonRepository.find('charizarD')); //now is happening before loading list



// let testAdd = {namse: 'Pikachu', height: 0.4, type: ['Electric']};
// pokemonRepository.add(testAdd);