<?php

namespace App\Controllers;

use App\Core\Database;
use PDO;

class ProductController
{
    public static function index()
    {
        try {
            $db = Database::connect();

            $stmt = $db->query("
                SELECT
                    id,
                    category_id,
                    name_uz,
                    name_ru,
                    description_uz,
                    description_ru,
                    price,
                    discount,
                    image,
                    stock,
                    status,
                    created_at
                FROM products
                WHERE status = 1
                ORDER BY id DESC
            ");

            header('Content-Type: application/json; charset=utf-8');
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);

        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ], JSON_UNESCAPED_UNICODE);
        }
    }
}