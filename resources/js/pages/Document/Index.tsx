import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText, Edit, Trash2, Eye, Search, TagIcon, ChevronDown, Clock, AlertCircle, BookOpen, X, Download, Ellipsis, ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem } from '@/types';
import CountUp from 'react-countup';
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
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Management',
        href: '/documents',
    },
];

interface Tag {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
}

interface Version {
    id: number;
    document_id: number;
    file_path: string;
    version: string;
    created_at: string;
    created_by: number;
}

interface Document {
    id: number;
    title: string;
    file_path: string;
    expired_at: string | null;
    description: string | null;
    tags: Tag[];
    creator: User;
    created_at: string;
    versions: Version[];
}

interface Props {
    documents: Document[];
    tags: Tag[];
    auth: { user: { role: string } };
}

// Define sort directions type
type SortDirection = 'asc' | 'desc' | null;

// Define sort columns type
type SortableColumn = 'title' | 'description' | 'created_at' | 'expired_at';

export default function DocumentIndex({ documents, tags, auth }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(documents);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [open, setOpen] = useState(false);
    const [sortColumn, setSortColumn] = useState<SortableColumn | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    const today = new Date();
    const upcomingExpiryDocs = documents.filter(doc => {
        if (doc.expired_at) {
            const expiryDate = parseISO(doc.expired_at);
            return isAfter(expiryDate, today) && isBefore(expiryDate, addDays(today, 30));
        }
        return false;
    });

    const expiredDocs = documents.filter(doc => {
        if (doc.expired_at) {
            const expiryDate = parseISO(doc.expired_at);
            return isBefore(expiryDate, today);
        }
        return false;
    });

    useEffect(() => {
        // Filter documents based on search term and selected tags
        let filtered = documents.filter(doc => {
            const matchesSearch = searchTerm === '' || 
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
            
            const matchesTags = selectedTags.length === 0 || 
                selectedTags.some(tagId => doc.tags.some(t => t.id === tagId));
            
            return matchesSearch && matchesTags;
        });
        
        // Apply sorting if active
        if (sortColumn && sortDirection) {
            filtered = [...filtered].sort((a, b) => {
                let valueA: any;
                let valueB: any;
                
                // Handle different column types for sorting
                if (sortColumn === 'title' || sortColumn === 'description') {
                    valueA = (a[sortColumn] || '').toLowerCase();
                    valueB = (b[sortColumn] || '').toLowerCase();
                } else if (sortColumn === 'expired_at') {
                    valueA = a[sortColumn] ? new Date(a[sortColumn] as string).getTime() : Infinity;
                    valueB = b[sortColumn] ? new Date(b[sortColumn] as string).getTime() : Infinity;
                } else if (sortColumn === 'created_at') {
                    valueA = new Date(a.created_at).getTime();
                    valueB = new Date(b.created_at).getTime();
                } else {
                    return 0;
                }
                
                // Return comparison based on direction
                if (sortDirection === 'asc') {
                    return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
                } else {
                    return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
                }
            });
        }
        
        setFilteredDocuments(filtered);
    }, [searchTerm, selectedTags, documents, sortColumn, sortDirection]);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize, searchTerm, selectedTags]);

    const toggleTag = (tagId: number) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId) 
                : [...prev, tagId]
        );
    };

    const removeTag = (tagId: number) => {
        setSelectedTags(prev => prev.filter(id => id !== tagId));
    };

    const getSelectedTagNames = () => {
        return tags
            .filter(tag => selectedTags.includes(tag.id))
            .map(tag => tag.name);
    };

    const totalPages = Math.ceil(filteredDocuments.length / pageSize);
    
    const paginatedDocuments = filteredDocuments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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

    const handleSort = (column: SortableColumn) => {
        // If clicking the same column, cycle through: null -> asc -> desc -> null
        if (sortColumn === column) {
            if (sortDirection === null) {
                setSortDirection('asc');
            } else if (sortDirection === 'asc') {
                setSortDirection('desc');
            } else {
                setSortColumn(null);
                setSortDirection(null);
            }
        } else {
            // If clicking a new column, set it as the sort column with 'asc' direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIcon = (column: SortableColumn) => {
        if (sortColumn !== column) {
            return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
        }
        
        if (sortDirection === 'asc') {
            return <ArrowUp className="ml-1 h-4 w-4" />;
        }
        
        if (sortDirection === 'desc') {
            return <ArrowDown className="ml-1 h-4 w-4" />;
        }
        
        return <ChevronsUpDown className="ml-1 h-4 w-4 opacity-50" />;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Document Management" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">All Documents</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-3xl font-bold mt-2">
                                            <CountUp 
                                                start={0} 
                                                end={documents.length} 
                                                duration={2.5} 
                                                enableScrollSpy 
                                                scrollSpyOnce
                                            />
                                        </p>
                                        <Badge variant="outline" className="ml-2">Total Documents</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-primary/10 p-3">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">Expiring Soon</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-3xl font-bold mt-2">
                                            <CountUp 
                                                start={0} 
                                                end={upcomingExpiryDocs.length} 
                                                duration={2.5} 
                                                enableScrollSpy 
                                                scrollSpyOnce
                                            />
                                        </p>
                                        <Badge variant="default" className="ml-2">Within 30 days</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-amber-500/10 p-3">
                                    <Clock className="h-6 w-6 text-amber-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-0">
                            <div className="flex flex-row items-center justify-between p-6">
                                <div>
                                    <p className="text-lg font-semibold">Expired Documents</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-3xl font-bold mt-2">
                                            <CountUp 
                                                start={0} 
                                                end={expiredDocs.length} 
                                                duration={2.5} 
                                                enableScrollSpy 
                                                scrollSpyOnce
                                            />
                                        </p>
                                        <Badge variant="destructive" className="ml-2">Expired</Badge>
                                    </div>
                                </div>
                                <div className="rounded-full bg-rose-500/10 p-3">
                                    <AlertCircle className="h-6 w-6 text-rose-500" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-2xl">Document Management</CardTitle>
                                <CardDescription>Manage all documents and their versions</CardDescription>
                            </div>
                            <Link href="/documents/create">
                                <Button>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Document
                                </Button>
                            </Link>
                        </CardHeader>
                        
                        <CardContent>
                            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative w-full md:w-64">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="search"
                                            placeholder="Search documents..."
                                            className="w-full pl-8 bg-background"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>

                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="border-dashed flex gap-2 items-center">
                                                <TagIcon className="h-4 w-4" />
                                                <span>Filter Tags</span>
                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0" align="start">
                                            <Command>
                                                <CommandInput placeholder="Search tags..." />
                                                <CommandList>
                                                    <CommandEmpty>No tags found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {tags.map((tag) => (
                                                            <CommandItem
                                                                key={tag.id}
                                                                onSelect={() => {
                                                                    toggleTag(tag.id);
                                                                }}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <div
                                                                    className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                                                                        selectedTags.includes(tag.id)
                                                                            ? "bg-primary border-primary text-primary-foreground"
                                                                            : "opacity-50 border-muted-foreground"
                                                                    }`}
                                                                >
                                                                    {selectedTags.includes(tag.id) && (
                                                                        <span className="h-2 w-2 rounded-full bg-current" />
                                                                    )}
                                                                </div>
                                                                <span>{tag.name}</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-wrap gap-2">
                                        {getSelectedTagNames().map((tagName, index) => (
                                            <Badge key={index} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                                                {tagName}
                                                <X 
                                                    className="h-3 w-3 cursor-pointer" 
                                                    onClick={() => removeTag(tags.find(t => t.name === tagName)?.id || 0)} 
                                                />
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="ml-auto">
                                                {pageSize} entries<ChevronDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setPageSize(20)}>
                                                20 entries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setPageSize(50)}>
                                                50 entries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setPageSize(100)}>
                                                100 entries
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setPageSize(250)}>
                                                250 entries
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <div className="">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">Preview</TableHead>
                                            <TableHead 
                                                className='w-[200px] cursor-pointer hover:text-primary'
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center">
                                                    Title
                                                    {getSortIcon('title')}
                                                </div>
                                            </TableHead>
                                            <TableHead 
                                                className='w-[120px] cursor-pointer hover:text-primary'
                                                onClick={() => handleSort('description')}
                                            >
                                                <div className="flex items-center">
                                                    Description
                                                    {getSortIcon('description')}
                                                </div>
                                            </TableHead>
                                            <TableHead className='capitalize w-[120px]'>Tags</TableHead>
                                            <TableHead 
                                                className='w-[120px] cursor-pointer hover:text-primary'
                                                onClick={() => handleSort('expired_at')}
                                            >
                                                <div className="flex items-center">
                                                    Expiry Date
                                                    {getSortIcon('expired_at')}
                                                </div>
                                            </TableHead>
                                            <TableHead className='w-[120px] items-end'>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedDocuments.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                                    No Document Found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedDocuments.map((document) => (
                                                <TableRow key={document.id}>
                                                    <TableCell>
                                                        <div className="h-10 w-10 flex items-center justify-center rounded-md border bg-muted/30">
                                                            {document.file_path.endsWith('.pdf') ? 
                                                                <FileText className="h-5 w-5 text-red-500" /> :
                                                                document.file_path.endsWith('.doc') || document.file_path.endsWith('.docx') ? 
                                                                <FileText className="h-5 w-5 text-blue-500" /> :
                                                                document.file_path.endsWith('.ppt') || document.file_path.endsWith('.pptx') ? 
                                                                <FileText className="h-5 w-5 text-orange-500" /> :
                                                                document.file_path.endsWith('.xls') || document.file_path.endsWith('.xlsx') ? 
                                                                <FileText className="h-5 w-5 text-green-500" /> :
                                                                <FileText className="h-5 w-5 text-gray-500" />
                                                            }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {document.title}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {document.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 flex-wrap">
                                                            {document.tags.length > 0 ? (
                                                                document.tags.map(tag => (
                                                                    <Badge key={tag.id} variant="secondary" className="text-xs">
                                                                        {tag.name}
                                                                    </Badge>
                                                                ))
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs">-</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {document.expired_at ? (
                                                            <Badge 
                                                                variant={
                                                                    isBefore(parseISO(document.expired_at), today) 
                                                                        ? "destructive" 
                                                                        : isAfter(parseISO(document.expired_at), today) && isBefore(parseISO(document.expired_at), addDays(today, 30))
                                                                            ? "default"
                                                                            : "outline"
                                                                }
                                                            >
                                                                {format(parseISO(document.expired_at), 'dd MMM yyyy', {locale: enUS})}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-muted-foreground">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button 
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-primary hover:text-primary/80"
                                                                >
                                                                     <Ellipsis className="ml-2 h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/documents/${document.id}`} className="flex items-center">
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        <span>View</span>
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                
                                                                {auth.user.role === 'admin' && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/documents/${document.id}/edit`} className="flex items-center">
                                                                            <Edit className="h-4 w-4 mr-2" />
                                                                            <span>Edit</span>
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                )}
                                                                
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/storage/${document.file_path}`} download target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                                        <Download className="h-4 w-4 mr-2" />
                                                                        <span>Download</span>
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                
                                                                {auth.user.role === 'admin' && (
                                                                    <DropdownMenuItem asChild>
                                                                        <Link href={`/documents/${document.id}`} method="delete" as="button" className="flex items-center text-destructive hover:text-destructive/80 w-full">
                                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                                            <span>Delete</span>
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                    <TableFooter className="bg-background">
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={6}>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm justify-start">
                                                        Showing {paginatedDocuments.length} of {filteredDocuments.length} data
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 