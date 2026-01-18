import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface OnboardingQuestion {
    id: string;
    angle: string;
    question_key: string;
    level: 'Bronze' | 'Silver' | 'Gold';
    order_index: number;
    has_sub_question: boolean;
    sub_question_config?: {
        id: string;
        label_key: string;
        type: 'text' | 'url' | 'number';
        placeholder: string;
    };
}

export interface OnboardingAnswer {
    id?: string;
    user_id: string;
    property_id: string;
    question_id: string;
    answer: boolean;
    sub_answer?: string;
    updated_at?: string;
}

@Injectable({
    providedIn: 'root'
})
export class OnboardingService {
    private supabase = inject(SupabaseService);

    /**
     * Get all questions for a specific angle
     */
    async getQuestionsByAngle(angle: string): Promise<OnboardingQuestion[]> {
        const { data, error } = await this.supabase.supabase
            .from('onboarding_questions')
            .select('*')
            .eq('angle', angle)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get user answers for a specific property and angle
     */
    async getAnswers(propertyId: string, angle: string): Promise<Map<string, OnboardingAnswer>> {
        const user = await this.supabase.supabase.auth.getUser();
        if (!user.data.user) {
            throw new Error('User not authenticated');
        }

        // First get all questions for this angle
        const questions = await this.getQuestionsByAngle(angle);
        const questionIds = questions.map(q => q.id);

        // Then get answers for these questions
        const { data, error } = await this.supabase.supabase
            .from('onboarding_answers')
            .select('*')
            .eq('user_id', user.data.user.id)
            .eq('property_id', propertyId)
            .in('question_id', questionIds);

        if (error) {
            console.error('Error fetching answers:', error);
            throw error;
        }

        // Convert to Map for easy lookup by question_id
        const answersMap = new Map<string, OnboardingAnswer>();
        data?.forEach(answer => {
            answersMap.set(answer.question_id, answer);
        });

        return answersMap;
    }

    /**
     * Save or update user answers
     */
    async saveAnswers(propertyId: string, answers: { question_id: string; answer: boolean; sub_answer?: string }[]): Promise<void> {
        const user = await this.supabase.supabase.auth.getUser();
        if (!user.data.user) {
            throw new Error('User not authenticated');
        }

        const userId = user.data.user.id;

        // Upsert answers (insert or update)
        const answersToSave = answers.map(a => ({
            user_id: userId,
            property_id: propertyId,
            question_id: a.question_id,
            answer: a.answer,
            sub_answer: a.sub_answer || null,
            updated_at: new Date().toISOString()
        }));

        const { data, error } = await this.supabase.supabase
            .from('onboarding_answers')
            .upsert(answersToSave, {
                onConflict: 'user_id,property_id,question_id'
            });

        if (error) {
            console.error('Error saving answers:', error);
            throw error;
        }
    }

    /**
     * Get completion percentage for an angle
     */
    async getAngleCompletion(propertyId: string, angle: string): Promise<number> {
        const questions = await this.getQuestionsByAngle(angle);
        const answers = await this.getAnswers(propertyId, angle);

        if (questions.length === 0) return 0;

        const answeredCount = questions.filter(q => answers.has(q.id) && answers.get(q.id)?.answer === true).length;
        return Math.round((answeredCount / questions.length) * 100);
    }
}
