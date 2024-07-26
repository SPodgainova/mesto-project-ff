import "./pages/index.css";

import { cardsTemplate, addCard } from "./components/card";
import { openModal, closeModal } from "./components/modal";
import {
  validationConfig,
  clearValidation,
  enableValidation,
} from "./components/validation";
import {
  getUserInfo,
  getCardInfo,
  updateUserInfo,
  updateCardInfo,
  updateUserAvatar,
  handleDeletCardSubmit,
} from "./components/api";

// вывод ошибки в консоль

function renderError(err) {
  console.log(err);
}

// отображение загрузки

function renderLoading(isLoading) {
  if (isLoading) {
    document.querySelector(".popup__button").textContent = "Сохранение";
  }
}

// аватарка пользователя

const userAvatar = document.querySelector(".profile__image");
const popupUserAvatar = document.querySelector(".popup_type_edit-avatar");
const userAvatarForm = popupUserAvatar.querySelector(".popup__form");
const avatarInput = userAvatarForm.querySelector(".popup__input_avatar");

// слушатели

userAvatar.addEventListener("click", () => {
  openModal(popupUserAvatar);
});
userAvatarForm.addEventListener("submit", handleUserAvatarSubmit);

// обработчик для кнопки "Сохранить"

function handleUserAvatarSubmit(evt) {
  evt.preventDefault();
  renderLoading(true);

  const avatarConfig = {
    avatar: avatarInput.value,
  };

  updateUserAvatar(avatarConfig)
    .then((res) => {
      renderUserAvatar(res);
      closeModal(popupUserAvatar);
      userAvatarForm.reset();
    })
    .catch((err) => renderError(err))
    .finally(() => renderLoading(false));
}

// зарендерить данные аватара с сервера

function renderUserAvatar(data) {
  userAvatar.style.backgroundImage = `url(${data.avatar})`;
}

// -------------------------------------------------------------------------->

// профиль пользователя (данные)

const userName = document.querySelector(".profile__title");
const userDescription = document.querySelector(".profile__description");

const popupProfileEdit = document.querySelector(".popup_type_edit");
const buttonProfileEdit = document.querySelector(".profile__edit-button");

const userForm = popupProfileEdit.querySelector(".popup__form");
const nameInput = userForm.querySelector(".popup__input_type_name");
const jobInput = userForm.querySelector(".popup__input_type_description");

// слушатели

buttonProfileEdit.addEventListener("click", openPopupUserProfile);
userForm.addEventListener("submit", handleProfileFormSubmit);

// открытие формы с заполненными данными

function openPopupUserProfile() {
  nameInput.value = userName.textContent;
  jobInput.value = userDescription.textContent;
  clearValidation(popupProfileEdit, validationConfig);
  openModal(popupProfileEdit);
}

// заполняет профиль данными с сервера

function renderUserInfo(data) {
  userName.textContent = data.name;
  userDescription.textContent = data.about;
  renderUserAvatar(data);
}

// обработчик для кнопки "Сохранить" в форме профиля

function handleProfileFormSubmit(evt) {
  renderLoading(true);
  evt.preventDefault();

  const userConfig = {
    name: nameInput.value,
    about: jobInput.value,
  };

  updateUserInfo(userConfig)
    .then((data) => renderUserInfo(data))
    .catch((err) => renderError(err))
    .finally(() => renderLoading(false));

  closeModal(popupProfileEdit);
}

// -------------------------------------------------------------------------->

// Карточки

// отрисовывает начальные карточки из сервера

const cardsContainer = document.querySelector(".places__list");

function renderCardInfo(data, myId) {
  data.forEach((item) => {
    cardsContainer.prepend(
      addCard(item, myId, openPopupImage, openPopupDeleteCard)
    );
  });
}

// добавление новой карточки пользователем

const popupNewCard = document.querySelector(".popup_type_new-card");

const newCardForm = popupNewCard.querySelector(".popup__form");
const newCardButton = document.querySelector(".profile__add-button");

// слушатели

newCardButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(popupNewCard, validationConfig);
  openModal(popupNewCard);
});

newCardForm.addEventListener("submit", handleFormNewCard);

// удаление карточки

const formDeleteCard = document.querySelector('form[name="delete-card"]');

// открытие модалки (при открытии достаём card и cardsItem для дальнейшего удаления при сабмите)

const popupDeleteCard = document.querySelector(".popup_type_delete-card");

let cardForDelete;
let cardItemForDelete;

function openPopupDeleteCard(card, cardItem) {
  cardForDelete = card;
  cardItemForDelete = cardItem;
  openModal(popupDeleteCard);
}

// обработчик для кнопки "Сохранить" в форме добавления новой карточки

function handleFormNewCard(evt) {
  evt.preventDefault();
  renderLoading(true);

  const newPlaceName = newCardForm.querySelector(
    ".popup__input_type_card-name"
  );
  const newPlaceLink = newCardForm.querySelector(".popup__input_type_url");

  const newCardConfig = {
    name: newPlaceName.value,
    link: newPlaceLink.value,
  };

  updateCardInfo(newCardConfig)
    .then((data) => {
      const myId = data.owner._id;
      cardsContainer.prepend(
        addCard(data, myId, openPopupImage, openPopupDeleteCard)
      );
    })
    .catch((err) => renderError(err))
    .finally(() => renderLoading(false));

  closeModal(popupNewCard);
}

// слушатель для подверждения удаления

formDeleteCard.addEventListener("submit", (evt) => {
  evt.preventDefault();

  handleDeletCardSubmit(cardForDelete).then(() => {
    cardItemForDelete.remove();
  });

  closeModal(document.querySelector(".popup_type_delete-card"));
});

// попап для картинок

const popupCardImage = document.querySelector(".popup_type_image");

// открытие формы с отображением картинки и названия

function openPopupImage(card) {
  const popupImage = popupCardImage.querySelector(".popup__image");
  const popupCaption = popupCardImage.querySelector(".popup__caption");
  popupImage.src = card.link;
  popupImage.alt = card.name;
  popupCaption.textContent = card.name;
  openModal(popupCardImage);
}

// -------------------------------------------------------------------------->

// включение валидации форм

enableValidation();

// -------------------------------------------------------------------------->

Promise.all([getUserInfo(), getCardInfo()])
  .then(([userInfo, cardInfo]) => {
    const myId = userInfo._id;
    renderUserInfo(userInfo);
    renderCardInfo(cardInfo, myId);
  })
  .catch((err) => {
    console.log(err);
  });
