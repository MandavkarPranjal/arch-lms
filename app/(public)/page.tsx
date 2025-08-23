import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Prism from '@/components/prism';
import type React from 'react';
import Link from 'next/link';

interface TestimonialProps {
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
}

const testimonials: TestimonialProps[] = [
    {
        name: 'Sarah Chen',
        role: 'Senior Architect',
        company: 'Urban Design Studio',
        content:
            'ArchMentor transformed my understanding of sustainable design principles. The CAD workflow courses are exceptional.',
        rating: 5,
    },
    {
        name: 'Marcus Rodriguez',
        role: 'Architecture Student',
        company: 'MIT',
        content:
            "The interactive 3D modeling sessions helped me grasp complex structural concepts that textbooks couldn't explain.",
        rating: 5,
    },
    {
        name: 'Elena Kowalski',
        role: 'Project Manager',
        company: 'Green Building Corp',
        content:
            'Finally, an e-learning platform that understands the practical needs of working architects. Highly recommended!',
        rating: 5,
    },
];

export default function Home() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32">
                {/* Background Prism - positioned absolutely to overlap */}
                <div className="absolute inset-0 h-full w-full">
                    <Prism
                        animationType="rotate"
                        timeScale={0.5}
                        height={2.6}
                        baseWidth={5.5}
                        scale={4}
                        hueShift={0}
                        colorFrequency={1}
                        noise={0.5}
                        glow={1}
                        position="absolute"
                        transparent={true}
                        zIndex={-1}
                    />
                </div>
                <div className="relative z-1 container mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
                    <div className="mx-auto flex max-w-4xl flex-col items-center space-y-8 text-center">
                        <Badge
                            variant="outline"
                            className="bg-primary/10 text-primary inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                        >
                            The Future of Architecture Education
                        </Badge>

                        <h1 className="font-serif text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
                            Architect Your
                            <span className="text-primary block">Future</span>
                        </h1>

                        <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed md:text-xl">
                            Master architectural design, CAD workflows, and building principles with
                            our comprehensive e-learning platform. Learn from industry experts and
                            build your career with confidence.
                        </p>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Link
                                className={buttonVariants({
                                    size: 'lg',
                                    className: 'px-8',
                                })}
                                href="/login"
                            >
                                <span className="text-lg">Start Learning Today</span>
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                href="/courses"
                                className={buttonVariants({
                                    variant: 'outline',
                                    size: 'lg',
                                    className: 'bg-transparent px-8',
                                })}
                            >
                                <span className="text-lg">View Course Catalog</span>
                            </Link>
                        </div>

                        <div className="text-muted-foreground mt-12 flex items-center space-x-8 text-sm">
                            <div className="flex items-center space-x-2">
                                <div className="flex -space-x-2">
                                    <div className="bg-primary/40 h-8 w-8 rounded-full border-2 border-white"></div>
                                    <div className="bg-primary/60 h-8 w-8 rounded-full border-2 border-white"></div>
                                    <div className="bg-primary/80 h-8 w-8 rounded-full border-2 border-white"></div>
                                </div>
                                <span>2,500+ students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>4.9/5 rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/30 py-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
                            What Our Students Say
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
                            Join thousands of architects who have transformed their careers with
                            ArchMentor.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <Card
                                key={index}
                                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <CardContent className="pt-6">
                                    <div className="mb-4 flex">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <blockquote className="text-muted-foreground mb-4 leading-relaxed">
                                        &quot;{testimonial.content}&quot;
                                    </blockquote>
                                    <div>
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-muted-foreground text-sm">
                                            {testimonial.role} at {testimonial.company}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="bg-primary/95 supports-[backdrop-filter]:bg-primary/90 text-primary-foreground py-24">
                <div className="container mx-auto px-4 md:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 font-serif text-3xl font-bold md:text-4xl">
                            Ready to Build Your Future?
                        </h2>
                        <p className="text-primary-foreground/80 mb-8 text-xl leading-relaxed">
                            Join ArchMentor today and gain access to world-class architecture
                            education. Start your journey towards becoming a better architect.
                        </p>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                href="/courses"
                                className={buttonVariants({
                                    variant: 'secondary',
                                    size: 'lg',
                                    className: 'px-8',
                                })}
                            >
                                <span className="text-lg">Get it Now !!!</span>
                            </Link>
                        </div>
                        <p className="text-primary-foreground/60 mt-6 text-sm">
                            30-day money-back guarantee
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
        </>
    );
}
