let pokemonRepository = (function () {

    let pokemonList = [
    {name: 'Bulbasaur', height: 0.7, type: ['Grass', 'Poison']},
    {name: 'Ivysaur', height: 1, type: ['Grass', 'Poison']},
    {name: 'Venusaur', height: 2, type: ['Grass', 'Poison']},
    {name: 'Charmander', height: 0.6, type: ['Fire']},
    {name: 'Charmeleon', height: 1.1, type: ['Fire']},
    {name: 'Charizard', height: 1.7, type: ['Fire', 'Flying']},
    {name: 'Squirtle', height: 0.5, type: ['Water']},
    {name: 'Wartortle', height: 1, type: ['Water']},
    {name: 'Blastoise', height: 1.6, type: ['Water']}
    ];

    function getAll() {
        return pokemonList;
    }

    function add(pokemon) {
        if (typeof(pokemon) === 'object' && 'name' in pokemon && 'height' in pokemon && 'type' in pokemon) {
            pokemonList.push(pokemon);
        } else {
            console.warn('pokemonRepository.add() can only add Objects that contains the properties: name, height and type.');
        }
    }

    function find(pokemon) {
        return pokemonList.filter(el => el['name'].toLowerCase() === pokemon.toLowerCase());
    }

    return {
        add: add,
        find: find,
        getAll: getAll
    };

})();

let testAdd = {name: 'Pikachu', height: 0.4, type: ['Electric']};
pokemonRepository.add(testAdd);

pokemonRepository.getAll().forEach(element => {
    let big = ''
    if (element.height > 1.1) {big = ' Wow, that’s big!'} else { big = ''}
    document.write(`<p><span class="name">${element.name}</span> <span class="height">height: ${element.height}m</span> <span class="type">${element.type}</span><span class="big"> ${big}</span></p>`);
});


console.log(pokemonRepository.find('charizarD'));
