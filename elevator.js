(function (global) {

    var Elevator = function (selector) {
        return new Elevator.init(selector);
    };
    //Variables
    var start = false;
    var iteration = 0;
    var curentPosition;


    //Polyfill
    var requestAnimFrame = (function () {
        return global.requestAnimationFrame ||
            global.webkitRequestAnimationFrame ||
            global.mozRequestAnimationFrame ||
            function (callback) {
                global.setTimeout(callback, 1000 / 60);
            };
    })();

    if (!global.requestAnimationFrame)
        global.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = global.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!global.cancelAnimationFrame)
        global.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    //Function for horizontal scroll and elastic effect
    var elastic = function (t, b, c, d) {
        var ts = (t /= d) * t;
        var tc = ts * t;
        return b + c * (6 * tc + -9 * ts + 4 * t);
    }

    var stopAnimateLoop = function () {
        start = false;
    }

    var getScrollPosition = function () {
        if (document.documentElement.scrollTop == 0) {
            return document.body.scrollTop;
        } else {
            return document.documentElement.scrollTop;
        }
    };

    var animateLoop = function () {
        if (start) {
            //This is where magic happens horizontal scroll is set to zero.
            //But vertical scroll is function that takes's parammeters as seen
            //In http://robertpenner.com/easing/ big thanks for making it easy


            global.scrollTo(0, elastic(iteration, curentPosition, -curentPosition, 100));

            iteration++;
            //If you reched top well stop animating, thank you.
            if (getScrollPosition() <= 0) {
                stopAnimateLoop();
            }

        }
        //Yes it is easy as it looks
        requestAnimFrame(animateLoop);
    }

    Elevator.prototype = {

        elastic: function () {
            var len = this.length;
            // Here we are adding event listener for each element in node.
            //Notice len-- starts at the highest number and loops trough till' it gets to zero
            //Which means if there is 2 element start of len will be 2 then -- will turn it to 1.
            while (len--) {
                this[len].addEventListener('click', function () {
                    curentPosition = getScrollPosition();
                    start ^= true;
                    iteration = 0;
                    animateLoop();

                })
            }
            // If you want to chain methods, it's important to return this
            return this;
        },



    }

    Elevator.init = function (selector) {
        //Saving selector into node, node !== array thats why we later add node list into array
        this.node = document.querySelectorAll(selector);
        this.length = this.node.length;
        var count = 0;
        // Store NodeList objects in form array
        for (; count < this.length; count++) {
            this[count] = this.node[count];
        }

        return selector;
    }

    //Attach Elevator to window
    Elevator.init.prototype = Elevator.prototype;
    global.Elevator = Elevator;

}(this));
