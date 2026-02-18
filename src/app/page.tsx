import Link from "next/link";
import { navigationConfig } from "@/lib/navigation-config";
import { BookOpen, Zap, Waves, Microscope } from "lucide-react";

const icons = [BookOpen, Zap, Waves, Microscope];
const colors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-orange-500 to-red-600",
  "from-emerald-500 to-teal-600"
];

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-5xl w-full text-center mb-16">
        <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Vaje Fizika
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Izberite letnik in začnite z utrjevanjem fizikalnih nalog.
          Vse na enem mestu, od osnov do naprednejših problemov.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {navigationConfig.map((item, index) => {
          const Icon = icons[index % icons.length];
          const colorClass = colors[index % colors.length];

          return (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="group relative overflow-hidden rounded-3xl p-8 h-64 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl active:scale-[0.98]"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10 group-hover:opacity-20 transition-opacity`} />

              {/* Decorative Circle */}
              <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br ${colorClass} opacity-20 blur-3xl group-hover:scale-150 transition-transform duration-500`} />

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
                <Icon size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold">
                  Raziskuj vsebino
                </p>
              </div>

              {/* Arrow Icon */}
              <div className="absolute bottom-8 right-8 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <Zap size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
