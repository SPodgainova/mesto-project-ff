const cardsList = document.querySelector('.places__list');


// @todo: Темплейт карточки

const cardsTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы

const cardsItem = cardsTemplate.querySelector('.card').cloneNode(true);


// @todo: Функция создания карточки

function addCard (card, deleteCard) {
  const cardImage = cardsItem.querySelector('.card__image');
  cardImage.src = card.link;
  cardImage.alt = card.name;

  const cardTitle = cardsItem.querySelector('.card__title');
  cardTitle.textContent = card.name;

  const deleteButton = cardsItem.querySelector('.card__delete-button');
  deleteButton.addEventListener('on click', deleteCard);
    
  return cardsItem;
}

// @todo: Функция удаления карточки

function deleteCard () {
   cardsList.remove();
}

// @todo: Вывести карточки на страницу

initialCards.forEach(function(item) {
  cardsList.append(addCard(item, deleteCard));
})

