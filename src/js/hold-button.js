/**
 * props:
 *  - holdTime: time in ms to hold the button
 */
function createHoldButton(props) {
  const $button = $('<button></button>')
    .attr({
      type: 'button',
    })
    .addClass('hold-button')
    .append(
      $('<span class="progress"></span>')
        .css({
          animationDuration: `${props.holdTime}ms`,
        })
    )
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

    $button.addClass('held');
    holdTimeout = setTimeout(() => {
      holdTimeout = null;
      trackedPointerId = null;
      $button.trigger('hold');
      $button.removeClass('held');
    }, props.holdTime);
  }

  function abortHolding() {
    if (holdTimeout !== null) {
      clearTimeout(holdTimeout);
      holdTimeout = null;
    }
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
