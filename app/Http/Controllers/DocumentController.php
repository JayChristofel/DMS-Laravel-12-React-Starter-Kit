<?php
namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Tag;
use App\Models\DocumentVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = Document::with(['tags', 'creator', 'versions'])
            ->orderByDesc('created_at')
            ->get();
        $tags = Tag::whereHas('documents')->get();
        return Inertia::render('Document/Index', [
            'documents' => $documents,
            'tags' => $tags,
        ]);
    }

    public function create()
    {
        $tags = Tag::all();
        return Inertia::render('Document/Create', [
            'tags' => $tags,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // 10MB max
            'expired_at' => 'nullable|date',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags_string' => 'nullable|string',
        ]);

        try {
            // Log full request untuk debugging
            Log::info('Document store full request:', $request->all());
            
            $file = $request->file('file');
            $filePath = $file->store('documents');
            
            DB::beginTransaction();
            
            $document = Document::create([
                'title' => $request->title,
                'file_path' => $filePath,
                'expired_at' => $request->expired_at,
                'description' => $request->description,
                'created_by' => Auth::id(),
                'updated_by' => Auth::id(),
            ]);
            
            // Handle tags via array atau tags_string
            $tagIds = [];
            
            if ($request->has('tags') && is_array($request->tags)) {
                $tagNames = $request->tags;
                Log::info('Processing tags by name:', ['tag_names' => $tagNames]);
                $tagIds = Tag::whereIn('name', $tagNames)->pluck('id')->toArray();
            }
            
            // Handle tags_string (string of comma-separated tags)
            if ($request->has('tags_string') && !empty($request->tags_string)) {
                $tagNames = array_map('trim', explode(',', $request->tags_string));
                Log::info('Processing tags_string:', ['tag_names' => $tagNames]);
                
                // Filter out empty values
                $tagNames = array_filter($tagNames, function($name) {
                    return !empty($name);
                });
                
                if (!empty($tagNames)) {
                    // Get existing tags
                    $existingTags = Tag::whereIn('name', $tagNames)->get();
                    $existingTagNames = $existingTags->pluck('name')->toArray();
                    $existingTagIds = $existingTags->pluck('id')->toArray();
                    
                    // Find tags that need to be created
                    $newTagNames = array_diff($tagNames, $existingTagNames);
                    $newTagIds = [];
                    
                    // Create new tags
                    foreach ($newTagNames as $name) {
                        $tag = Tag::create(['name' => $name]);
                        $newTagIds[] = $tag->id;
                    }
                    
                    // Merge existing and new tag IDs
                    $tagIds = array_merge($existingTagIds, $newTagIds);
                }
            }
            
            Log::info('Final tag IDs to sync:', ['tag_ids' => $tagIds]);
            $document->tags()->sync($tagIds);
            
            // Buat versi pertama
            DocumentVersion::create([
                'document_id' => $document->id,
                'file_path' => $filePath,
                'version' => '1.0',
                'created_by' => Auth::id(),
            ]);
            
            DB::commit();
            
            return redirect()->route('documents.index')
                ->with('message', 'Document created successfully.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating document:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat dokumen: ' . $e->getMessage()]);
        }
    }

    public function show(Document $document)
    {
        $document->load(['tags', 'creator', 'versions']);
        return Inertia::render('Document/Show', [
            'document' => $document,
        ]);
    }

    public function edit(Document $document)
    {
        $tags = Tag::all();
        return Inertia::render('Document/Edit', [
            'document' => $document->load('tags'),
            'tags' => $tags,
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'expired_at' => 'nullable|date',
            'description' => 'nullable|string',
            'tags' => 'nullable|array',
            'tags_string' => 'nullable|string',
        ]);

        try {
            // Log full request untuk debugging
            Log::info('Document update full request:', $request->all());
            
            DB::beginTransaction();
            
            $document->update([
                'title' => $request->title,
                'expired_at' => $request->expired_at,
                'description' => $request->description,
                'updated_by' => Auth::id(),
            ]);
            
            // Handle tags via array atau tags_string
            $tagIds = [];
            
            if ($request->has('tags') && is_array($request->tags)) {
                $tagNames = $request->tags;
                Log::info('Processing tags by name:', ['tag_names' => $tagNames]);
                $tagIds = Tag::whereIn('name', $tagNames)->pluck('id')->toArray();
            }
            
            // Handle tags_string (string of comma-separated tags)
            if ($request->has('tags_string') && !empty($request->tags_string)) {
                $tagNames = array_map('trim', explode(',', $request->tags_string));
                Log::info('Processing tags_string:', ['tag_names' => $tagNames]);
                
                // Filter out empty values
                $tagNames = array_filter($tagNames, function($name) {
                    return !empty($name);
                });
                
                if (!empty($tagNames)) {
                    // Get existing tags
                    $existingTags = Tag::whereIn('name', $tagNames)->get();
                    $existingTagNames = $existingTags->pluck('name')->toArray();
                    $existingTagIds = $existingTags->pluck('id')->toArray();
                    
                    // Find tags that need to be created
                    $newTagNames = array_diff($tagNames, $existingTagNames);
                    $newTagIds = [];
                    
                    // Create new tags
                    foreach ($newTagNames as $name) {
                        $tag = Tag::create(['name' => $name]);
                        $newTagIds[] = $tag->id;
                    }
                    
                    // Merge existing and new tag IDs
                    $tagIds = array_merge($existingTagIds, $newTagIds);
                }
            }
            
            Log::info('Final tag IDs to sync:', ['tag_ids' => $tagIds]);
            $document->tags()->sync($tagIds);
            
            DB::commit();
            
            return redirect()->route('documents.index')
                ->with('message', 'Document updated successfully.');
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating document:', [
                'document_id' => $document->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui dokumen: ' . $e->getMessage()]);
        }
    }

    public function destroy(Document $document)
    {
        $document->delete();
        return redirect()->route('documents.index')->with('message', 'Document deleted successfully.');
    }

    public function uploadVersion(Request $request, Document $document)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'version' => 'required|string',
        ]);

        try {
            $file = $request->file('file');
            $filePath = $file->store('documents');
            
            DocumentVersion::create([
                'document_id' => $document->id,
                'file_path' => $filePath,
                'version' => $request->version,
                'created_by' => Auth::id(),
            ]);
            
            $document->update([
                'file_path' => $filePath,
                'updated_by' => Auth::id(),
            ]);
            
            return redirect()->route('documents.show', $document)->with('message', 'New version uploaded.');
        } catch (\Exception $e) {
            Log::error('Error uploading document version: ' . $e->getMessage());
            return back()->withErrors(['file' => 'Terjadi kesalahan saat mengupload versi dokumen.']);
        }
    }

    // Akses kontrol role (contoh middleware di route)
} 