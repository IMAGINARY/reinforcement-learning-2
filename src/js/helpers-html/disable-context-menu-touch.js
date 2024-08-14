const disableContextMenuOnLongTouchHandler = (event) => {
  if (event.button !== 2 && !(event.clientX === event.clientY === 1)) {
    event.preventDefault();
  }
};

function disableContextMenuOnLongTouch() {
  $(window).on('contextmenu', disableContextMenuOnLongTouchHandler);
}

function enableContextMenuOnLongTouch() {
  $(window).off('contextmenu', disableContextMenuOnLongTouchHandler);
}

module.exports = {
  disableContextMenuOnLongTouch,
  enableContextMenuOnLongTouch,
};
