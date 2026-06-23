import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { Building, Users, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="HSTU Hall Management" />
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
                
                {/* Navigation Header */}
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1">
                            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-3 group">
                                <img
                                    className="h-10 w-auto transition-transform group-hover:scale-105"
                                    src="/images/hstu_logo.png"
                                    alt="HSTU Logo"
                                />
                                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
                                    HSTU Halls
                                </span>
                            </a>
                        </div>
                        <div className="flex flex-1 justify-end items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Dashboard <span aria-hidden="true">&rarr;</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-semibold leading-6 text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                        >
                                            Register
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    {/* Hero Section */}
                    <div className="relative isolate px-6 pt-14 lg:px-8 overflow-hidden">
                        {/* Abstract Background Shapes */}
                        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                        </div>

                        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-slate-600 dark:text-slate-400 ring-1 ring-slate-900/10 dark:ring-white/10 hover:ring-slate-900/20 dark:hover:ring-white/20 transition-all">
                                    Announcing the new integrated allocation system.{' '}
                                    <a href="#" className="font-semibold text-indigo-600 dark:text-indigo-400">
                                        <span className="absolute inset-0" aria-hidden="true" />
                                        Read more <span aria-hidden="true">&rarr;</span>
                                    </a>
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl mb-6">
                                Modern living for the brilliant minds of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">HSTU</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                                Experience a seamless, digital-first approach to residential life. Apply for seats, manage your profile, and connect with hall administration effortlessly.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="group rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="group rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2"
                                    >
                                        Get Started
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="bg-white dark:bg-slate-900 py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl lg:text-center">
                                <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Manage efficiently</h2>
                                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                    Everything you need for Hall Management
                                </p>
                            </div>
                            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                                <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
                                            <Building className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                            9 Residential Halls
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                            <p className="flex-auto">Including 5 male halls and 4 female halls equipped with modern amenities and a vibrant community.</p>
                                        </dd>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50">
                                            <Users className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" />
                                        </div>
                                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                            Automated Allocation
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                            <p className="flex-auto">Smart seat allocation based on CGPA, distance from home, and guardian's income for fair distribution.</p>
                                        </dd>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700/50 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/50">
                                            <ShieldCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />
                                        </div>
                                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                            Secure & Transparent
                                        </dt>
                                        <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                                            <p className="flex-auto">Real-time room availability, instant notifications, and dedicated portals for students and administration.</p>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-slate-50 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} Hajee Mohammad Danesh Science and Technology University (HSTU). All rights reserved.
                    </p>
                </footer>
            </div>
        </>
    );
}
