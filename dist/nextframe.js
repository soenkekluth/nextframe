!function(n){for(var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},t=function(n,e){return e={exports:{}},n(e,e.exports),e.exports}(function(n){(function(){var e,t,r,o,a,i;"undefined"!=typeof performance&&null!==performance&&performance.now?n.exports=function(){return performance.now()}:"undefined"!=typeof process&&null!==process&&process.hrtime?(n.exports=function(){return(e()-a)/1e6},t=process.hrtime,o=(e=function(){var n;return 1e9*(n=t())[0]+n[1]})(),i=1e9*process.uptime(),a=o-i):Date.now?(n.exports=function(){return Date.now()-r},r=Date.now()):(n.exports=function(){return(new Date).getTime()-r},r=(new Date).getTime())}).call(e)}),r="undefined"==typeof window?e:window,o=["moz","webkit"],a="AnimationFrame",i=r["request"+a],u=r["cancel"+a]||r["cancelRequest"+a],c=0;!i&&c<o.length;c++)i=r[o[c]+"Request"+a],u=r[o[c]+"Cancel"+a]||r[o[c]+"CancelRequest"+a];if(!i||!u){var f=0,l=0,p=[];i=function(n){if(0===p.length){var e=t(),r=Math.max(0,1e3/60-(e-f));f=r+e,setTimeout(function(){var n=p.slice(0);p.length=0;for(var e=0;e<n.length;e++)if(!n[e].cancelled)try{n[e].callback(f)}catch(n){setTimeout(function(){throw n},0)}},Math.round(r))}return p.push({handle:++l,callback:n,cancelled:!1}),l},u=function(n){for(var e=0;e<p.length;e++)p[e].handle===n&&(p[e].cancelled=!0)}}var s=function(n){return i.call(r,n)};s.cancel=function(){u.apply(r,arguments)},s.polyfill=function(){r.requestAnimationFrame=i,r.cancelAnimationFrame=u};var h=function(){for(var n=arguments.length,e=Array(n),t=0;t<n;t++)e[t]=arguments[t];return new Promise(function(n){return s(function(){n.apply(void 0,e)})})},d=function(){for(var n=arguments.length,e=Array(n>1?n-1:0),t=1;t<n;t++)e[t-1]=arguments[t];var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return new Promise(function(n){var t=0;s(function o(){if(++t>=r)return n.apply(void 0,[r].concat(e));s(o)})})},v=function(n){if("function"!=typeof n)throw"callback needs to be a function";var e=!0;return s(function t(){e&&(n(),s(t))}),function(){e=!1}},m=function(n){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if("function"!=typeof n)throw"callback needs to be a function";var t=!0,r=0;return s(function o(){++r,t&&(e&&r%e==0&&n(),s(o))}),function(){t=!1}},w=function(n,e){var t=Promise.resolve(),r=[];return n.forEach(function(n){t=t.then(function(){return h().then(function(){return r.push(e(n))})})}),t.then(function(){return r})};n.nextFrame=h,n.waitFrames=d,n.when=function n(e){for(var t=arguments.length,r=Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return h().then(function(){var t=e.apply(void 0,r);return t?r&&r.length>1?r:t:n.apply(void 0,[e].concat(r))})},n.until=function n(e){for(var t=arguments.length,r=Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];return h().then(function(){var t=e.apply(void 0,r);return t?n.apply(void 0,[e].concat(r)):r&&r.length>1?r:t})},n.loop=v,n.throttleFrames=m,n.delay=function(){for(var n=arguments.length,e=Array(n>1?n-1:0),t=1;t<n;t++)e[t-1]=arguments[t];var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return new Promise(function(n,t){return setTimeout(function(){h().then(function(){return n.apply(void 0,e)})},r)})},n.sequence=w,n.frameSequence=w,n.wait=d,n.nextFrames=v,n.onEnterFrame=v,n.throttle=m,n.frame=h,n.default=h}(this.nextframe=this.nextframe||{});
//# sourceMappingURL=nextframe.js.map
