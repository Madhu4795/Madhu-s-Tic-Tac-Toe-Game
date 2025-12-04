import { GoogleGenAI, Type } from "@google/genai";
import { SquareValue, AIMoveResponse, Difficulty, BoardSize } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiMove = async (
  board: SquareValue[],
  boardSize: BoardSize,
  aiPlayer: 'O' | 'X' = 'O',
  difficulty: Difficulty = 'HARD'
): Promise<AIMoveResponse> => {
  try {
    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (availableMoves.length === 0) {
      throw new Error("No moves available");
    }

    let strategyPrompt = "";
    let temperature = 0.3;

    switch (difficulty) {
      case 'EASY':
        strategyPrompt = `
          You are playing the role of a distracted novice player. 
          Do NOT try to play optimally. 
          Do NOT try to block the opponent.
          Do NOT try to win.
          Pick a move almost at random from the available spots.
          Your reasoning should be silly, distracted, or based on "vibes" rather than strategy.
        `;
        temperature = 1.0; // High randomness
        break;
      case 'MEDIUM':
        strategyPrompt = `
          You are playing as a casual player. 
          You want to win, but you are not thinking too hard.
          Block immediate winning moves by the opponent if you see them.
          Take a winning move if you have one.
          Otherwise, play somewhat randomly or make a basic move. 
          Do not plan ahead for complex traps.
          Your reasoning should be casual and friendly.
        `;
        temperature = 0.6; // Moderate randomness
        break;
      case 'HARD':
      default:
        strategyPrompt = `
          You are an expert Tic-Tac-Toe strategist.
          Your goal is to win. 
          1. If you can win immediately, take that move.
          2. If the opponent is about to win, you MUST block them.
          3. If neither, play the optimal strategy to set up a future win or force a draw.
          Your reasoning should be tactical, witty, or slightly arrogant.
        `;
        temperature = 0.1; // Low randomness for optimal play
        break;
    }

    // Construct a clear prompt for the model
    const prompt = `
      You are playing a game of Tic-Tac-Toe on a ${boardSize}x${boardSize} grid.
      Win Condition: Connect ${boardSize} in a row.
      Indices range from 0 to ${boardSize * boardSize - 1}.
      
      You are player '${aiPlayer}'. 
      The opponent is '${aiPlayer === 'O' ? 'X' : 'O'}'.
      
      The current board state is represented by this array (indices 0-${boardSize * boardSize - 1}):
      ${JSON.stringify(board)}
      
      'null' indicates an empty square.
      
      STRATEGY INSTRUCTIONS:
      ${strategyPrompt}
      
      Return the index (0-${boardSize * boardSize - 1}) of your chosen move. 
      Also provide a very short sentence explaining your move (max 10 words).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            move: {
              type: Type.INTEGER,
              description: `The board index (0-${boardSize * boardSize - 1}) where you want to place your mark.`,
            },
            reasoning: {
              type: Type.STRING,
              description: "A short explanation for the move.",
            },
          },
          required: ["move", "reasoning"],
        },
        temperature: temperature,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
       throw new Error("Empty response from AI");
    }

    const parsed = JSON.parse(jsonText) as AIMoveResponse;

    // Validate move
    if (!availableMoves.includes(parsed.move)) {
      console.warn("AI attempted invalid move:", parsed.move, "Available:", availableMoves);
      // Fallback: Pick random valid move
      const randomFallback = availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
      return {
        move: randomFallback,
        reasoning: "I got a bit confused, so I just picked a spot!",
      };
    }

    return parsed;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Graceful fallback to random move
    const availableMoves = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
      
    if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)] as number;
        return {
            move: randomMove,
            reasoning: "My connection is fuzzy, so I'm playing blindly!",
        };
    }
    throw error;
  }
};