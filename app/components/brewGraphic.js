export function initBrewGraphic() {
  return anime(brewGraphicConfig);
}

const brewGraphicConfig = {
  targets: 'path',
  strokeDashoffset: function(el) {
    const pathLength = el.getTotalLength();
    el.setAttribute('stroke-dasharray', pathLength);
    return [-pathLength, 0];
  },
  stroke: {
    value: function(el, i) {
      return 'rgb(255,' + i * 8 + ', 0)';
    },
    easing: 'linear',
    duration: 2000,
  },
  strokeWidth: {
    value: 6,
    easing: 'linear',
    delay: function(el, i) {
      return 1200 + (i * 40);
    },
    duration: 800,
  },
  delay: function(el, i) {
    return i * 60;
  },
  duration: 1200,
  easing: 'easeOutExpo',
  loop: true,
  direction: 'alternate',
};
