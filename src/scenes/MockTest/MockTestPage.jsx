import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardCheck, Clock, HelpCircle, ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DEMO_TESTS, DEMO_COURSES } from "@/utils/constants";
import { formatDuration, getDifficultyColor } from "@/utils/helpers";

export default function MockTestPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-['Outfit'] mb-2">
          Mock <span className="gradient-text">Tests</span>
        </h1>
        <p className="text-muted-foreground">Practice under exam conditions and track your progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
        {DEMO_TESTS.map((test) => {
          const course = DEMO_COURSES.find((c) => c.id === test.courseId);
          return (
            <Card key={test.id} className="group border-border/50 bg-card/80 backdrop-blur-sm hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/10">
                    <ClipboardCheck className="w-6 h-6 text-emerald-400" />
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <h3 className="font-semibold font-['Outfit'] text-lg mb-1 group-hover:text-emerald-400 transition-colors">
                  {test.title}
                </h3>
                {course && <p className="text-xs text-muted-foreground mb-2">{course.title}</p>}
                <p className="text-sm text-muted-foreground mb-4">{test.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">{test.totalQuestions} questions</span>
                  <span className="flex items-center gap-1">{formatDuration(test.duration)}</span>
                </div>
                <Button
                  onClick={() => navigate(`/mock-tests/${test.id}`)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white gap-2"
                >
                 Start Test
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
