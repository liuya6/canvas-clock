"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("./config"));
var CanvasClock = /** @class */ (function () {
    function CanvasClock(params) {
        var _this = this;
        var _a, _b, _c, _d;
        this.color = "#008899";
        this.timer = null;
        this.initialX = 0;
        this.initialY = 0;
        this.data = "";
        this.ballList = [];
        this.ball = {
            radius: 0,
        };
        this.el = document.querySelector(params.el);
        if (params.color)
            this.color = params.color;
        var canvas = document.createElement("canvas");
        canvas.width = (_a = this.el) === null || _a === void 0 ? void 0 : _a.offsetWidth;
        canvas.height = (_b = this.el) === null || _b === void 0 ? void 0 : _b.offsetHeight;
        (_c = this.el) === null || _c === void 0 ? void 0 : _c.appendChild(canvas);
        this.canvas = canvas;
        this.ball.radius = Number((_d = this.canvas) === null || _d === void 0 ? void 0 : _d.width) / 76 / 2;
        this.initialX = (this.canvas.width - this.ball.radius * 66 * 2) / 2;
        this.initialY = (this.canvas.height - this.ball.radius * 10 * 2) / 2;
        this.ctx = this.canvas.getContext("2d");
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.timer = setInterval(function () {
            _this.getNowData();
            _this.initCanvas();
        }, 50);
    }
    CanvasClock.getInstance = function (params) {
        if (!this.instance) {
            this.instance = new CanvasClock(params);
        }
        return this.instance;
    };
    CanvasClock.prototype.getNowData = function () {
        var date = new Date();
        var h = date.getHours() > 9 ? date.getHours() : "0" + date.getHours();
        var m = date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes();
        var s = date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds();
        var time = h + ":" + m + ":" + s;
        if (this.data !== time) {
            this.addBalls(time);
        }
        this.data = time;
    };
    CanvasClock.prototype.addBalls = function (time) {
        var _this = this;
        var y = 0;
        for (var k = 0; k < time.length; k++) {
            if (k > 0) {
                y = y + this.ball.radius * 2 * (k === 3 || k === 6 ? 6 : 9);
            }
            if (time[k] !== this.data[k]) {
                this.dateCycle(Number(time[k]), function (i, j) {
                    var ball = {
                        x: _this.ball.radius * 2 * j +
                            y +
                            j +
                            _this.ball.radius +
                            _this.initialX,
                        y: _this.ball.radius * 2 * i + _this.initialY + i,
                        vx: Math.pow(-1, Math.floor(Math.random() * 100)) * 5,
                        vy: Math.floor(Math.random() * 5),
                        g: Math.floor(Math.random() * 2) + 2,
                        color: "#" + Math.floor(Math.random() * 999999),
                    };
                    _this.ballList.push(ball);
                });
            }
        }
    };
    CanvasClock.prototype.upDateBall = function () {
        var _this = this;
        this.ballList.forEach(function (item, i) {
            var _a, _b, _c;
            item.x += item.vx;
            item.y += item.vy;
            item.vy += item.g;
            if (item.y > Number((_a = _this.canvas) === null || _a === void 0 ? void 0 : _a.height) - _this.ball.radius) {
                item.y = Number((_b = _this.canvas) === null || _b === void 0 ? void 0 : _b.height) - _this.ball.radius;
                item.vy = -Math.floor(item.vy * 0.5);
            }
            if (item.x < -_this.ball.radius * 2 ||
                item.x > Number((_c = _this.canvas) === null || _c === void 0 ? void 0 : _c.width)) {
                _this.ballList.splice(i, 1);
            }
        });
    };
    CanvasClock.prototype.initCanvas = function () {
        var _this = this;
        var _a, _b, _c;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, Number((_b = this.canvas) === null || _b === void 0 ? void 0 : _b.width), Number((_c = this.canvas) === null || _c === void 0 ? void 0 : _c.height));
        var y = 0;
        this.data.split("").forEach(function (item, i) {
            if (i > 0) {
                y = y + _this.ball.radius * 2 * (i === 3 || i === 6 ? 6 : 9);
            }
            var index = isNaN(Number(item)) ? config_1.default.length - 1 : Number(item);
            _this.dateCycle(index, function (i, j) {
                _this.draw(_this.ball.radius * 2 * j + y + j + _this.ball.radius + _this.initialX, _this.ball.radius * 2 * i + _this.initialY + i);
            });
        });
        this.ballList.forEach(function (item) {
            _this.draw(item.x, item.y, item.color);
        });
        this.upDateBall();
    };
    CanvasClock.prototype.draw = function (x, y, color) {
        var _a, _b, _c, _d, _e;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.beginPath();
        (_b = this.ctx) === null || _b === void 0 ? void 0 : _b.arc(x, y, this.ball.radius, 0, 2 * Math.PI);
        if ((_c = this.ctx) === null || _c === void 0 ? void 0 : _c.fillStyle) {
            this.ctx.fillStyle = color ? color : this.color;
        }
        (_d = this.ctx) === null || _d === void 0 ? void 0 : _d.fill();
        (_e = this.ctx) === null || _e === void 0 ? void 0 : _e.closePath();
    };
    CanvasClock.prototype.dateCycle = function (index, fn) {
        var ballArr = config_1.default[index];
        if (ballArr) {
            ballArr.forEach(function (item, i) {
                item.forEach(function (child, j) {
                    if (child) {
                        fn(i, j);
                    }
                });
            });
        }
    };
    return CanvasClock;
}());
exports.default = CanvasClock;
