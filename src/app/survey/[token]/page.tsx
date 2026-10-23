import { SurveyContainer } from '@/components/survey/SurveyContainer';

interface SurveyPageProps {
  params: {
    token: string;
  };
}

export default function SurveyPage({ params }: SurveyPageProps) {
  const token = params.token;

  return (
    <main className="min-h-screen py-6 px-4">
      <SurveyContainer token={token} />
    </main>
  );
}
