export const getMenuTemplate = (menuItems) =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${Array.from(menuItems).map((menuItem) => `<a class="trip-tabs__btn" href="#">${menuItem}</a>`).join(``)}
            </nav>`;
