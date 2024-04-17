import { GridBackground } from "@/components/ui/GridBackground";
import { FloatingNav } from "@/components/ui/floating-navbar";

export default function Home() {
  return (
    <main className="dark">
      <FloatingNav />
      <GridBackground
        text="Your unified code companion."
        subtext="Generate, code, collaborate and execute with our state-of-the art technology."
      />
    </main>
  );
}
