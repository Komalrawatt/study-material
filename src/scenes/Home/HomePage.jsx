import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  Video,
  ClipboardCheck,
  HelpCircle,
  FlaskConical,
  Box,
  ScrollText,
  Headphones,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CourseCard from "@/components/common/CourseCard";
import TestimonialCard from "@/components/common/TestimonialCard";
import StatsCounter from "@/components/common/StatsCounter";
import BookLibrary from "@/components/common/BookLibrary";
import { FEATURES, DEMO_COURSES, TESTIMONIALS } from "@/utils/constants";

const featureIcons = {
  FileText, Video, ClipboardCheck, HelpCircle, FlaskConical, Box, ScrollText, Headphones,
};

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-40 right-1/4 w-48 h-48 bg-cyan-500/8 rounded-full blur-2xl animate-float" style={{ animationDelay: "0.8s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-8 animate-scale-in">
              {/* <Sparkles className="w-4 h-4" /> */}
              <span>Your Complete Academic Resource Platform</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Outfit'] leading-tight mb-6">
              Master Your Studies with{" "}
              <span className="gradient-text animate-gradient bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                StudyMaterials
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Access structured notes, video lectures, mock tests, question banks, and more —
              organized course-wise and unit-wise for effective learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-500/25 px-8 h-12 text-base gap-2 animate-pulse-glow"
                >
                  Explore Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border/60 hover:bg-muted">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative border-y border-border/40 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
            <StatsCounter end={500} label="Study Materials" icon={FileText} suffix="+" />
            <StatsCounter end={50} label="Courses" icon={BookOpen} suffix="+" />
            <StatsCounter end={10000} label="Active Students" icon={Users} suffix="+" />
            <StatsCounter end={200} label="Mock Tests" icon={ClipboardCheck} suffix="+" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4">
              {/* <Zap className="w-3 h-3" /> */}
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A comprehensive suite of learning resources designed to support every aspect of your academic journey.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {FEATURES.map((feature) => {
              const Icon = featureIcons[feature.icon];
              return (
                <Card
                  key={feature.title}
                  className="group border border-border/50 bg-card/60 backdrop-blur-sm hover:border-emerald-500/30 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all border border-emerald-500/10">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold font-['Outfit'] text-base mb-2 group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-2">
                Popular <span className="gradient-text">Courses</span>
              </h2>
              <p className="text-muted-foreground">
                Explore our most enrolled courses across various streams
              </p>
            </div>
            <Link to="/courses">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {DEMO_COURSES.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/courses">
              <Button variant="outline" className="gap-2">
                View All Courses <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Book Library */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookLibrary showLibraryTab={false} />
        </div>
      </section>

      {/* Why StudyMaterials */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs mb-4">
                {/* <Shield className="w-3 h-3" /> */}
                Why StudyMaterials
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-6">
                Built for Students,{" "}
                <span className="gradient-text">By Educators</span>
              </h2>
              <div className="space-y-4">
                {[
                  { title: "Structured Learning", desc: "Content organized course-wise and unit-wise for systematic study" },
                  { title: "Multi-format Content", desc: "Notes, videos, audio, animations — learn the way that suits you best" },
                  { title: "Practice & Assess", desc: "Mock tests, question banks, and previous year papers for thorough preparation" },
                  { title: "Access Anywhere", desc: "Study anytime, from any device — your materials are always available" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-sm font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold font-['Outfit'] mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-cyan-500/20 border border-emerald-500/20 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[
                    { icon: FileText, label: "Notes", color: "from-blue-500 to-indigo-500" },
                    { icon: Video, label: "Videos", color: "from-pink-500 to-rose-500" },
                    { icon: ClipboardCheck, label: "Tests", color: "from-green-500 to-emerald-500" },
                    { icon: BookOpen, label: "Books", color: "from-orange-500 to-amber-500" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform cursor-default"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-4">
              What Students <span className="gradient-text">Say</span>
            </h2>
            <p className="text-muted-foreground">
              Hear from students who transformed their study experience with StudyMaterials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {TESTIMONIALS.map((testimonial, i) => (
              <TestimonialCard key={i} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative text-center py-16 px-8">
              <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-white mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-emerald-100 max-w-xl mx-auto mb-8 text-lg">
                Join thousands of students who are already using StudyMaterials to ace their exams.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl px-8 h-12 text-base font-semibold">
                    Create Free Account
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-white/30 text-white hover:bg-white/15 hover:text-white px-8 h-12 text-base"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
