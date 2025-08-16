import { type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            {/* <nav className="flex items-center justify-end gap-4">
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={route('login')}
                            className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                        >
                            Log in
                        </Link>
                        <Link
                            href={route('register')}
                            className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                        >
                            Register
                        </Link>
                    </>
                )}
            </nav> */}
            <div className="bg-gradient-to-b from-green-50 to-green-100">
                <header className="">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between lg:h-20">
                            <div className="flex-shrink-0">
                                <a href="#" title="" className="flex">
                                    <img
                                        className="h-8 w-auto"
                                        src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/logo.svg"
                                        alt=""
                                    />
                                </a>
                            </div>
                            <button
                                type="button"
                                className="inline-flex border border-black p-1 text-black transition-all duration-200 hover:bg-gray-100 focus:bg-gray-100 lg:hidden"
                            >
                                {/* Menu open: "hidden", Menu closed: "block" */}
                                <svg
                                    className="block h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                {/* Menu open: "block", Menu closed: "hidden" */}
                                <svg
                                    className="hidden h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="ml-auto hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
                                <a href="/" title="" className="hover:text-opacity-80 text-base font-semibold text-black transition-all duration-200">
                                    {' '}
                                    Home{' '}
                                </a>
                                <a href="#" title="" className="hover:text-opacity-80 text-base font-semibold text-black transition-all duration-200">
                                    {' '}
                                    Solutions{' '}
                                </a>
                                <a href="#" title="" className="hover:text-opacity-80 text-base font-semibold text-black transition-all duration-200">
                                    {' '}
                                    Resources{' '}
                                </a>
                                <a href="#" title="" className="hover:text-opacity-80 text-base font-semibold text-black transition-all duration-200">
                                    {' '}
                                    Pricing{' '}
                                </a>
                                <div className="h-5 w-px bg-black/20" />
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center justify-center border-2 border-black px-5 py-2.5 text-base font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white focus:bg-black focus:text-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="hover:text-opacity-80 text-base font-semibold text-black transition-all duration-200"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="inline-flex items-center justify-center border-2 border-black px-5 py-2.5 text-base font-semibold text-black transition-all duration-200 hover:bg-black hover:text-white focus:bg-black focus:text-white"
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <section className="py-10 sm:py-16 lg:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            <div>
                                <h1 className="text-4xl font-bold text-black sm:text-6xl lg:text-7xl">
                                    Collaborate remotely, with
                                    <div className="relative inline-flex">
                                        <span className="absolute inset-x-0 bottom-0 border-b-[30px] border-[#4ADE80]" />
                                        <h1 className="relative text-4xl font-bold text-black sm:text-6xl lg:text-7xl">Postcrafts.</h1>
                                    </div>
                                </h1>
                                <p className="mt-8 text-base text-black sm:text-xl">
                                    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit
                                    mollit. Exercitation veniam consequat.
                                </p>
                                <div className="mt-10 sm:flex sm:items-center sm:space-x-8">
                                    <a
                                        href="#"
                                        title=""
                                        className="inline-flex items-center justify-center bg-orange-500 px-10 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600"
                                        role="button"
                                    >
                                        {' '}
                                        Start exploring{' '}
                                    </a>
                                    <a
                                        href="#"
                                        title=""
                                        className="mt-6 inline-flex items-center text-base font-semibold transition-all duration-200 hover:opacity-80 sm:mt-0"
                                    >
                                        <svg
                                            className="mr-3 h-10 w-10"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                fill="#F97316"
                                                stroke="#F97316"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        Watch video
                                    </a>
                                </div>
                            </div>
                            <div>
                                <img className="w-full" src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/2/hero-img.png" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <section className="bg-gray-50 py-10 sm:pt-16 lg:pt-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-16 md:col-span-3 lg:grid-cols-6">
                        <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
                            <img className="h-9 w-auto" src="https://cdn.rareblocks.xyz/collection/celebration/images/logo.svg" alt="" />
                            <p className="mt-7 text-base leading-relaxed text-gray-600">
                                Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit
                                mollit.
                            </p>
                            <ul className="mt-9 flex items-center space-x-3">
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white transition-all duration-200 hover:bg-blue-600 focus:bg-blue-600"
                                    >
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white transition-all duration-200 hover:bg-blue-600 focus:bg-blue-600"
                                    >
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white transition-all duration-200 hover:bg-blue-600 focus:bg-blue-600"
                                    >
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
                                            <circle cx="16.806" cy="7.207" r="1.078" />
                                            <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
                                        </svg>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white transition-all duration-200 hover:bg-blue-600 focus:bg-blue-600"
                                    >
                                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Company</p>
                            <ul className="mt-6 space-y-4">
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        About{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Features{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Works{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Career{' '}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Help</p>
                            <ul className="mt-6 space-y-4">
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Customer Support{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Delivery Details{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Terms &amp; Conditions{' '}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        title=""
                                        className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                                    >
                                        {' '}
                                        Privacy Policy{' '}
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
                            <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Subscribe to newsletter</p>
                            <form action="#" method="POST" className="mt-6">
                                <div>
                                    <label htmlFor="email" className="sr-only">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        className="block w-full rounded-md border border-gray-200 bg-white p-4 text-black placeholder-gray-500 caret-blue-600 transition-all duration-200 focus:border-blue-600 focus:outline-none"/>
                                </div>
                                <button
                                    type="submit"
                                    className="mt-3 inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-4 font-semibold text-white transition-all duration-200 hover:bg-blue-700 focus:bg-blue-700">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                    <hr className="mt-16 mb-10 border-gray-200" />
                    <p className="text-center text-sm text-gray-600">© Copyright 2021, All Rights Reserved by Postcraft</p>
                </div>
            </section>
        </>
    );
}
