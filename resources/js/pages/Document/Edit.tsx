import { useState, useCallback, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, UploadCloud, FileText, File as FileIcon, AlertCircle, Clock, History, Edit, Save, Download, FileArchive, RefreshCw, Tag, X } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TagInput } from '@/components/ui/tag-input';



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
    tags: Tag[];
    auth: { user: { role: string } };
}

export default function DocumentEdit({ document, tags, auth }: Props) {
    const [selectedTags, setSelectedTags] = useState<string[]>(document.tags.map(t => t.name));
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        document.expired_at ? parseISO(document.expired_at) : undefined
    );
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isVersionSubmitting, setIsVersionSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const calendarRef = useRef<HTMLDivElement>(null);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    
    const [form, setForm] = useState({
        title: document.title,
        expired_at: document.expired_at || '',
        description: document.description || '',
    });

    const [versionForm, setVersionForm] = useState({
        file: null as File | null,
        version: '',
    });

    const updateForm = (field: string, value: any) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };
    
    const updateVersionForm = (field: string, value: any) => {
        setVersionForm(prev => ({ ...prev, [field]: value }));
    };
    
    const getTagIdByName = (tagName: string): number | null => {
        const tag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
        return tag ? tag.id : null;
    };

    const getTagIds = (tagNames: string[]): number[] => {
        return tagNames
            .map(name => getTagIdByName(name))
            .filter((id): id is number => id !== null);
    };
    
    const resetVersionFile = () => {
        updateVersionForm('file', null);
        setPreviewUrl(null);
        
        const fileInput = window.document.getElementById('versionFileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showCalendar &&
                calendarRef.current &&
                !calendarRef.current.contains(event.target as Node) &&
                calendarButtonRef.current &&
                !calendarButtonRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };
        
        window.document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCalendar]);

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            updateForm('expired_at', format(date, 'yyyy-MM-dd'));
        } else {
            updateForm('expired_at', '');
        }
        setShowCalendar(false);
    };

    const handleTagsChange = (newSelectedTags: string[]) => {
        setSelectedTags(newSelectedTags);
        console.log('Selected tag names:', newSelectedTags);
    };

    const availableTags = tags.map(tag => tag.name);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', form.title);
        formData.append('expired_at', form.expired_at);
        formData.append('description', form.description);
        
        console.log('Form submission - selected tags:', selectedTags);
        
        formData.append('tags_string', selectedTags.join(','));
        
        console.log('Form data yang dikirim:');
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        
        router.post(`/documents/${document.id}`, formData, {
            forceFormData: true,
            onSuccess: () => {
                toast({ 
                    title: "Berhasil", 
                    description: "Dokumen berhasil diperbarui" 
                });
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Error updating document:', errors);
                toast({
                    title: "Gagal", 
                    description: "Terjadi kesalahan saat memperbarui dokumen", 
                    variant: "destructive"
                });
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleVersionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };
    
    const processFile = (file: File) => {
        updateVersionForm('file', file);
        if (file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };
    
    const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);
    
    const handleVersionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isVersionSubmitting) return;
        
        setIsVersionSubmitting(true);
        
        const formData = new FormData();
        if (versionForm.file) {
            formData.append('file', versionForm.file);
        }
        formData.append('version', versionForm.version);
        
        router.post(`/documents/${document.id}/upload-version`, formData, {
            forceFormData: true,
            onSuccess: () => {
                toast({
                    title: "Versi baru berhasil diupload",
                    description: "Versi dokumen baru telah ditambahkan"
                });
                setVersionForm({
                    file: null,
                    version: ''
                });
                setPreviewUrl(null);
                setIsVersionSubmitting(false);
            },
            onError: (errors) => {
                console.error('Error uploading version:', errors);
                toast({
                    title: "Gagal", 
                    description: "Terjadi kesalahan saat mengupload versi baru", 
                    variant: "destructive"
                });
                setIsVersionSubmitting(false);
            },
            onFinish: () => {
                setIsVersionSubmitting(false);
            }
        });
    };

    const getFileIcon = () => {
        if (!versionForm.file) return <UploadCloud className="h-10 w-10 text-muted-foreground" />;
        
        const fileName = versionForm.file.name.toLowerCase();
        if (fileName.endsWith('.pdf')) return <FileText className="h-10 w-10 text-red-500" />;
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileText className="h-10 w-10 text-blue-500" />;
        if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return <FileText className="h-10 w-10 text-green-500" />;
        if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return <FileText className="h-10 w-10 text-orange-500" />;
        return <FileArchive className="h-10 w-10 text-gray-500" />;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (auth.user.role !== 'admin') {
        return (
            <AppLayout>
                <Head title="Edit Dokumen" />
                <div className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Akses Ditolak</h3>
                    <p>Anda tidak memiliki hak akses untuk mengedit dokumen.</p>
                </div>
            </AppLayout>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Document Management',
            href: '/documents',
        },
        {
            title: document.title,
            href: `/documents/${document.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Document" />
            <div className="flex flex-col lg:flex-row gap-6 p-4">
                <div className="w-full lg:w-1/2 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <Edit className="h-5 w-5" />
                                <span>Edit Document</span>
                            </CardTitle>
                            <CardDescription>
                                Update document information <span className="font-medium text-foreground">{document.title}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="editForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
                                    <Input 
                                        id="title" 
                                        value={form.title}
                                        className="mt-2" 
                                        onChange={e => updateForm('title', e.target.value)}
                                        placeholder="Enter document title"
                                        required 
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="expired_at" className="text-sm font-medium flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4 mr-1" />
                                        <span>Expired Date</span>
                                    </Label>
                                    <div className="relative mt-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            ref={calendarButtonRef}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                            onClick={() => setShowCalendar(!showCalendar)}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? (
                                                format(selectedDate, 'dd MMMM yyyy', { locale: id })
                                            ) : (
                                                <span>Select expired date</span>
                                            )}
                                        </Button>
                                        {showCalendar && (
                                            <div 
                                                ref={calendarRef}
                                                className="absolute top-[calc(100%+5px)] left-0 z-50 rounded-md border bg-popover shadow-md"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateChange}
                                                    initialFocus
                                                    locale={id}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea 
                                        id="description" 
                                        value={form.description}
                                        className="mt-2 min-h-[100px]" 
                                        onChange={e => updateForm('description', e.target.value)}
                                        placeholder="Add document description"
                                    />
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium flex items-center gap-1">
                                        <Tag className="h-4 w-4 mr-1" />
                                        <span>Tags</span>
                                    </Label>
                                    <div className="mt-2">
                                        <TagInput
                                            value={selectedTags}
                                            onChange={handleTagsChange}
                                            availableTags={availableTags}
                                            placeholder="Select or add tag..."
                                            className="w-full"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Type to add new tag or select from available tags
                                    </p>
                                </div>
                                
                                <div className="pt-1">
                                    <div className="text-xs flex items-center text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        <span>Created at: {formatDate(document.created_at)}</span>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t py-3">
                            <Button variant="outline" asChild>
                                <Link href={`/documents/${document.id}`}>
                                    Back
                                </Link>
                            </Button>
                            <Button 
                                type="submit" 
                                form="editForm" 
                                disabled={isSubmitting}
                                className="gap-1"
                            >
                                <Save className="h-4 w-4" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                <span>Document Versions</span>
                            </CardTitle>
                            <CardDescription>Document version history</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[300px] overflow-y-auto">
                            {document.versions && document.versions.length > 0 ? (
                                <div className="space-y-3">
                                    {document.versions && document.versions.map((version) => (
                                        <div key={version.id} className="flex items-center gap-2 p-3 rounded-lg border bg-card/50 hover:bg-accent/5 transition-colors">
                                            <div className="h-10 w-10 flex items-center justify-center">
                                                {version.file_path.endsWith('.pdf') ? 
                                                    <FileText className="h-8 w-8 text-red-500" /> :
                                                    version.file_path.endsWith('.doc') || version.file_path.endsWith('.docx') ? 
                                                    <FileText className="h-8 w-8 text-blue-500" /> :
                                                    version.file_path.endsWith('.xls') || version.file_path.endsWith('.xlsx') ? 
                                                    <FileText className="h-8 w-8 text-green-500" /> :
                                                    <FileIcon className="h-8 w-8 text-gray-500" />
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm">Versi {version.version}</h4>
                                                    {document.versions && parseInt(version.version) === Math.max(...document.versions.map(v => parseInt(v.version))) && (
                                                        <Badge variant="secondary" className="text-xs">Latest</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{formatDate(version.created_at)}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                className="flex-shrink-0"
                                            >
                                                <Link href={`/storage/${version.file_path}`} target="_blank">
                                                    <Download className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <History className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                                    <p className="text-muted-foreground text-sm">No document versions</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                
                <div className="w-full lg:w-1/2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <RefreshCw className="h-5 w-5" />
                                <span>Upload New Version</span>
                            </CardTitle>
                            <CardDescription>Upload new version for this document</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="versionForm" onSubmit={handleVersionSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="version" className="text-sm font-medium">Version Number</Label>
                                    <Input
                                        id="version"
                                        value={versionForm.version}
                                        onChange={e => updateVersionForm('version', e.target.value)}
                                        placeholder="Example: 1.1, 2.0"
                                        className="mt-2"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium">Upload File</Label>
                                    <div 
                                        className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            id="versionFileInput"
                                            type="file"
                                            className="hidden"
                                            onChange={handleVersionFileChange}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                            required
                                        />
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {getFileIcon()}
                                            <p className="mt-2 text-sm font-medium">
                                                {versionForm.file ? versionForm.file.name : "Drag & drop file atau klik untuk upload"}
                                            </p>
                                            {versionForm.file && (
                                                <>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {(versionForm.file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Button 
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={resetVersionFile}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <X className="h-3 w-3" />
                                                            <span>Hapus File</span>
                                                        </Button>
                                                        <Button 
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => window.document.getElementById('versionFileInput')?.click()}
                                                        >
                                                            Ganti File
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                            {!versionForm.file && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => window.document.getElementById('versionFileInput')?.click()}
                                                    className="mt-2"
                                                >
                                                    Pilih File
                                                </Button>
                                            )}
                                            
                                            {!versionForm.file && (
                                                <div className="mt-4 flex flex-col gap-1">
                                                    <p className="text-xs text-muted-foreground">Supported formats: PDF, Word, Excel, PowerPoint</p>
                                                    <p className="text-xs text-muted-foreground">Maximum size: 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {previewUrl && versionForm.file?.type === 'application/pdf' && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium mb-2">Document Preview</h3>
                                        <div className="border rounded h-[300px] overflow-hidden">
                                            <iframe 
                                                src={previewUrl}
                                                className="w-full h-full" 
                                                title="Document Preview"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                            <Button
                                type="button"
                                variant="outline"
                                asChild
                            >
                                <Link href={`/documents`}>Back to Detail</Link>
                            </Button>
                            <Button
                                type="submit"
                                form="versionForm"
                                disabled={isVersionSubmitting || !versionForm.file}
                                className="flex items-center gap-2"
                            >
                                <Save className="h-4 w-4" />
                                {isVersionSubmitting ? 'Uploading...' : 'Upload New Version'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}