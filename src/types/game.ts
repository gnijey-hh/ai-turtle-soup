export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Story {
  id: string
  title: string
  difficulty: Difficulty
  surface: string
  bottom: string
}

export type TMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export type TGameStatus = 'playing' | 'ended' | 'abandoned'
