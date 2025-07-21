import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

export default function Home() {
    return (
        <div className="text-2xl font-bold text-red-500">
            Hello World
            <ThemeToggle />
        </div>
    );
}
