import * as yup from 'yup';
import {
  MAX_MCQ_EXPLANATION_LENGTH,
  MAX_MCQ_QUESTION_LENGTH,
  MIN_MCQ_QUESTION_LENGTH,
} from '@/constants/validation-vars';

export const getNewMcqSchema = (t: (key: string, values?: Record<string, any>) => string) => {
  return yup.object({
    question: yup.string()
      .min(MIN_MCQ_QUESTION_LENGTH, t('questionTooShort', { min: MIN_MCQ_QUESTION_LENGTH }) )
      .max(MAX_MCQ_QUESTION_LENGTH, t('questionTooLong', { max: MAX_MCQ_QUESTION_LENGTH }) )
      .required(t('questionRequired')),
    choices: yup.array()
      .of(
        yup.object({
          text: yup.string()
            .trim()
            .required(t('choiceTextRequired')),
          isCorrect: yup.boolean().required(),
        })
      )
      .min(2, t('choicesRequired'))
      .test(
        'at-least-one-correct',
        t('atLeastOneCorrectChoice'),
        (choices) => {
          if (!Array.isArray(choices)) return false;
          return choices.some(choice => choice.isCorrect === true);
        }
      )
      .test(
        'unique-choices',
        t('choicesMustBeUnique'),
        (choices) => {
          if (!Array.isArray(choices)) return true;
          const texts = choices.map(choice => (choice?.text ?? '').trim());
          return texts.length === new Set(texts).size;
        }
      ),
    solutionExplanation: yup.string()
      .max(MAX_MCQ_EXPLANATION_LENGTH, t('solutionExplanationTooLong', { max: MAX_MCQ_EXPLANATION_LENGTH }) ),
  });
};
