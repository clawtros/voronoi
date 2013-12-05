(function(context) {
  var INITIAL_POINTS = 3;

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
      ctx.fillRect(this.x, this.y, 100, 100);
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
      this.canvas.addEventListener('click', (
        function(self) {
          return function(event) {
            var sx = self.canvas.width / self.canvas.offsetWidth,
                sy = self.canvas.height / self.canvas.offsetHeight;
            self.points.push(new Point(event.offsetX * sx,
                                       event.offsetY * sy,
                                       parseInt(Math.random() * 255, 10),
                                       parseInt(Math.random() * 255, 10),
                                       parseInt(Math.random() * 255, 10)))
            self.draw();
          }
        })(this));
      this.canvas.addEventListener('mousemove', (
        function(self) {
          return function(event) {
            if (self.points) {
              var sx = self.canvas.width / self.canvas.offsetWidth,
                  sy = self.canvas.height / self.canvas.offsetHeight;
              self.points[self.points.length - 1] = new Point(event.offsetX * sx,
                                         event.offsetY * sy,
                                         255,
                                         255,
                                         255);
              self.draw();
            }
          }
        })(this));

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
      for (var i = 0; i < this.canvas.height; i++) {
        for (var j = 0;  j < this.canvas.width; j++) {
          var distances = [],
              minDistance = Infinity,
              closest = undefined;

          for (var x = 0, l = this.points.length; x < l; x++) {
            var point = this.points[x],
                distance = point.distanceTo(j, i);

            distances.push({ point: point, distance: distance });
            if (distance < minDistance) {
              minDistance = distance;
              closest = point;
            }
          }
          var r = 0, g = 0, b = 0, averageDistance = 0, normalizer = this.points.length;

          for (x = 0, l = distances.length; x < l; x++) {
            var weight = 1 - (minDistance / (distances[x].distance));
            averageDistance += weight;
            r += weight * distances[x].point.r;
            g += weight * distances[x].point.g;
            b += weight * distances[x].point.b;
          }

          this.drawPixel(j, i, r / normalizer, g / normalizer, b / normalizer);
        }
      }

    }
  };

  context.Sim = Sim;
})(window);