import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vaje Fizika</h1>
        <div className="grid gap-4">
          <Link
            href="/mechanics/kinematics/problem-1"
            className="block p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Premo enakomerno gibanje</h2>
            <p className="text-gray-600 dark:text-gray-400">Mehanika / Kinematika</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
