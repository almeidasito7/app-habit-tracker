import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { supabase } from './infrastructure/database/supabase/client';

// Repositories
import { SupabaseHabitRepository } from './infrastructure/database/repositories/HabitRepository';
import { SupabaseOffensiveRepository } from './infrastructure/database/repositories/OffensiveRepository';
import { SupabaseGoalRepository } from './infrastructure/database/repositories/GoalRepository';
import { SupabaseUserRepository } from './infrastructure/database/repositories/UserRepository';
import { SupabaseChatRepository } from './infrastructure/database/repositories/ChatRepository';

// Adapters
import { OpenAIAdapter } from './infrastructure/ai/OpenAIAdapter';
import { StripeAdapter } from './infrastructure/payment/StripeAdapter';

// Use Cases
import { GetHabitsUseCase } from './application/use-cases/habits/GetHabitsUseCase';
import { CreateHabitUseCase } from './application/use-cases/habits/CreateHabitUseCase';
import { UpdateHabitUseCase } from './application/use-cases/habits/UpdateHabitUseCase';
import { DeleteHabitUseCase } from './application/use-cases/habits/DeleteHabitUseCase';
import { CompleteHabitUseCase } from './application/use-cases/habits/CompleteHabitUseCase';
import { GetStreakUseCase } from './application/use-cases/habits/GetStreakUseCase';
import { GetGoalsUseCase, CreateGoalUseCase, UpdateGoalUseCase, DeleteGoalUseCase } from './application/use-cases/goals/GoalUseCases';
import { GetProfileUseCase, UpdateProfileUseCase } from './application/use-cases/auth/AuthUseCases';
import { ChatUseCase, SuggestHabitsUseCase, GenerateScheduleUseCase } from './application/use-cases/ai/AIUseCases';

// Controllers
import { HabitController } from './infrastructure/http/controllers/HabitController';
import { GoalController } from './infrastructure/http/controllers/GoalController';
import { AIController } from './infrastructure/http/controllers/AIController';
import { ProfileController } from './infrastructure/http/controllers/ProfileController';
import { PaymentController } from './infrastructure/http/controllers/PaymentController';

import { createRoutes } from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Stripe webhook needs raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Standard middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// DI - Wire dependencies
const habitRepository = new SupabaseHabitRepository(supabase);
const offensiveRepository = new SupabaseOffensiveRepository(supabase);
const goalRepository = new SupabaseGoalRepository(supabase);
const userRepository = new SupabaseUserRepository(supabase);
const chatRepository = new SupabaseChatRepository(supabase);

const aiService = new OpenAIAdapter();
const paymentService = new StripeAdapter(userRepository);

const habitController = new HabitController(
  new GetHabitsUseCase(habitRepository),
  new CreateHabitUseCase(habitRepository),
  new UpdateHabitUseCase(habitRepository),
  new DeleteHabitUseCase(habitRepository),
  new CompleteHabitUseCase(habitRepository, offensiveRepository),
  new GetStreakUseCase(habitRepository, offensiveRepository),
  offensiveRepository
);

const goalController = new GoalController(
  new GetGoalsUseCase(goalRepository),
  new CreateGoalUseCase(goalRepository),
  new UpdateGoalUseCase(goalRepository),
  new DeleteGoalUseCase(goalRepository)
);

const aiController = new AIController(
  new ChatUseCase(aiService, chatRepository),
  new SuggestHabitsUseCase(aiService),
  new GenerateScheduleUseCase(aiService)
);

const profileController = new ProfileController(
  new GetProfileUseCase(userRepository),
  new UpdateProfileUseCase(userRepository)
);

const paymentController = new PaymentController(paymentService);

// Routes
app.use('/api', createRoutes(
  habitController,
  goalController,
  aiController,
  profileController,
  paymentController
));

// Error handler
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Habit Tracker API running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
