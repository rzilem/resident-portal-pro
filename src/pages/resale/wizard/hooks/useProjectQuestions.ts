
import { useState, useCallback } from 'react';
import { PROJECT_QUESTIONS } from '../data/project-questions';
import { Question } from '../types';

export const useProjectQuestions = () => {
  const [questions] = useState<Question[]>(
    Object.values(PROJECT_QUESTIONS).flat()
  );

  const getVisibleQuestionCount = useCallback((answers: Record<string, any>) => {
    return questions.filter(question => {
      if (!question.conditionalShow) return true;
      return question.conditionalShow(answers);
    }).length;
  }, [questions]);

  return {
    questions,
    getVisibleQuestionCount
  };
};
