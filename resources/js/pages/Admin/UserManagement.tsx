import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { UserPlus, Pencil, Trash, Search, ChevronDown, UsersIcon, UserRoundCheck, UserRoundX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';
import { 
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import CountUp from 'react-countup';
import { BreadcrumbItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    role: string;
    status: 'active' | 'inactive';
    created_at: string;
}

interface ResponseData {
    user?: User;
    userId?: number;
    message?: string;
    error?: string;
}

interface Props {
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin',
    },
    {
        title: 'User Management',
        href: '/admin/users',
    },
];

export default function UserManagement({ users: initialUsers }: Props) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const createForm = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });
    
    const editForm = useForm({
        name: '',
        email: '',
        role: '',
        status: '',
    });
    
    const deleteForm = useForm({});

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const activeUsers = users.filter(user => user.status === 'active').length;
    const inactiveUsers = users.filter(user => user.status === 'inactive').length;
    
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    
    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    
    const openCreateModal = () => {
        createForm.reset();
        setIsCreateModalOpen(true);
    };
    
    const openEditModal = (user: User) => {
        setCurrentUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
        });
        setIsEditModalOpen(true);
    };
    
    const openDeleteModal = (user: User) => {
        setCurrentUser(user);
        setIsDeleteModalOpen(true);
    };
    
    const submitCreateForm = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post(route('admin.users.store'), {
            onSuccess: () => {
                const newUser: User = {
                    id: Date.now(),
                    name: createForm.data.name,
                    email: createForm.data.email,
                    email_verified_at: null,
                    role: createForm.data.role,
                    status: 'active',
                    created_at: new Date().toISOString()
                };
                
                setUsers(prevUsers => [...prevUsers, newUser]);
                
                setIsCreateModalOpen(false);
                toast({
                    title: "User created successfully",
                    description: `User ${createForm.data.name} has been created.`,
                });
                
                createForm.reset();
            },
        });
    };
    
    const submitEditForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser) {
            editForm.put(route('admin.users.update', currentUser.id), {
                onSuccess: () => {
                    setUsers(prevUsers => 
                        prevUsers.map(user => {
                            if (user.id === currentUser.id) {
                                return {
                                    ...user,
                                    name: editForm.data.name,
                                    email: editForm.data.email,
                                    role: editForm.data.role,
                                    status: editForm.data.status as 'active' | 'inactive'
                                };
                            }
                            return user;
                        })
                    );
                    
                    setIsEditModalOpen(false);
                    toast({
                        title: "User updated successfully",
                        description: `User ${editForm.data.name} has been updated.`,
                    });
                },
            });
        }
    };
    
    const submitDeleteForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentUser) {
            const deletedUserId = currentUser.id;
            const deletedUserName = currentUser.name;
            
            deleteForm.delete(route('admin.users.destroy', deletedUserId), {
                onSuccess: () => {
                    setUsers(prevUsers => 
                        prevUsers.filter(user => user.id !== deletedUserId)
                    );
                    
                    setIsDeleteModalOpen(false);
                    toast({
                        title: "User deleted",
                        description: `User ${deletedUserName} has been deleted.`,
                        variant: "destructive"
                    });
                },
                onError: (errors) => {
                    toast({
                        title: "Error",
                        description: errors.message || "Failed to delete user.",
                        variant: "destructive"
                    });
                    setIsDeleteModalOpen(false);
                }
            });
        }
    };
    
    const renderPaginationItems = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink 
                            onClick={() => handlePageChange(i)} 
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            pages.push(
                <PaginationItem key={1}>
                    <PaginationLink 
                        onClick={() => handlePageChange(1)} 
                        isActive={currentPage === 1}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            
            if (currentPage > 3) {
                pages.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink 
                            onClick={() => handlePageChange(i)} 
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
            
            if (currentPage < totalPages - 2) {
                pages.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            
            pages.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink 
                        onClick={() => handlePageChange(totalPages)} 
                        isActive={currentPage === totalPages}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        
        return pages;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
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
                                                end={users.length} 
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
                                                end={activeUsers} 
                                                duration={2.5} 
                                                enableScrollSpy 
                                                scrollSpyOnce
                                            />
                                        </p>
                                        <Badge variant="default" className="ml-2">Total Active Users</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-green-500/10 p-3">
                                    <UserRoundCheck className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">Inactive Users</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-3xl font-bold mt-2">
                                            <CountUp 
                                                start={0} 
                                                end={inactiveUsers} 
                                                duration={2.5} 
                                                enableScrollSpy 
                                                scrollSpyOnce
                                            />
                                        </p>
                                        <Badge variant="destructive" className="ml-2">Total Inactive Users</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-rose-500/10 p-3">
                                    <UserRoundX className="h-6 w-6 text-rose-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-2xl">User Management</CardTitle>
                                <CardDescription>Manage users in your application</CardDescription>
                            </div>
                            <Button onClick={openCreateModal}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add User
                            </Button>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search user..."
                                        className="w-full pl-8 bg-background"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="ml-auto">
                                            {pageSize} entries<ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setPageSize(10)}>
                                            10 entries
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPageSize(25)}>
                                            25 entries
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPageSize(50)}>
                                            50 entries
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPageSize(100)}>
                                            100 entrie
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='capitalize'>Role</TableHead>
                                        <TableHead>Joined Date</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedUsers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>{user.id}</TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell className='items-center'>
                                                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                                        {user.status === 'active' ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='capitalize'>
                                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(user.created_at).toLocaleDateString('en-US')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        <Button 
                                                            onClick={() => openEditModal(user)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-primary hover:text-primary/80"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button 
                                                            onClick={() => openDeleteModal(user)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-destructive hover:text-destructive/80"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                                <TableFooter className="bg-background">
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={7}>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm justify-start">
                                                    Menampilkan {paginatedUsers.length} dari {filteredUsers.length} data
                                                </div>
                                                
                                                {totalPages > 1 && (
                                                    <Pagination className='justify-end'>
                                                        <PaginationContent className="bg-background">
                                                            <PaginationItem>
                                                                <PaginationPrevious 
                                                                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                                />
                                                            </PaginationItem>
                                                            
                                                            {renderPaginationItems()}
                                                            
                                                            <PaginationItem>
                                                                <PaginationNext 
                                                                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                                />
                                                            </PaginationItem>
                                                        </PaginationContent>
                                                    </Pagination>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Enter the information to create a new user in the system.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={submitCreateForm}>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={createForm.data.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.name && <p className="text-sm text-destructive">{createForm.errors.name}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.email && <p className="text-sm text-destructive">{createForm.errors.email}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('password', e.target.value)}
                                        required
                                    />
                                    {createForm.errors.password && <p className="text-sm text-destructive">{createForm.errors.password}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={createForm.data.password_confirmation}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => createForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={createForm.data.role}
                                        onValueChange={(value) => createForm.setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {createForm.errors.role && <p className="text-sm text-destructive">{createForm.errors.role}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createForm.processing}>
                                {createForm.processing ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                            Edit user information in the system.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={submitEditForm}>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.name && <p className="text-sm text-destructive">{editForm.errors.name}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => editForm.setData('email', e.target.value)}
                                        required
                                    />
                                    {editForm.errors.email && <p className="text-sm text-destructive">{editForm.errors.email}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="edit-role">Role</Label>
                                    <Select
                                        value={editForm.data.role}
                                        onValueChange={(value) => editForm.setData('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.role && <p className="text-sm text-destructive">{editForm.errors.role}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={editForm.data.status}
                                        onValueChange={(value) => editForm.setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {editForm.errors.status && <p className="text-sm text-destructive">{editForm.errors.status}</p>}
                                </div>
                            </div>
                        </div>
                        
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editForm.processing}>
                                {editForm.processing ? 'Saving...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {currentUser && (
                        <div className="mb-4 p-4 bg-muted rounded-md">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Name:</span>
                                    <span>{currentUser.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Email:</span>
                                    <span>{currentUser.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Role:</span>
                                    <Badge variant={currentUser.role === 'admin' ? 'secondary' : 'outline'}>
                                        {currentUser.role}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Status:</span>
                                    <Badge variant={currentUser.status === 'active' ? 'default' : 'destructive'}>
                                        {currentUser.status === 'active' ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button 
                            type="button" 
                            variant="destructive" 
                            disabled={deleteForm.processing}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                submitDeleteForm(e);
                            }}
                        >
                            {deleteForm.processing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 