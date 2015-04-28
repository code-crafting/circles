$(document).ready(function() {
    var canvas = document.getElementById('canvas');
    var width  = canvas.offsetWidth,
        height = canvas.offsetHeight;

    var stage = new Konva.Stage({
        container: 'canvas',
        width: width,
        height: height
    });

    var big_radius = width / 2;
    var small_radius = 0.6 * big_radius;
    var dotted_radius = big_radius - small_radius;
    var angle = 0;

    var layer = new Konva.Layer({
        x: big_radius,
        y: big_radius
    });

    var x_axis = new Konva.Line({
        points: [-big_radius, 0, big_radius, 0],
        stroke: '#aaa', strokeWidth: 0.5
    });

    var y_axis = new Konva.Line({
        points: [0, -big_radius, 0, big_radius],
        stroke: '#aaa', strokeWidth: 0.5
    });

    var big_circle = new Konva.Circle({
        radius: big_radius - 1,
        stroke: '#a00', strokeWidth: 1
    });

    var big_circle_center = new Konva.Circle({
        radius: 5,
        fill: '#f44'
    });

    var dotted_circle = new Konva.Circle({
        radius: dotted_radius - 1,
        stroke: '#44f', strokeWidth: 1, dash: [5, 12]
    });

    var small_circle_center = new Konva.Circle({
        x: dotted_radius,
        y: 0,
        radius: 5,
        fill: '#44f'
    });

    var small_circle = new Konva.Circle({
        x: small_circle_center.x(),
        y: small_circle_center.y(),
        radius: small_radius - 2,
        stroke: '#00a', strokeWidth: 1
    });

    var diagonal = new Konva.Line({
        points: [0, 0, small_circle_center.x(), small_circle_center.y()],
        stroke: '#aaa', strokeWidth: 1
    });

    var x_component = new Konva.Line({
        points: [small_circle_center.x(), 0, small_circle_center.x(), small_circle_center.y()],
        stroke: '#fb0', strokeWidth: 1
    });

    var y_component = new Konva.Line({
        points: [0, small_circle_center.y(), small_circle_center.x(), small_circle_center.y()],
        stroke: '#0a0', strokeWidth: 1
    });

    var arc = new Konva.Arc({
        angle: angle,
        outerRadius: 15,
        fill: '#aaa'
    });

    layer.add(
        x_axis, y_axis, diagonal, x_component, y_component, arc,
        big_circle_center, big_circle,
        dotted_circle,
        small_circle_center, small_circle
    );
    stage.add(layer);

    var animation = new Konva.Animation(function(frame) {
        angle = (frame.time * Math.PI / 2500) % (2 * Math.PI);
        small_circle_center.setAttrs({
            x: dotted_radius * Math.cos(angle),
            y: dotted_radius * Math.sin(angle)
        });

        small_circle.setAttrs({
            x: small_circle_center.x(),
            y: small_circle_center.y(),
        });

        diagonal.points([0, 0, small_circle_center.x(), small_circle_center.y()]);
        x_component.points([small_circle_center.x(), 0, small_circle_center.x(), small_circle_center.y()]);
        y_component.points([0, small_circle_center.y(), small_circle_center.x(), small_circle_center.y()]);
        arc.setAngle(angle * 180 / Math.PI);
    }, layer);
    animation.start();

    layer.on('click', function() {
      if (animation.isRunning()) {
        animation.stop();
      } else {
        animation.start();
      }
    });

    // Jquery UI
    $('#slider').slider({
        orientation: 'vertical',
        min: 0.25, max: 0.9,
        step: 0.01, value: 0.6,
        slide: function(event, ui) {
            small_radius = ui.value * big_radius;
            small_circle.setRadius(small_radius);

            dotted_radius = big_radius - small_radius;
            dotted_circle.setRadius(dotted_radius);

            small_circle_center.setAttrs({
                x: dotted_radius * Math.cos(angle),
                y: dotted_radius * Math.sin(angle)
            });

            small_circle.setAttrs({
                x: small_circle_center.x(),
                y: small_circle_center.y(),
            });

            diagonal.points([0, 0, small_circle_center.x(), small_circle_center.y()]);
            x_component.points([small_circle_center.x(), 0, small_circle_center.x(), small_circle_center.y()]);
            y_component.points([0, small_circle_center.y(), small_circle_center.x(), small_circle_center.y()]);

            layer.draw();
        }
    });
});
