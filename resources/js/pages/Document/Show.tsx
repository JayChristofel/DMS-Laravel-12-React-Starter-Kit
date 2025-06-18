import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Download, FileEdit, Calendar, Clock, Tag, Info, FileText, FileImage, AlertCircle, History, File as FileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Management',
        href: '/documents',
    },
    {
        title: 'Document Detail',
        href: '/documents/show',
    },
];

interface Tag {
    id: number;
    name: string;
}

interface Version {
    id: number;
    file_path: string;
    version: string;
    created_at: string;
}

interface Document {
    id: number;
    title: string;
    file_path: string;
    expired_at: string | null;
    description: string | null;
    tags: Tag[];
    created_at: string;
    versions: Version[];
}

interface Props {
    document: Document;
    auth: { user: { role: string } };
}

function getStatus(expired_at: string | null) {
    if (!expired_at) return 'active';
    const now = new Date();
    const exp = new Date(expired_at);
    if (exp < now) return 'expired';
    if ((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 7) return 'expiring';
    return 'active';
}

function getFileType(file: string) {
    if (file.endsWith('.pdf')) return 'pdf';
    if (file.endsWith('.doc') || file.endsWith('.docx')) return 'word';
    if (file.endsWith('.xls') || file.endsWith('.xlsx')) return 'excel';
    if (file.endsWith('.ppt') || file.endsWith('.pptx')) return 'ppt';
    return 'other';
}

function getFileIcon(fileType: string) {
    switch (fileType) {
        case 'pdf':
            return <FileText className="h-8 w-8 text-red-500" />;
        case 'word':
            return <FileText className="h-8 w-8 text-blue-500" />;
        case 'excel':
            return <FileText className="h-8 w-8 text-green-500" />;
        case 'ppt':
            return <FileText className="h-8 w-8 text-orange-500" />;
        default:
            return <FileIcon className="h-8 w-8 text-gray-500" />;
    }
}

const formatLocalDate = (dateString: string, includeTime: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function DocumentShow({ document, auth }: Props) {
    const fileType = getFileType(document.file_path);
    const fileName = document.file_path.split('/').pop();
    const fileUrl = `/storage/documents/${fileName}`;
    const [previewHeight, setPreviewHeight] = useState(500);
    const [previewError, setPreviewError] = useState(false);
    
    useEffect(() => {
        const handleResize = () => {
            const height = window.innerHeight * 0.6;
            setPreviewHeight(height);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (auth.user.role !== 'admin' && auth.user.role !== 'user') {
        return (
            <AppLayout>
                <Head title="Access Denied" />
                <div className="flex flex-col items-center justify-center p-10 text-center">
                    <div className="rounded-full bg-destructive/10 p-4 mb-4">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-6">You do not have permission to view this document.</p>
                    <Button asChild>
                        <Link href="/dashboard">
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={document.title} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/3 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{document.title}</CardTitle>
                                        <CardDescription>Document Information</CardDescription>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 bg-muted/50 rounded">
                                        {getFileIcon(fileType)}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {document.tags.map(tag => (
                                        <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    {(() => {
                                        const status = getStatus(document.expired_at);
                                        if (status === 'expired') return <Badge variant="destructive">Expired</Badge>;
                                        if (status === 'expiring') return <Badge variant="outline">Expiring Soon</Badge>;
                                        return <Badge variant="default">Active</Badge>;
                                    })()}
                                </div>
                                
                                {document.description && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-1">
                                            <Info className="inline-block h-4 w-4 mr-1" /> Description
                                        </p>
                                        <p className="text-sm">{document.description}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        <Calendar className="inline-block h-4 w-4 mr-1" /> Expired Date
                                    </p>
                                    <p className="text-sm">{document.expired_at ? formatLocalDate(document.expired_at) : '-'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">
                                        <Clock className="inline-block h-4 w-4 mr-1" /> Upload Date
                                    </p>
                                    <p className="text-sm">{formatLocalDate(document.created_at, true)}</p>
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                    <Button asChild variant="default">
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Download className="h-4 w-4 mr-1" /> Download
                                        </a>
                                    </Button>
                                    
                                    {auth.user.role === 'admin' && (
                                        <Button asChild variant="outline">
                                            <Link href={`/documents/${document.id}/edit`}>
                                                <FileEdit className="h-4 w-4 mr-1" /> Edit
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        
                        {document.versions && document.versions.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <History className="h-5 w-5" /> Document Versions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {document.versions.map(ver => (
                                            <div key={ver.id} className="flex items-center gap-2 p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                                <div className="h-10 w-10 flex items-center justify-center">
                                                    {ver.file_path.endsWith('.pdf') ? 
                                                        <FileText className="h-8 w-8 text-red-500" /> :
                                                        ver.file_path.endsWith('.doc') || ver.file_path.endsWith('.docx') ? 
                                                        <FileText className="h-8 w-8 text-blue-500" /> :
                                                        ver.file_path.endsWith('.xls') || ver.file_path.endsWith('.xlsx') ? 
                                                        <FileText className="h-8 w-8 text-green-500" /> :
                                                        <FileIcon className="h-8 w-8 text-gray-500" />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-sm">Version {ver.version}</h4>
                                                        {document.versions && ver === document.versions[document.versions.length - 1] && (
                                                            <Badge variant="secondary" className="text-xs">Latest</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatLocalDate(ver.created_at, true)}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                    className="flex-shrink-0"
                                                >
                                                    <a 
                                                        href={`/storage/documents/${ver.file_path.split('/').pop()}`} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    
                    <div className="w-full lg:w-2/3">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <Eye className="h-5 w-5 mr-2" /> Document Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="min-h-[400px] border rounded-md bg-muted/10">
                                    {fileType === 'pdf' && !previewError ? (
                                        <div className="relative">
                                            <iframe 
                                                src={fileUrl} 
                                                title="PDF Preview" 
                                                className="w-full rounded-md" 
                                                style={{ height: `${previewHeight}px` }}
                                                onError={() => setPreviewError(true)}
                                                onLoad={(e) => {
                                                    // Check if iframe loaded correctly
                                                    try {
                                                        const iframe = e.target as HTMLIFrameElement;
                                                        if (iframe.contentDocument?.body.innerHTML.includes('error')) {
                                                            setPreviewError(true);
                                                        }
                                                    } catch (error) {
                                                        console.error('Error checking iframe content:', error);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (fileType === 'word' || fileType === 'excel' || fileType === 'ppt') && !previewError ? (
                                        <iframe 
                                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${window.location.origin}${fileUrl}`} 
                                            title="Office Preview" 
                                            className="w-full rounded-md" 
                                            style={{ height: `${previewHeight}px` }}
                                            onError={() => setPreviewError(true)}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                                            {getFileIcon(fileType)}
                                            <p className="mt-4 text-muted-foreground">
                                                {previewError 
                                                    ? "Failed to load document preview. The document may be unavailable or in an unsupported format." 
                                                    : "Preview not available for this file type"}
                                            </p>
                                            <Button asChild variant="outline" className="mt-4">
                                                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                    <Download className="h-4 w-4 mr-1" /> Download to view
                                                </a>
                                            </Button>
                                            {previewError && (
                                                <Button 
                                                    variant="secondary" 
                                                    className="mt-2"
                                                    onClick={() => setPreviewError(false)}
                                                >
                                                    Try Again
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 