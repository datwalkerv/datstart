import { Clock } from "@/components/clock/Clock";

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-16">
      <Clock />
    </main>
  );
}
