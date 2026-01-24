import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface OnboardingQuestion {
    id: string;
    dimension: string;
    question_key: string;
    level: 'Bronze' | 'Silver' | 'Gold' | 'TIER_1' | 'TIER_2' | 'TIER_3';
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
     * Get all questions for a specific dimension
     */
    async getQuestionsByDimension(dimension: string): Promise<OnboardingQuestion[]> {
        const { data, error } = await this.supabase.supabase
            .from('onboarding_questions')
            .select('*')
            .eq('angle', dimension)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get all questions (not filtered by angle)
     */
    async getAllQuestions(): Promise<OnboardingQuestion[]> {
        const { data, error } = await this.supabase.supabase
            .from('onboarding_questions')
            .select('*')
            .order('angle', { ascending: true })
            .order('order_index', { ascending: true });

        if (error) {
            console.error('Error fetching all questions:', error);
            throw error;
        }

        return data || [];
    }

    /**
     * Get user answers for a specific property and dimension
     */
    async getAnswers(propertyId: string, dimension: string): Promise<Map<string, OnboardingAnswer>> {
        const user = await this.supabase.supabase.auth.getUser();
        if (!user.data.user) {
            throw new Error('User not authenticated');
        }

        // First get all questions for this dimension
        const questions = await this.getQuestionsByDimension(dimension);
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
     * Get completion percentage for a dimension
     */
    async getDimensionCompletion(propertyId: string, dimension: string): Promise<number> {
        const questions = await this.getQuestionsByDimension(dimension);
        const answers = await this.getAnswers(propertyId, dimension);

        if (questions.length === 0) return 0;

        const answeredCount = questions.filter(q => answers.has(q.id) && answers.get(q.id)?.answer === true).length;
        return Math.round((answeredCount / questions.length) * 100);
    }

    /**
     * Get maturity level for a dimension based on tiers
     */
    async getMaturityLevel(propertyId: string, dimension: string): Promise<{ level: 'Low' | 'Medium' | 'High', color: string, description: string }> {
        const questions = await this.getQuestionsByDimension(dimension);
        const answers = await this.getAnswers(propertyId, dimension);

        if (questions.length === 0) {
            return { level: 'Low', color: 'bg-rose-500', description: 'MATURITY.LowDesc' };
        }

        const bronzeQuestions = questions.filter(q => q.level === 'Bronze' || q.level === 'TIER_1');
        const silverQuestions = questions.filter(q => q.level === 'Silver' || q.level === 'TIER_2');
        const goldQuestions = questions.filter(q => q.level === 'Gold' || q.level === 'TIER_3');

        const getCompletion = (qs: OnboardingQuestion[]) => {
            if (qs.length === 0) return 100;
            const answered = qs.filter(q => answers.has(q.id) && answers.get(q.id)?.answer === true).length;
            return (answered / qs.length) * 100;
        };

        const bronzeComp = getCompletion(bronzeQuestions);
        const silverComp = getCompletion(silverQuestions);
        const goldComp = getCompletion(goldQuestions);

        // Logic:
        // High: Bronze >= 70% AND Silver >= 70% AND Gold >= 50%
        // Medium: Bronze >= 70% AND Silver < 70%
        // Low: Bronze < 70%

        if (bronzeComp >= 70 && silverComp >= 70 && goldComp >= 50) {
            return { level: 'High', color: 'bg-emerald-500', description: 'MATURITY.HighDesc' };
        } else if (bronzeComp >= 70) {
            return { level: 'Medium', color: 'bg-amber-500', description: 'MATURITY.MediumDesc' };
        } else {
            return { level: 'Low', color: 'bg-rose-500', description: 'MATURITY.LowDesc' };
        }
    }
}
