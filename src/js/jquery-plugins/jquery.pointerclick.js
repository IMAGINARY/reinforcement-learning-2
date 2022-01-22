/**
 * This jQuery plugin adds an 'i.pointerclick' event that is fired on pointerdown followed by
 * a pointerup within the area of the original element.
 *
 * Install it by calling pointerclick() on a jQuery object:
 *
 * $('#my-element')
 *  .pointerclick()
 *  .on('i.pointerclick', function(event) {
 *    // do something
 *  });
 *
 *  This plugin was motivated because on multi-touch devices, the click event is not fired if a
 *  different part of the screen is being touched at the time.
 */
(function initPlugins($) {
  $.fn.pointerclick = function pointerClickHandler() {
    return this.each(function pointerClickElementHandler() {
      let trackedPointerId = null;

      $(document)
        .on('pointerup', (ev) => {
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
          }
        })
        .on('pointercancel', (ev) => {
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
          }
        });

      $(this)
        .on('pointerdown', (ev) => {
          trackedPointerId = ev.pointerId;
          // On touch, apparently, the pointer is automatically captured by pointerdown
          ev.delegateTarget.releasePointerCapture(ev.pointerId);
        })
        .on('pointerup', (ev) => {
          if (ev.pointerId === trackedPointerId) {
            trackedPointerId = null;
            $(this).trigger('i.pointerclick', ev);
          }
        });
    });
  };
}(jQuery));
