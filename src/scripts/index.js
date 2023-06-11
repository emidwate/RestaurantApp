import { menuArray } from './data.js';
let foodName = [];
let foodPrice = [];

document.addEventListener('click', function (e) {
  if (e.target.dataset.add) {
    foodBtn(e.target.dataset.add);
  } else if (e.target.id === 'pay-btn') {
    e.preventDefault();
    validatePaymentForm();
  }
});

function foodBtn(foodId) {
  const foodObj = menuArray.filter(function (food) {
    return food.id == foodId;
  })[0];
  foodName.push(foodObj.name);
  foodPrice.push(foodObj.price);
  order(foodObj);
}

function order() {
  let totalPrice = 0;
  for (let total of foodPrice) {
    totalPrice += total;
  }

  let foodPriceCopy = foodPrice.slice();
  for (let i = 0; i < foodPriceCopy.length; i++) {
    foodPriceCopy[i] = '$' + foodPriceCopy[i];
  }

  let foodOrderedHTML = '<h1 id="footer-title">Your order</h1>';

  for (let i = 0; i < foodName.length; i++) {
    foodOrderedHTML += `
      <div class="food-ordered-inner">
        <div class="food-info">
          <div class="food-info-inner">
          <p class="food-title bold">${foodName[i]}</p>
          <button class="remove-btn" data-index="${i}">Remove</button>
        </div>
          <p class="food-price bold">${foodPriceCopy[i]}</p>
          </div>
      </div>
    `;
  }

  foodOrderedHTML += `<h2 id="total-price" class="bold">Total price: ${totalPrice}$</h2><button id="complete-order-btn" class="btn">Complete order</button>`;

  document.getElementById('food-order').innerHTML = foodOrderedHTML;

  const paymentContainer = document.querySelector('.payment-container');
  const completeOrderBtn = document.getElementById('complete-order-btn');
  completeOrderBtn.addEventListener('click', function () {
    paymentContainer.style.display = 'block';
  });
  document.getElementById('exit').addEventListener('click', function () {
    paymentContainer.style.display = 'none';
  });
  removeFood();
}

function removeFood() {
  const removeBtns = document.querySelectorAll('.remove-btn');
  removeBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const index = parseInt(btn.dataset.index);
      foodName.splice(index, 1);
      foodPrice.splice(index, 1);
      order();
    });
  });
  if (foodName.length === 0) {
    document.getElementById('food-order').innerHTML = '';
  }
}

function getFood() {
  let foodHTML = '';

  menuArray.forEach(function (food) {
    const ingredientsList = food.ingredients.join(', ');
    foodHTML += `
    <div class="food-container">
      <div class="food-emoji-size">${food.emoji}</div>
        <div class="food-inner">
            <p class="food-title bold">${food.name}</p>
            <p class="food-ingredients">${ingredientsList}</p>
            <p class="food-price bold">$${food.price}</p>
        </div>
        <button class="food-add-button" data-add="${food.id}">+</button>
    </div>
    `;
  });

  return foodHTML;
}

function validatePaymentForm() {
  const paymentContainer = document.querySelector('.payment-container');
  const nameInput = document.getElementById('name');
  const cardNumberInput = document.getElementById('card-number');
  const cvvNumberInput = document.getElementById('ccv-number');
  const nameValue = nameInput.value.trim();
  const cardNumberValue = cardNumberInput.value.trim();
  const cvvNumberValue = cvvNumberInput.value.trim();

  const cardNumberRegex = /^[0-9]{13,16}$/;
  const cvvNumberRegex = /^[0-9]{3}$/;

  if (nameValue === '') {
    document.getElementById('error').textContent = 'Please enter your name.';
    return false;
  }

  if (!cardNumberRegex.test(cardNumberValue)) {
    document.getElementById('error').textContent =
      'Please enter a valid card number.';
    return false;
  }

  if (!cvvNumberRegex.test(cvvNumberValue)) {
    document.getElementById('error').textContent = 'Please enter a valid CVV.';
    return false;
  }

  document.getElementById('error').textContent = '';

  document.getElementById('food-order').innerHTML =
    '<h2 id="thank-you-el">Thank you for your order!</h2>';
  paymentContainer.style.display = 'none';

  foodName = [];
  foodPrice = [];

  return true;
}

function render() {
  document.getElementById('food-container').innerHTML = getFood();
}

render();
