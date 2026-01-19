import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface TrainingModule {
    id: string;
    question_id: string;
    title_key: string;
    description_key: string;
    created_at: string;
}

export interface TrainingMaterial {
    id: string;
    module_id: string;
    language: string;
    pdf_url?: string;
    flipbook_url?: string;
    video_url?: string;
    audio_url?: string;
}

export interface Quiz {
    id: string;
    module_id: string;
    title_key: string;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question_text_key: string;
    order_index: number;
    options: QuizOption[];
}

export interface QuizOption {
    id: string;
    question_id: string;
    option_text_key: string;
    is_correct: boolean;
}

export interface UserTrainingProgress {
    module_id: string;
    status: 'not_started' | 'in_progress' | 'completed';
    last_score?: number;
    completed_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class TrainingService {
    private supabase = inject(SupabaseService);

    /**
     * Get all training modules
     */
    async getModules(): Promise<TrainingModule[]> {
        const { data, error } = await this.supabase.supabase
            .from('training_modules')
            .select('*');

        if (error) throw error;
        return data || [];
    }

    /**
     * Get training material for a module and language
     */
    async getMaterial(moduleId: string, language: string): Promise<TrainingMaterial | null> {
        const { data, error } = await this.supabase.supabase
            .from('training_materials')
            .select('*')
            .eq('module_id', moduleId)
            .eq('language', language)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows found"
        return data;
    }

    /**
     * Get quiz for a module, including questions and options
     */
    async getQuiz(moduleId: string): Promise<(Quiz & { questions: QuizQuestion[] }) | null> {
        // 1. Get Quiz
        const { data: quiz, error: quizError } = await this.supabase.supabase
            .from('quizzes')
            .select('*')
            .eq('module_id', moduleId)
            .single();

        if (quizError && quizError.code !== 'PGRST116') throw quizError;
        if (!quiz) return null;

        // 2. Get Questions
        const { data: questions, error: questionsError } = await this.supabase.supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quiz.id)
            .order('order_index', { ascending: true });

        if (questionsError) throw questionsError;

        // 3. Get Options for all questions
        const questionIds = questions.map(q => q.id);
        const { data: options, error: optionsError } = await this.supabase.supabase
            .from('quiz_options')
            .select('*')
            .in('question_id', questionIds);

        if (optionsError) throw optionsError;

        // Map options back to questions
        const questionsWithExtras = questions.map(q => ({
            ...q,
            options: options.filter(o => o.question_id === q.id)
        }));

        return { ...quiz, questions: questionsWithExtras };
    }

    /**
     * Get user progress for all modules
     */
    async getUserProgress(): Promise<Map<string, UserTrainingProgress>> {
        const user = await this.supabase.supabase.auth.getUser();
        if (!user.data.user) throw new Error('User not authenticated');

        const { data, error } = await this.supabase.supabase
            .from('user_training_progress')
            .select('*')
            .eq('user_id', user.data.user.id);

        if (error) throw error;

        const progressMap = new Map<string, UserTrainingProgress>();
        data?.forEach(p => {
            progressMap.set(p.module_id, p);
        });

        return progressMap;
    }

    /**
     * Update user training progress
     */
    async updateProgress(moduleId: string, status: 'in_progress' | 'completed', score?: number): Promise<void> {
        const user = await this.supabase.supabase.auth.getUser();
        if (!user.data.user) throw new Error('User not authenticated');

        const progress: any = {
            user_id: user.data.user.id,
            module_id: moduleId,
            status,
            updated_at: new Date().toISOString()
        };

        if (score !== undefined) progress.last_score = score;
        if (status === 'completed') progress.completed_at = new Date().toISOString();

        const { error } = await this.supabase.supabase
            .from('user_training_progress')
            .upsert(progress, { onConflict: 'user_id,module_id' });

        if (error) throw error;
    }
}
