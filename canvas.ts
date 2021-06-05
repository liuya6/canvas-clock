import date from "./config";

interface canvasConfig {
  el: string;
  color?: string;
}

interface ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  color: string;
}

class CanvasClock {
  private readonly el: HTMLElement | null;
  private readonly color: string = "#008899";
  private readonly timer: NodeJS.Timeout | null = null;
  private readonly initialX: number = 0;
  private readonly initialY: number = 0;

  private canvas: HTMLCanvasElement | undefined;

  private ctx;

  private static instance: CanvasClock | undefined;

  private data: string = "";

  private ballList: ball[] = [];

  private ball = {
    radius: 0,
  };

  static getInstance(params: canvasConfig) {
    if (!this.instance) {
      this.instance = new CanvasClock(params);
    }
    return this.instance;
  }

  constructor(params: canvasConfig) {
    this.el = document.querySelector(params.el);
    if (params.color) this.color = params.color;
    let canvas = document.createElement("canvas");
    canvas.width = this.el?.offsetWidth as number;
    canvas.height = this.el?.offsetHeight as number;
    this.el?.appendChild(canvas);
    this.canvas = canvas;
    this.ball.radius = Number(this.canvas?.width) / 76 / 2;
    this.initialX = (this.canvas.width - this.ball.radius * 66 * 2) / 2;
    this.initialY = (this.canvas.height - this.ball.radius * 10 * 2) / 2;
    this.ctx = this.canvas.getContext("2d");
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      this.getNowData();
      this.initCanvas();
    }, 50);
  }

  getNowData() {
    let date = new Date();
    let h = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    let m = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    let s = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    let time = `${h}:${m}:${s}`;

    if (this.data !== time) {
      this.addBalls(time);
    }

    this.data = time;
  }

  addBalls(time: string) {
    let y = 0;
    for (let k = 0; k < time.length; k++) {
      if (k > 0) {
        y = y + this.ball.radius * 2 * (k === 3 || k === 6 ? 6 : 9);
      }
      if (time[k] !== this.data[k]) {
        this.dateCycle(Number(time[k]), (i: number, j: number) => {
          let ball = {
            x:
              this.ball.radius * 2 * j +
              y +
              j +
              this.ball.radius +
              this.initialX,
            y: this.ball.radius * 2 * i + this.initialY + i,
            vx: Math.pow(-1, Math.floor(Math.random() * 100)) * 5,
            vy: Math.floor(Math.random() * 5),
            g: Math.floor(Math.random() * 2) + 2,
            color: `#${Math.floor(Math.random() * 999999)}`,
          };
          this.ballList.push(ball);
        });
      }
    }
  }

  upDateBall() {
    this.ballList.forEach((item: ball, i: number) => {
      item.x += item.vx;
      item.y += item.vy;
      item.vy += item.g;

      if (item.y > Number(this.canvas?.height) - this.ball.radius) {
        item.y = Number(this.canvas?.height) - this.ball.radius;
        item.vy = -Math.floor(item.vy * 0.5);
      }
      if (
        item.x < -this.ball.radius * 2 ||
        item.x > Number(this.canvas?.width)
      ) {
        this.ballList.splice(i, 1);
      }
    });
  }

  initCanvas() {
    this.ctx?.clearRect(
      0,
      0,
      Number(this.canvas?.width),
      Number(this.canvas?.height)
    );
    let y = 0;
    this.data.split("").forEach((item: string, i: number) => {
      if (i > 0) {
        y = y + this.ball.radius * 2 * (i === 3 || i === 6 ? 6 : 9);
      }
      let index = isNaN(Number(item)) ? date.length - 1 : Number(item);
      this.dateCycle(index, (i: number, j: number) => {
        this.draw(
          this.ball.radius * 2 * j + y + j + this.ball.radius + this.initialX,
          this.ball.radius * 2 * i + this.initialY + i
        );
      });
    });
    this.ballList.forEach((item) => {
      this.draw(item.x, item.y, item.color);
    });
    this.upDateBall();
  }

  draw(x: number, y: number, color?: string) {
    this.ctx?.beginPath();
    this.ctx?.arc(x, y, this.ball.radius, 0, 2 * Math.PI);
    if (this.ctx?.fillStyle) {
      this.ctx.fillStyle = color ? color : this.color;
    }
    this.ctx?.fill();
    this.ctx?.closePath();
  }

  dateCycle(index: number, fn: (i: number, j: number) => void) {
    let ballArr: number[][] = date[index];
    if (ballArr) {
      ballArr.forEach((item: number[], i: number) => {
        item.forEach((child: number, j: number) => {
          if (child) {
            fn(i, j);
          }
        });
      });
    }
  }
}

export default CanvasClock;
