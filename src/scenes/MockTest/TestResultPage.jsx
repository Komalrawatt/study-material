import { useLocation, useNavigate, Link } from "react-router-dom";
import { Trophy, CheckCircle2, XCircle, Clock, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getGrade, formatTime } from "@/utils/helpers";

export default function TestResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state;

  if (!result) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">No result data</h2>
        <Button onClick={() => navigate("/mock-tests")} variant="outline">Back to Tests</Button>
      </div>
    );
  }

  const { score, correct, total, answers, questions, testTitle, timeTaken } = result;
  const grade = getGrade(score);
  const incorrect = total - correct;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Score Card */}
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-8 text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" style={{ color: grade.color }} />
          <h1 className="text-3xl font-bold font-['Outfit'] mb-2">{testTitle}</h1>
          <p className="text-muted-foreground">Test Completed!</p>
        </div>
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={grade.color} strokeWidth="10"
                  strokeDasharray={`${(score / 100) * 314} 314`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 1s ease-in-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-['Outfit']" style={{ color: grade.color }}>{score}%</span>
                <span className="text-sm text-muted-foreground">Grade: {grade.grade}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">{correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <XCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-400">{incorrect}</p>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-400">{formatTime(timeTaken)}</p>
              <p className="text-xs text-muted-foreground">Time Taken</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/mock-tests")} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />Take Another Test
            </Button>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white gap-2">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Question Review */}
      <h2 className="text-xl font-bold font-['Outfit'] mb-4">Question Review</h2>
      <div className="space-y-4">
        {questions?.map((q, i) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          return (
            <Card key={q.id} className={`border-border/50 ${isCorrect ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <Badge variant={isCorrect ? "default" : "destructive"} className="shrink-0">
                    Q{i + 1}
                  </Badge>
                  <p className="text-sm font-medium">{q.questionText}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={`text-xs p-2 rounded-lg ${
                      oi === q.correctAnswer ? "bg-green-500/10 text-green-400 border border-green-500/30" :
                      oi === userAnswer && oi !== q.correctAnswer ? "bg-red-500/10 text-red-400 border border-red-500/30" :
                      "bg-muted/30 text-muted-foreground"
                    }`}>
                      <span className="font-bold mr-1">{String.fromCharCode(65 + oi)}.</span>{opt}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                  <span className="font-semibold">Explanation:</span> {q.explanation}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
