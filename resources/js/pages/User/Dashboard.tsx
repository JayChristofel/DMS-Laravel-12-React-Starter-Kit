import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import CountUp from 'react-countup';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
    },
];

export default function UserDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Profil Saya</h2>
                            <p className="text-sm text-gray-500 mt-2">Kelola informasi profil Anda</p>
                            <Button asChild variant="default">
                                <Link href="/settings/profile" className="mt-4">
                                    Lihat Profil
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Notifikasi</h2>
                            <p className="text-3xl font-bold mt-2">
                                <CountUp 
                                    start={0} 
                                    end={3} 
                                    duration={2.5} 
                                    enableScrollSpy 
                                    scrollSpyOnce
                                />
                            </p>
                            <p className="text-sm text-gray-500">Notifikasi Baru</p>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="p-4">
                            <h2 className="text-lg font-semibold">Aktivitas Terakhir</h2>
                            <p className="text-sm text-gray-500 mt-2">Login terakhir: 2 jam yang lalu</p>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Selamat Datang di Dashboard Anda</h2>
                        <p className="mb-4">
                            Ini adalah area pribadi Anda untuk mengelola akun dan melihat informasi terkait dengan aktivitas Anda.
                            Gunakan menu di sidebar untuk navigasi ke berbagai fitur yang tersedia.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Pengaturan Akun</h3>
                                <p className="text-sm text-gray-500 mt-1">Ubah kata sandi dan preferensi akun</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Riwayat Aktivitas</h3>
                                <p className="text-sm text-gray-500 mt-1">Lihat aktivitas terbaru Anda</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Dokumen Saya</h3>
                                <p className="text-sm text-gray-500 mt-1">Akses dokumen dan file Anda</p>
                            </div>
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-medium">Bantuan & Dukungan</h3>
                                <p className="text-sm text-gray-500 mt-1">Dapatkan bantuan dan jawaban atas pertanyaan Anda</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 