/**
 * props:
 *  - holdTime: time in ms to hold the button
 */
function createHoldButton(props) {
  const $progressBar = $('<span class="progress"></span>')
    .css('transition-duration', `${props.holdTime}ms`);
  const $button = $('<button></button>')
    .attr({
      type: 'button',
    })
    .addClass('hold-button')
    .append($progressBar)
    .append(
      $('<span class="text"></span>')
    );

  let trackedPointerId = null;
  let holdTimeout = null;

  function startHolding() {
    if (holdTimeout !== null) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }

    $progressBar.css('transition-duration', `${props.holdTime}ms`);
    $button.removeClass('held');
    $button.addClass('reset');
    setTimeout(() => {
      $button.removeClass('reset');
      $button.addClass('held');
    }, 0);
    holdTimeout = setTimeout(() => {
      holdTimeout = null;
      trackedPointerId = null;
      $button.trigger('hold');
      $button.removeClass('held');
      $progressBar.css('transition-duration', '0ms');
    }, props.holdTime);
  }

  function abortHolding() {
    if (holdTimeout !== null) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
    $progressBar.css('transition-duration', '200ms');
    $button.removeClass('held');
    trackedPointerId = null;
  }

  $(document)
    .on('pointerup', (ev) => {
      if (ev.pointerId === trackedPointerId) {
        abortHolding();
      }
    })
    .on('pointercancel', (ev) => {
      if (ev.pointerId === trackedPointerId) {
        abortHolding();
      }
    });

  $button.on('pointerdown', (ev) => {
    if (trackedPointerId === null) {
      ev.preventDefault();
      trackedPointerId = ev.pointerId;
      // On touch, apparently, the pointer is automatically captured by pointerdown
      ev.delegateTarget.releasePointerCapture(ev.pointerId);
      startHolding();
    }
  });

  return $button;
}

module.exports = createHoldButton;
