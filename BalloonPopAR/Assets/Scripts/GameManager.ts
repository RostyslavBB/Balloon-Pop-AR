@component
export class GameManager extends BaseScriptComponent 
{
    @input
    scoreText: Text | null = null;

    @input
    livesText: Text | null = null;

    private score: number = 0;
    private lives: number = 3;

    private static instance: GameManager | null = null;

    onAwake() 
    {
        GameManager.instance = this;
        this.updateScoreText();
        this.updateLivesText();
    }

    static getInstance(): GameManager | null
    {
        return GameManager.instance;
    }

    addScore(points: number)
    {
        this.score += points;
        this.updateScoreText();
    }

    loseLife()
    {
        this.lives--;

        this.updateLivesText();

        if(this.lives <= 0)
        {
            this.gameOver();
        }
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
        print("Game Over! Final Score: " + this.score);
    }
}
