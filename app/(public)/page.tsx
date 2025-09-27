'use client';

import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { useState, useEffect, Suspense } from 'react';
import PixelBlast from '@/components/PixelBlast';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    useEffect(() => {
        // const handleScroll = () => {
        //     const currentScrollY = window.scrollY;
        //
        //     // Calculate blur intensity based on scroll position
        //     // Start with full blur (6) and reduce as user scrolls down
        //     const maxScroll = window.innerHeight * 0.8; // 80% of viewport height
        //     const scrollProgress = Math.min(currentScrollY / maxScroll, 1);
        //     const newBlurIntensity = 6 * (1 - scrollProgress * 0.7); // Reduce blur by up to 70%
        //     setBlurIntensity(Math.max(newBlurIntensity, 0.5)); // Minimum blur of 0.5
        //
        //     // Calculate content opacity - fade out slightly as user scrolls
        //     const newOpacity = 1 - scrollProgress * 0.3; // Reduce opacity by up to 30%
        //     setContentOpacity(Math.max(newOpacity, 0.7)); // Minimum opacity of 0.7
        // };
        //
        // window.addEventListener('scroll', handleScroll, { passive: true });
        // return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="relative flex h-screen items-center justify-center transition-all duration-500 ease-out">
                {/* Background Prism - positioned absolutely to overlap */}
                <div className="absolute inset-0 h-full w-full">
                    <Suspense
                        fallback={
                            <div className="from-primary/5 to-primary/10 h-full w-full bg-gradient-to-br" />
                        }
                    >
                        <PixelBlast
                            variant="square"
                            pixelSize={4}
                            patternScale={2}
                            patternDensity={1}
                            pixelSizeJitter={0}
                            enableRipples
                            rippleSpeed={0.4}
                            rippleThickness={0.12}
                            rippleIntensityScale={1.5}
                            speed={0.6}
                            edgeFade={0.25}
                            transparent
                        />
                    </Suspense>
                </div>
                <div
                    className="relative z-1 container mx-auto flex max-w-4xl flex-col items-center space-y-8 px-4 text-center transition-opacity duration-300 ease-out"
                    style={{ opacity: 1 }}
                >
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
                        Master architectural design, CAD workflows, and building principles with our
                        comprehensive e-learning platform. Learn from industry experts and build
                        your career with confidence.
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
                <ProgressiveBlur
                    blurIntensity={6}
                    className="transition-all duration-300 ease-out"
                />
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
