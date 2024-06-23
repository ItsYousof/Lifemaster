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
            <h3 id="title">${title} <i class="fa-solid fa-bookmark" onclick="saveRecipe('${title.replace(/'/g, "\\'")}', '${ingredients.replace(/'/g, "\\'")}', '${instructions.replace(/'/g, "\\'")}', '${servings.replace(/'/g, "\\'")}')"></i></h3>
            <p id="ingredients">Ingredients: ${ingredients}</p>
            <p id="instructions">Instructions: ${instructions}</p>
            <span id="servings">Servings: ${servings}</span>
    `;

    document.querySelector('.recipe-container').appendChild(recipe);
}

function saveRecipe(title, ingredients, instructions, servings) {
    // Create an object to store the recipe data
    const recipe = {
        title,
        ingredients,
        instructions,
        servings
    };

    // Get the existing recipes from localStorage
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    // Add the new recipe to the list
    recipes.push(recipe);

    // Save the updated list back to localStorage
    localStorage.setItem('recipes', JSON.stringify(recipes));

    const bookmark = document.querySelector(`#title i[onclick="saveRecipe('${title.replace(/'/g, "\\'")}', '${ingredients.replace(/'/g, "\\'")}', '${instructions.replace(/'/g, "\\'")}', '${servings.replace(/'/g, "\\'")}')"]`);
    bookmark.style.color = 'green';
    setTimeout(() => {
        bookmark.style.color = '';
    }, 1000);
}

function showSavedRecipes() {
    let recipeContainer = document.querySelector('.recipe-container');
    recipeContainer.innerHTML = '';

    let mainContainer = document.querySelector('.container');
    if (mainContainer) {
        mainContainer.style.display = 'none';
    }

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    for (let i = 0; i < recipes.length; i++) {
        const { title, ingredients, instructions, servings } = recipes[i];
        const recipe = document.createElement('div');
        recipe.classList.add('recipe');
        recipe.innerHTML = `
                    <h3 id="title">${title} <i class="fa-solid fa-trash" onclick="deleteRecipe('${title.replace(/'/g, "\\'")}', '${ingredients.replace(/'/g, "\\'")}', '${instructions.replace(/'/g, "\\'")}', '${servings.replace(/'/g, "\\'")}')"></i></h3>
                    <p id="ingredients">Ingredients: ${ingredients}</p>
                    <p id="instructions">Instructions: ${instructions}</p>
                    <span id="servings">Servings: ${servings}</span>
                `;

        recipeContainer.appendChild(recipe);
    }
}

function deleteRecipe(title, ingredients, instructions, servings) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const updatedRecipes = recipes.filter(recipe => recipe.title !== title);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    showSavedRecipes();
}

function showMainContainer() {
    let mainContainer = document.querySelector('.container');
    mainContainer.style.display = 'block';

    let recipeContainer = document.querySelector('.recipe-container');
    recipeContainer.innerHTML = '';
}