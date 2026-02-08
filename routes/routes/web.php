Route::get('/debug-courses', function() {
    return \App\Models\Course::select('id', 'title', 'image', 'created_at')
        ->orderByDesc('created_at')
        ->limit(10)
        ->get();
});
