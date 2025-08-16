import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import CountUp from 'react-countup';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';
import { UsersIcon, ActivityIcon, ServerIcon, BarChart3Icon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];

interface Props {
    users: {
        total: number;
        active: number;
        inactive: number;
    };
    activities: number;
    serverUptime: number;
}

// Sample data untuk chart
const data = [
    { name: 'Jan', users: 40, activities: 24 },
    { name: 'Feb', users: 30, activities: 13 },
    { name: 'Mar', users: 20, activities: 48 },
    { name: 'Apr', users: 27, activities: 39 },
    { name: 'May', users: 18, activities: 48 },
    { name: 'Jun', users: 23, activities: 38 },
    { name: 'Jul', users: 34, activities: 43 },
];

export default function AdminDashboard({ 
    users = { total: 250, active: 210, inactive: 40 },
    activities = 45,
    serverUptime = 98
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">All Users</p>
                                    <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold mt-2">
                            <CountUp 
                                start={0} 
                                                end={users.total} 
                                duration={2.5} 
                                enableScrollSpy 
                                scrollSpyOnce
                            />
                            </p>
                                        <Badge variant="outline" className="ml-2">Total Users</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-primary/10 p-3">
                                    <UsersIcon className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">Active Users</p>
                                    <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold mt-2">
                            <CountUp 
                                    start={0} 
                                                end={users.active} 
                                    duration={2.5} 
                                    enableScrollSpy 
                                    scrollSpyOnce
                                />
                            </p>
                                        <Badge variant="default" className="ml-2">Active</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-green-500/10 p-3">
                                    <ActivityIcon className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">Server Performance</p>
                                    <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold mt-2">
                            <CountUp 
                                    start={0} 
                                                end={serverUptime} 
                                    duration={2.5} 
                                    enableScrollSpy 
                                    scrollSpyOnce
                                            />%
                                        </p>
                                        <Badge variant="secondary" className="ml-2">Uptime</Badge>
                        </div>
                    </div>
                                <div className="rounded-full bg-blue-500/10 p-3">
                                    <ServerIcon className="h-6 w-6 text-blue-500" />
                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle>User Activity</CardTitle>
                            <CardDescription>Monthly user activities overview</CardDescription>
                        </CardHeader>
                        <CardContent className="px-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={data}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="activities" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage your application</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/admin/users" className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <UsersIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">User Management</h3>
                                        <p className="text-sm text-muted-foreground">Manage users and permissions</p>
                                    </div>
                                </Link>
                                <div className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <ServerIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">System Settings</h3>
                                        <p className="text-sm text-muted-foreground">Configure system preferences</p>
                                    </div>
                                </div>
                                <div className="p-4 border rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors cursor-pointer">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <BarChart3Icon className="h-4 w-4 text-primary" />
                            </div>
                                    <div>
                                        <h3 className="font-medium">Analytics & Reports</h3>
                                        <p className="text-sm text-muted-foreground">View insights and performance</p>
                            </div>
                        </div>
                    </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 