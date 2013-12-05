(function(context) {
  var INITIAL_POINTS = 10;

  var Point = function(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
  };
  Point.prototype = {
    distanceTo: function (x1, y1) {
      var dx = this.x - x1,
          dy = this.y - y1;
      return Math.sqrt(dx*dx + dy*dy);
    },
    draw: function(ctx) {
      ctx.save();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
      ctx.fillRect(this.x, this.y, 10, 10);
      ctx.strokeRect(this.x, this.y, 10, 10);
      ctx.restore();
    }
  };

  var Sim = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.canvasData = this.ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.points = [];
  };

  Sim.prototype = {
    initialize: function() {
      for (var i = 0; i < INITIAL_POINTS; i++) {
        var newPoint = new Point(Math.random() * this.canvas.width,
                                 Math.random() * this.canvas.height,
                                 parseInt(Math.random() * 255, 10),
                                 parseInt(Math.random() * 255, 10),
                                 parseInt(Math.random() * 255, 10));
        this.points.push(newPoint);
      }
    },

    start: function() {
      this.draw();
    },

    drawPixel: function (x, y, r, g, b) {
      this.ctx.save();
      this.ctx.fillStyle = 'rgb(' + parseInt(r, 10) + ', ' + parseInt(g, 10) + ', ' + parseInt(b, 10) + ')';
      this.ctx.fillRect(x, y, 1, 1);
      this.ctx.restore();
    },

    draw: function() {
      for (var i = 0; i < this.canvas.width; i++) {
        for (var j = 0;  j < this.canvas.height; j++) {
          var distances = [],
              minDistance = Infinity;

          for (var x = 0, l = this.points.length; x < l; x++) {
            var point = this.points[x],
                distance = point.distanceTo(j, i);

            distances.push({ point: point, distance: distance });
            if (distance < minDistance) {
              minDistance = distance;
            }
          }
          var r = 0, g = 0, b = 0, normalizer = this.points.length;

          for (x = 0, l = distances.length; x < l; x++) {
            var weight = minDistance / (distances[x].distance);
            r += weight * distances[x].point.r;
            g += weight * distances[x].point.g;
            b += weight * distances[x].point.b;
          }

          this.drawPixel(j, i, r / normalizer, g / normalizer, b / normalizer);
        }
      }

      for (var p = 0, l = this.points.length; i < l; i++) {
        this.points[p].draw(this.ctx);
      }
    }
  };

  context.Sim = Sim;
})(window);