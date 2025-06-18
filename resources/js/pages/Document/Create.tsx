import { useState, useCallback, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileUp, Calendar as CalendarIcon, FileText, AlertCircle, File, Upload, FileArchive, X, CircleAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BreadcrumbItem } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TagInput } from '@/components/ui/tag-input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Document Management',
        href: '/documents',
    },
    {
        title: 'Upload Document',
        href: '/documents/create',
    },
];

interface Tag {
    id: number;
    name: string;
}

interface Props {
    tags: Tag[];
    auth: { user: { role: string } };
}

export default function DocumentCreate({ tags, auth }: Props) {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const calendarRef = useRef<HTMLDivElement>(null);
    const calendarButtonRef = useRef<HTMLButtonElement>(null);
    
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

    const [form, setForm] = useState({
        title: '',
        file: null as File | null,
        expired_at: '',
        description: '',
    });

    const updateForm = (field: string, value: unknown) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleTagsChange = (newSelectedTags: string[]) => {
        setSelectedTags(newSelectedTags);
    };

    const availableTags = tags.map(tag => tag.name);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = useCallback((file: File) => {
        updateForm('file', file);
        if (file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    }, []);

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
    }, [processFile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.title) {
            toast({ 
                title: "Error", 
                description: "Please enter a document title", 
                variant: "destructive" 
            });
            return;
        }
        
        if (!form.file) {
            toast({ 
                title: "Error", 
                description: "Please upload a file", 
                variant: "destructive" 
            });
            return;
        }
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('file', form.file);
        
        if (form.expired_at) {
            formData.append('expired_at', form.expired_at);
        }
        
        if (form.description) {
            formData.append('description', form.description);
        }
        
        if (selectedTags.length > 0) {
            formData.append('tags_string', selectedTags.join(','));
        }
        
        console.log('Sending formData:', {
            title: form.title,
            file: form.file.name,
            expired_at: form.expired_at,
            description: form.description ? 'Yes' : 'No',
            tags: selectedTags
        });
        
        router.post('/documents', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast({ 
                    title: "Success", 
                    description: "Document has been saved successfully" 
                });
                setSelectedTags([]);
                setPreviewUrl(null);
                setSelectedDate(undefined);
                setForm({
                    title: '',
                    file: null,
                    expired_at: '',
                    description: '',
                });
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Error uploading document:', errors);
                toast({
                    title: "Failed", 
                    description: Object.values(errors).join(', ') || "An error occurred while saving the document", 
                    variant: "destructive"
                });
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        if (date) {
            updateForm('expired_at', format(date, 'yyyy-MM-dd'));
        } else {
            updateForm('expired_at', '');
        }
        setShowCalendar(false);
    };

    const getFileIcon = () => {
        if (!form.file) return <Upload className="h-10 w-10 text-muted-foreground" />;
        
        const fileName = form.file.name.toLowerCase();
        if (fileName.endsWith('.pdf')) return <FileText className="h-10 w-10 text-red-500" />;
        if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) return <FileText className="h-10 w-10 text-blue-500" />;
        if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return <FileText className="h-10 w-10 text-green-500" />;
        if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) return <FileText className="h-10 w-10 text-orange-500" />;
        return <FileArchive className="h-10 w-10 text-gray-500" />;
    };

    const resetFile = () => {
        updateForm('file', null);
        setPreviewUrl(null);
        
        const fileInput = window.document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    if (auth.user.role !== 'admin') {
        return (
            <AppLayout>
                <Head title="Upload Document" />
                <div className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
                    <p>You do not have permission to upload documents.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Document" />

            <div className="flex flex-col lg:flex-row gap-6 p-4">
                <div className="w-full lg:w-1/2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileUp className="h-5 w-5" />
                                <span>Upload New Document</span>
                            </CardTitle>
                            <CardDescription>Fill in the document information and upload the file</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form id="docForm" onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-medium">Document Title</Label>
                                    <Input 
                                        id="title" 
                                        className="mt-2"
                                        value={form.title} 
                                        onChange={e => updateForm('title', e.target.value)} 
                                        placeholder="Enter the document title"
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
                                            id="fileInput"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                            aria-label="File upload"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center">
                                            {getFileIcon()}
                                            <p className="mt-2 text-sm font-medium">
                                                {form.file ? form.file.name : "Drag & drop file or click to upload"}
                                            </p>
                                            {form.file && (
                                                <>
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Button 
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={resetFile}
                                                            className="flex items-center gap-1"
                                                        >
                                                            <X className="h-3 w-3" />
                                                            <span>Delete File</span>
                                                        </Button>
                                                        <Button 
                                                            type="button" 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => window.document.getElementById('fileInput')?.click()}
                                                        >
                                                            Change File
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                            {!form.file && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => window.document.getElementById('fileInput')?.click()}
                                                    className="mt-2"
                                                >
                                                    Choose File
                                                </Button>
                                            )}
                                            
                                            {!form.file && (
                                                <div className="mt-4 flex flex-col gap-1">
                                                    <p className="text-xs text-muted-foreground">Supported formats: PDF, Word, Excel, PowerPoint</p>
                                                    <p className="text-xs text-muted-foreground">Maximum size: 10MB</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!form.file && (
                                        <div className="flex items-center gap-2 rounded-md p-2 bg-rose-300 justify-start mt-2 text-destructive">
                                            <CircleAlert className="h-4 w-4" />
                                            <p className="text-sm">Please select a file</p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="expired_at" className="text-sm font-medium flex items-center gap-1">
                                        <CalendarIcon className="h-4 w-4" />
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
                                                format(selectedDate, 'dd MMMM yyyy')
                                            ) : (
                                                <span>Choose expired date</span>
                                            )}
                                        </Button>
                                        {showCalendar && (
                                            <div 
                                                ref={calendarRef}
                                                className="absolute top-[calc(100%+5px)] left-0 z-50 rounded-md border bg-popover shadow-md">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleDateChange}
                                                    initialFocus
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea 
                                        id="description" 
                                        className="mt-2 min-h-[100px]"
                                        value={form.description} 
                                        onChange={e => updateForm('description', e.target.value)}
                                        placeholder="Description of the document (optional)"
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
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
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-3">
                            <Button variant="outline" asChild>
                                <Link href="/documents">Back</Link>
                            </Button>
                            <Button 
                                type="submit"
                                form="docForm"
                                className="flex items-center gap-2"
                                disabled={isSubmitting || !form.file || !form.title}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Document'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="w-full lg:w-1/2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <span>Preview Document</span>
                            </CardTitle>
                            <CardDescription>Preview the document that will be uploaded</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center min-h-[400px] relative">
                            {previewUrl && form.file?.type === 'application/pdf' ? (
                                <iframe 
                                    src={previewUrl}
                                    className="w-full h-[500px] border rounded"
                                    title="PDF Preview"
                                />
                            ) : form.file ? (
                                <div className="text-center p-8 flex flex-col items-center">
                                    {getFileIcon()}
                                    <h3 className="mt-4 font-medium">{form.file.name}</h3>
                                    <p className="text-muted-foreground text-sm mt-2">
                                        {(form.file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                    <p className="text-muted-foreground text-xs mt-4">
                                        {form.file.type === 'application/pdf' 
                                            ? 'Loading PDF preview...' 
                                            : 'Preview not available for this file type'}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center p-8 flex flex-col items-center">
                                    <FileText className="h-12 w-12 text-muted-foreground opacity-20" />
                                    <p className="text-muted-foreground mt-4">Upload document to see preview</p>
                                </div>
                            )}
                        </CardContent>
                        {form.file && (
                            <CardFooter className="flex flex-col gap-2 border-t pt-3">
                                <div className="w-full flex items-center justify-between">
                                    <div className="text-sm">
                                        <span className="font-medium">File name:</span> {form.file.name}
                                    </div>
                                    <Badge variant="outline">
                                        {form.file.type.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
                                    </Badge>
                                </div>
                                {form.title && (
                                    <div className="text-sm w-full">
                                        <span className="font-medium">Title:</span> {form.title}
                                    </div>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 