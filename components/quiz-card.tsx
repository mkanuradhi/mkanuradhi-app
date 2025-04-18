"use client";
import React from 'react';
import { Button, Card } from "react-bootstrap";
import { useLocale, useTranslations } from 'next-intl';
import Quiz from '@/interfaces/i-quiz';
import { capitalizeLang } from '@/utils/common-utils';
import { useRouter } from '@/i18n/routing';

const baseTPath = 'components.QuizCard';

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const t = useTranslations(baseTPath);
  const locale = useLocale();
  const router = useRouter();

  const langSuffix = capitalizeLang(locale);
  const title = quiz[`title${langSuffix}` as keyof Quiz] as string;

  return (
    <Card className="my-3 shadow">
      <Card.Body>
        <Card.Title>
          { title }
        </Card.Title>
        <hr />
        {quiz.duration > 0 && (
          <Card.Text>
            <b className="me-2">{t('duration')}:</b>{ t.rich('numMinutes', {mins: quiz.duration}) }
          </Card.Text>
        )}
        {quiz.mcqs && (
          <Card.Text>
            <b className="me-2">{t('numOfQuestions')}:</b>{quiz.mcqs.length}
          </Card.Text>
        )}
        <Button onClick={() => router.push(`quizzes/${quiz.id}`)}>{t('start')}</Button>
      </Card.Body>
    </Card>
  );
};

export default QuizCard;