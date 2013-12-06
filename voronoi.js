(function(context) {
  var INITIAL_POINTS = 3,
      MIN_WEIGHT = 0;

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
      return dx*dx + dy*dy;

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
                                       self.points[0].r,
                                       self.points[0].g,
                                       self.points[0].b))
            self.points[0].r = parseInt(Math.random() * 255, 10);
            self.points[0].g = parseInt(Math.random() * 255, 10);
            self.points[0].b = parseInt(Math.random() * 255, 10);
            self.draw();
          }
        })(this));

      this.canvas.addEventListener('mousemove', this.moveHandler(this));
      this.canvas.addEventListener('touchmove', this.moveHandler(this));

      for (var i = 0; i < INITIAL_POINTS; i++) {
        var newPoint = new Point(Math.random() * this.canvas.width,
                                 Math.random() * this.canvas.height,
                                 parseInt(Math.random() * 255, 10),
                                 parseInt(Math.random() * 255, 10),
                                 parseInt(Math.random() * 255, 10));
        this.points.push(newPoint);
      }
    },

    moveHandler: function(self) {
      return function(event) {
        if (self.points) {
          var sx = self.canvas.width / self.canvas.offsetWidth,
              sy = self.canvas.height / self.canvas.offsetHeight;
          self.points[0].x = event.offsetX * sx;
          self.points[0].y = event.offsetY * sy;
          self.draw();
        }
      }
    },

    start: function() {
      this.draw();
    },

    draw: function() {
      var imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height),
          index = 0,
          closestBalance = 1;

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
          var r = 0, g = 0, b = 0, normalizer = 1;

          for (x = 0, l = distances.length; x < l; x++) {

            var weight = 1 - (minDistance / (distances[x].distance));
            if (weight > MIN_WEIGHT) {
              r += weight * distances[x].point.r;
              g += weight * distances[x].point.g;
              b += weight * distances[x].point.b;
              normalizer += 1;
              }
          }

          imageData.data[index++] = parseInt((r * closestBalance / normalizer) + (1 - closestBalance) * closest.r, 10);
          imageData.data[index++] = parseInt((g * closestBalance / normalizer) + (1 - closestBalance) * closest.g, 10);
          imageData.data[index++] = parseInt((b * closestBalance / normalizer) + (1 - closestBalance) * closest.b, 10);
          imageData.data[index++] = 255;

        }
      }
      this.ctx.putImageData(imageData, 0, 0);

    }
  };

  context.Sim = Sim;
})(window);