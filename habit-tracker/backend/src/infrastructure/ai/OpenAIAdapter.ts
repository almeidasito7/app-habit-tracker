import OpenAI from 'openai';
import { IAIService, ChatRequest, ChatResponse, HabitSuggestion, ScheduleItem } from '../../application/ports/IAIService';

export class OpenAIAdapter implements IAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const systemPrompt = `You are a helpful habit tracking AI assistant. You help users build better habits, achieve their goals, and maintain streaks. 
    ${request.userContext?.habits ? `User's current habits: ${request.userContext.habits.join(', ')}` : ''}
    ${request.userContext?.goals ? `User's goals: ${request.userContext.goals.join(', ')}` : ''}
    ${request.userContext?.streak ? `Current streak: ${request.userContext.streak} days` : ''}
    
    Be encouraging, specific, and actionable. Keep responses concise but helpful.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...request.messages.slice(-10).map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: request.userMessage },
    ];

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.';
    return { message };
  }

  async suggestHabits(goals: string[], currentHabits: string[]): Promise<HabitSuggestion[]> {
    const prompt = `Based on these goals: ${goals.join(', ')}
    And current habits: ${currentHabits.join(', ')}
    
    Suggest 5 new habits that would help achieve these goals. Return a JSON array with objects containing:
    - name: habit name (short, max 30 chars)
    - emoji: single emoji
    - category: one of (learning, working, health, others, fun, evolution)
    - reason: brief explanation (max 50 chars)
    
    Return ONLY the JSON array, no other text.`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.8,
    });

    try {
      const content = completion.choices[0]?.message?.content || '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      return [];
    }
  }

  async generateSchedule(habits: string[], preferences: Record<string, unknown>): Promise<ScheduleItem[]> {
    const prompt = `Create a daily schedule for these habits: ${habits.join(', ')}
    Preferences: ${JSON.stringify(preferences)}
    
    Return a JSON array with schedule items:
    - time: HH:MM format
    - activity: activity name
    - duration: minutes
    
    Return ONLY the JSON array.`;

    const completion = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 400,
      temperature: 0.7,
    });

    try {
      const content = completion.choices[0]?.message?.content || '[]';
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      return [];
    }
  }
}
