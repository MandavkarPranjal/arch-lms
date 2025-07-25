import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface featureProps {
    title: string;
    description: string;
    icon: string;
}

const features: featureProps[] = [
    {
        title: "Comprehensive Courses",
        description: "Access a wide range of carefully curated courses designed by industry experts.",
        icon: "📚",
    },
    {
        title: "Interactive Learning",
        description: "Enagage with interactive content, quizzes, and assessments to enhance your learning experience.",
        icon: "🎮",
    },
    {
        title: "Progess Tracking",
        description: "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
        icon: "📊",
    },
    {
        title: "Community Support",
        description: "Connect with fellow learners, instructors, and industry experts for peer-to-peer learning and support.",
        icon: "👥",
    }
]

export default function Home() {
    return (
        <>
            <section className="relative py-20">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant="outline">
                        {"The Future of Online Architecture Education"}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold">
                        {"Elevate your architect skills"}
                    </h1>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl">
                        {"Discover a new way to learn and grow with our modern, interactive learning platform. Access high-quality courses anytime, anywhere."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                        <Link
                            className={buttonVariants({
                                size: "lg",
                            })}
                            href="/courses"
                        >
                            Explore Courses
                        </Link>
                        <Link
                            className={buttonVariants({
                                size: "lg",
                                variant: "outline"
                            })}
                            href="/login"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
                {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="text-4xl mb-4">{feature.icon}</div>
                            <CardTitle>{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </>
    );
}
