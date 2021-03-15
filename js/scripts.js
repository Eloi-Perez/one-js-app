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
]


pokemonList.forEach(element => {
    let big = ''
    if (element.height > 1.1) {big = ' Wow, that’s big!'} else { big = ''}
    document.write(`<p><span class="name">${element.name}</span> <span class="height">height: ${element.height}m</span> <span class="big">${big}</span></p>`);
});