<?php

use App\Controllers\ProductController;
use App\Controllers\OrderController;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($uri) {

    case '/api/health':
        echo json_encode([
            "success" => true,
            "message" => "Restaurant API is running",
            "database" => "Connected"
        ]);
        break;

    case '/api/products':
        ProductController::index();
        break;

    case '/api/orders':
        OrderController::store();
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Route not found"
        ]);
        break;
}