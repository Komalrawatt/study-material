import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DEMO_TESTS, DEMO_QUESTIONS } from "@/utils/constants";
import { formatTime, calculateScore } from "@/utils/helpers";
import { submitTest } from "@/store/slices/mockTestSlice";

export default function TestRunnerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const test = DEMO_TESTS.find((t) => t.id === id);
  const questions = DEMO_QUESTIONS[id] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((test?.duration || 30) * 60);
  const [isFinished, setIsFinished] = useState(false);

  // Timer
  useEffect(() => {
    if (isFinished || !test) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); handleFinish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, test]);

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinish = useCallback(async () => {
    if (isFinished) return;
    setIsFinished(true);

    let correct = 0;
    questions.forEach((q) => { if (answers[q.id] === q.correctAnswer) correct++; });
    const score = calculateScore(correct, questions.length);

    const timeTaken = (test?.duration || 30) * 60 - timeLeft;
    const resultPayload = {
      userId: user?.uid || "",
      testId: test?.id,
      testTitle: test?.title || "",
      score,
      correctAnswers: correct,
      totalQuestions: questions.length,
      timeTaken,
      answers,
      submittedAt: Date.now(),
    };

    if (user?.uid) {
      try {
        await dispatch(submitTest(resultPayload)).unwrap();
      } catch (error) {
        console.error("Failed to save test result:", error);
      }
    }

    navigate(`/mock-tests/${id}/result`, {
      state: {
        score,
        correct,
        total: questions.length,
        answers,
        questions,
        testTitle: test?.title,
        timeTaken,
      },
    });
  }, [answers, questions, navigate, id, test, timeLeft, isFinished, dispatch, user?.uid]);

  if (!test || questions.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Test not found</h2>
        <Button onClick={() => navigate("/mock-tests")} variant="outline">Back to Tests</Button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-['Outfit']">{test.title}</h1>
          <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`gap-1 text-sm ${timeLeft < 60 ? "text-red-400 border-red-400/50 animate-pulse" : "text-muted-foreground"}`}>
            <Clock className="w-4 h-4" />{formatTime(timeLeft)}
          </Badge>
        </div>
      </div>

      <Progress value={progress} className="mb-6 h-2" />

      {/* Question Card */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-6">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-start gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {currentIndex + 1}
            </span>
            <h2 className="text-lg font-medium leading-relaxed">{currentQ.questionText}</h2>
          </div>
          <div className="space-y-3">
            {currentQ.options.map((option, i) => {
              const isSelected = answers[currentQ.id] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQ.id, i)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 text-foreground shadow-sm"
                      : "border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-muted-foreground/30 text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="gap-2">
          <ChevronLeft className="w-4 h-4" />Previous
        </Button>
        <div className="flex gap-1 overflow-auto max-w-xs">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all shrink-0 ${
                i === currentIndex
                  ? "bg-emerald-500 text-white"
                  : answers[q.id] !== undefined
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {currentIndex === questions.length - 1 ? (
          <Button onClick={handleFinish} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white gap-2">
            <Flag className="w-4 h-4" />Finish ({answeredCount}/{questions.length})
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))} className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            Next<ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
