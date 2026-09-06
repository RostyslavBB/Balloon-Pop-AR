@component
export class GameManager extends BaseScriptComponent
{
    @input
    @allowUndefined
    scoreText: Text | undefined;

    @input
    @allowUndefined
    livesText: Text | undefined;

    @input
    @allowUndefined
    gameOverRoot: SceneObject | undefined;

    @input
    startingLives: number = 3;

    private score: number = 0;
    private lives: number = 3;
    private gameIsOver: boolean = false;

    private static instance: GameManager | null = null;

    onAwake()
    {
        GameManager.instance = this;
        this.restart();
    }

    static getInstance(): GameManager | null
    {
        return GameManager.instance;
    }

    isGameOver(): boolean
    {
        return this.gameIsOver;
    }

    addScore(points: number)
    {
        if (this.gameIsOver) return;

        this.score += points;
        this.updateScoreText();
    }

    loseLife()
    {
        if (this.gameIsOver) return;

        this.lives = Math.max(0, this.lives - 1);
        this.updateLivesText();

        if (this.lives <= 0)
        {
            this.gameOver();
        }
    }

    restart()
    {
        this.score = 0;
        this.lives = this.startingLives;
        this.gameIsOver = false;

        if (this.gameOverRoot) this.gameOverRoot.enabled = false;

        this.updateScoreText();
        this.updateLivesText();
    }

    updateScoreText()
    {
        if (this.scoreText)
        {
            this.scoreText.text = "Score: " + this.score;
        }
    }

    updateLivesText()
    {
        if (this.livesText)
        {
            this.livesText.text = "Lives: " + this.lives;
        }
    }

    private gameOver()
    {
        if (this.gameIsOver) return;

        this.gameIsOver = true;

        if (this.gameOverRoot) this.gameOverRoot.enabled = true;

        print("Game Over! Final Score: " + this.score);
    }
}
