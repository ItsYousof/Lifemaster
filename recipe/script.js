function search() {
    const query = document.querySelector('.search-box input').value;
    $.ajax({
        method: 'GET',
        url: 'https://api.api-ninjas.com/v1/recipe?query=' + query,
        headers: { 'X-Api-Key': '+3Uf6soqweF4iu97x2mlZg==SIbK73dyM8mGUI7A' },
        contentType: 'application/json',
        success: function (result) {
            console.log(result);

            for (let i = 0; i < result.length; i++) {
                createRecipeCard(result[i].title, result[i].ingredients, result[i].instructions, result[i].servings);
            }
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}



function createRecipeCard(title, ingredients, instructions, servings) {
    const recipe = document.createElement('div');
    recipe.classList.add('recipe');
    recipe.innerHTML = `
            <h3 id="title">${title}</h3>
            <p id="ingredients">Ingredients: ${ingredients}</p>
            <p id="instructions">Instructions: ${instructions}</p>
            <span id="servings">Servings: ${servings}</span>
    `;

    document.querySelector('.recipe-container').appendChild(recipe);
}