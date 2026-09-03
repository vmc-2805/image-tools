<?php

// --- START OF SEO INJECTION ---
$requestUri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($requestUri, PHP_URL_PATH) ?: '/';

// Do not intercept API requests, sanctum, telescope, or direct file assets
$isApi = (strpos($path, '/api/') === 0 || strpos($path, '/sanctum/') === 0 || strpos($path, '/telescope/') === 0);
$isFile = preg_match('/\.[a-zA-Z0-9]+$/', $path);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && !$isApi && !$isFile) {
    if (!function_exists('getSeoApiBaseUrl')) {
        function getSeoApiBaseUrl() {
            $envPath = __DIR__ . '/.env';
            if (file_exists($envPath)) {
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    list($key, $value) = explode('=', $line, 2) + [NULL, NULL];
                    if ($key && $value) {
                        $key = trim($key);
                        $value = trim($value, " \t\n\r\0\x0B\"'");
                        if ($key === 'VITE_SEO_API_BASE_URL') {
                            return $value;
                        }
                    }
                }
            }
            return 'http://192.168.1.7:8004'; // Fallback
        }
    }

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || ($_SERVER['SERVER_PORT'] ?? 80) == 443) ? "https" : "http";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $domainName = $protocol . '://' . $host;
    
    $apiBaseUrl = getSeoApiBaseUrl();
    $apiUrl = $apiBaseUrl . '/api/v1/public/seo?domain_name=' . urlencode($domainName) . '&path=' . urlencode($path);

    $ctx = stream_context_create([
        'http' => [
            'timeout' => 1.5,
            'ignore_errors' => true
        ]
    ]);
    $responseJson = @file_get_contents($apiUrl, false, $ctx);
    
    $currentUrlHtml = htmlspecialchars($domainName . $path, ENT_QUOTES, 'UTF-8');
    $metaTagsHtml = "    <meta name=\"robots\" content=\"index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1\">\n    <link rel=\"canonical\" href=\"{$currentUrlHtml}\">\n";
    $apiTagsStr = "";

    if ($responseJson) {
        $response = json_decode($responseJson, true);
        if (!empty($response['success']) && !empty($response['data'])) {
            $data = $response['data'];
            if (!empty($data['meta_tags_html']) && is_array($data['meta_tags_html'])) {
                $apiTagsStr = implode("\n    ", $data['meta_tags_html']);
                $metaTagsHtml .= "    " . $apiTagsStr . "\n";
            }
            if (!empty($data['schema_json_ld'])) {
                $schemaJson = json_encode($data['schema_json_ld'], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
                $metaTagsHtml .= "    <script type=\"application/ld+json\" id=\"seo-jsonld-schema\">\n" . $schemaJson . "\n    </script>\n";
            }
        }
    }

    $htmlPath = file_exists(__DIR__ . '/dist/index.html') ? __DIR__ . '/dist/index.html' : __DIR__ . '/index.html';
    if (file_exists($htmlPath)) {
        $html = file_get_contents($htmlPath);
        
        $html = preg_replace('/<meta\s+name=["\']robots["\']\s+content=["\'].*?["\']\s*\/?>/is', '', $html);
        $html = preg_replace('/<link\s+rel=["\']canonical["\']\s+href=["\'].*?["\']\s*\/?>/is', '', $html);
        
        if (stripos($apiTagsStr, '<title') !== false) {
            $html = preg_replace('/<title>.*?<\/title>/is', '', $html);
        }
        if (stripos($apiTagsStr, 'name="description"') !== false || stripos($apiTagsStr, "name='description'") !== false) {
            $html = preg_replace('/<meta\s+name=["\']description["\']\s+content=["\'].*?["\']\s*\/?>/is', '', $html);
        }
        
        $html = preg_replace('/<head>/i', "<head>\n    <!-- Dynamic SEO Injected by Server -->\n" . $metaTagsHtml, $html, 1);
        
        echo $html;
        exit;
    }
}
// --- END OF SEO INJECTION ---


use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will load this file so that any pre-rendered content can be shown
| instead of starting the framework, which could cause an exception.
|
*/

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request using
| the application's HTTP kernel. Then, we will send the response back
| to this client's browser, allowing them to enjoy our application.
|
*/

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Kernel::class);

$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
