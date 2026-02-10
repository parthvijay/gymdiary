import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Dumbbell, Calendar, TrendingUp, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="mx-auto max-w-4xl px-6 py-12 text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-primary/10 flex size-20 items-center justify-center rounded-full">
            <Dumbbell className="text-primary size-10" aria-hidden="true" />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Track Your Fitness Journey
        </h1>
        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg md:text-xl">
          GymDiary helps you log workouts, track progress, and stay motivated.
          Start your fitness journey today with our simple and intuitive workout tracker.
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="text-base">
              Get Started
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="text-base">
              Sign In
            </Button>
          </SignInButton>
        </div>

        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 mb-2 flex size-12 items-center justify-center rounded-lg">
              <Calendar className="text-primary size-6" aria-hidden="true" />
            </div>
            <h2 className="font-semibold">Daily Tracking</h2>
            <p className="text-muted-foreground text-sm">
              Log your workouts by date and view your training history
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 mb-2 flex size-12 items-center justify-center rounded-lg">
              <ListChecks className="text-primary size-6" aria-hidden="true" />
            </div>
            <h2 className="font-semibold">Exercise Details</h2>
            <p className="text-muted-foreground text-sm">
              Track sets, reps, and weight for each exercise
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <div className="bg-primary/10 mb-2 flex size-12 items-center justify-center rounded-lg">
              <TrendingUp className="text-primary size-6" aria-hidden="true" />
            </div>
            <h2 className="font-semibold">Monitor Progress</h2>
            <p className="text-muted-foreground text-sm">
              See your improvements over time and stay motivated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
