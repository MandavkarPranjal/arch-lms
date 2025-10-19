'use client';

import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
    return (
        <div className="bg-muted/30 w-full py-16">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Image src="/logo.png" alt="Logo" width={164} height={164} />
                        </div>
                        <p className="text-muted-foreground">
                            Empowering the next generation of architects through innovative
                            e-learning.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Courses</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>
                                <Link
                                    href="/courses/cad"
                                    className="hover:text-primary transition-colors"
                                >
                                    CAD & Design
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/courses/structures"
                                    className="hover:text-primary transition-colors"
                                >
                                    Structural Engineering
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/courses/sustainability"
                                    className="hover:text-primary transition-colors"
                                >
                                    Sustainable Design
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/courses/project-management"
                                    className="hover:text-primary transition-colors"
                                >
                                    Project Management
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Company</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-primary transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="hover:text-primary transition-colors"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="hover:text-primary transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Support</h3>
                        <ul className="text-muted-foreground space-y-2">
                            <li>
                                <Link href="/help" className="hover:text-primary transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="hover:text-primary transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="hover:text-primary transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/accessibility"
                                    className="hover:text-primary transition-colors"
                                >
                                    Accessibility
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
                    <p className="text-muted-foreground text-sm">
                        © 2024 ArchMentor. All rights reserved.
                    </p>
                    <div className="mt-4 flex space-x-4 md:mt-0">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span className="sr-only">Twitter</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <span className="sr-only">LinkedIn</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
