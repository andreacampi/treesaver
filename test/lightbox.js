goog.require('treesaver.ui.LightBox');

$(function() {
  var container;

  var prepare = function prepare(node, callback) {
    var div = document.createElement('div');
    document.body.appendChild(div);
    div.appendChild(node);
    var ret = callback(node);
    document.body.removeChild(div);
    return ret;
  };

  module('lightbox', {
    setup: function () {
      // Create an HTML tree for test data
      // Make request synchronously though
      $.ajax({
        async: false,
        url: 'assets/chrome.html',
        success: function (data) {
          if (data) {
            var testonly = document.createElement('div');
            document.body.appendChild(testonly);
            testonly.className = 'testonly container';

            container = document.createElement('div');

            var body = treesaver.resources.extractBody(data);
            if (body) {
              var div = document.createElement('div');
              div.innerHTML = body;
              treesaver.array.toArray(div.childNodes).forEach(function(child) {
                if (/^div$/i.test(child.nodeName)) {
                  container.appendChild(child);
                }
              });
              treesaver.dom.clearChildren(div);
            }
          }
        }
      });
    },
    teardown: function () {
      $('.testonly').remove();
    }
  });

  test('Construction', function() {
    var elem = $('.lightbox', container)[0],
        lb = prepare(elem, function(node) { return new treesaver.ui.LightBox(node); });

    // Sanity check for now, will fill in real tests later
    ok(lb, 'Object created');
    ok(!lb.container, 'Container is not yet extracted');
    ok(lb.fits({ w: Infinity, h: Infinity}), 'Fits');
    ok(lb.meetsRequirements(), 'Requirements');
  });

  test('activate', function() {
    var elem = $('.lightbox', container)[0],
        lb = prepare(elem, function(node) { return new treesaver.ui.LightBox(node); });

    var node = lb.activate();

    ok(node, 'Returns a node');
    ok(lb.active, 'Lightbox is active');
    ok(lb.container, 'Container is present');
    ok(lb.container.parentNode === node, 'Container is a child of the node');
    ok(node.parentNode === null, 'Node is not attached to the document');
    ok(lb.fits({ w: Infinity, h: Infinity}), 'Fits');
  });

  test('getMaxSize', function() {
    var elem = $('.lightbox', container)[0],
        lb = prepare(elem, function(node) { return new treesaver.ui.LightBox(node); }),
        node = lb.activate();
    $(node).appendTo('.testonly');

    var size = lb.getMaxSize();

    equal(typeof size, 'object', 'Returns a size');
  });

});
