import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  HIGH_SCORE_KEY = 'highScore';
  stageChange = true;

  currentStage = 1000;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  // update(deltaTime) {
  //   this.score += deltaTime * 0.001;
  //   // 점수가 100점 이상이 될 시 서버에 메세지 전송
  //   if (Math.floor(this.score) === 10 && this.stageChange) {
  //     this.stageChange = false;
  //     sendEvent(11, { currentStage: 1000, targetStage: 1001 });
  //   }
  // }
  update(deltaTime) {
    this.score += (deltaTime + Math.floor(deltaTime / 100)) * 0.01;
    if (Math.floor(this.score) === 100 && this.stageChange) {
      this.stageChange = false;
      const targetStage = currentStage + 1;
      sendEvent(11, {
        currentStage: this.currentStage,
        targetStage: targetStage,
      });
      this.currentStage = targetStage;
    }
  }

  getItem(itemId) {
    // 아이템 획득시 점수 변화
    this.score += Math.floor(this.score / 2);
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;
