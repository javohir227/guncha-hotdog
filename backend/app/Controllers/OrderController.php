<?php

namespace App\Controllers;

class OrderController
{
    public static function store()
    {
        header("Content-Type: application/json; charset=utf-8");

        $data = json_decode(file_get_contents("php://input"), true);

        $name = $data["name"] ?? "";
        $phone = $data["phone"] ?? "";
        $address = $data["address"] ?? "";
        $total = $data["total"] ?? 0;
        $payment = $data["payment"] ?? "";
        $products = $data["products"] ?? [];

        $message = "🛒 YANGI BUYURTMA\n\n";
        $message .= "👤 Ism: $name\n";
        $message .= "📞 Telefon: $phone\n";
        $message .= "📍 Manzil: $address\n";
        $message .= "💳 To'lov: $payment\n\n";

        $message .= "📦 Mahsulotlar:\n";

        foreach ($products as $product) {
            $productName = $product["name"] ?? "";
            $qty = $product["qty"] ?? 1;
            $price = $product["price"] ?? 0;

            $message .= "• {$productName}\n";
            $message .= "   {$qty} dona × {$price} so'm\n";
        }

        $message .= "\n💰 Jami: {$total} so'm";

        $token = $_ENV["BOT_TOKEN"];
        $chatId = $_ENV["CHAT_ID"];

        $url = "https://api.telegram.org/bot{$token}/sendMessage";

        $postData = [
            "chat_id" => $chatId,
            "text" => $message
        ];

        $options = [
            "http" => [
                "header" => "Content-type: application/x-www-form-urlencoded\r\n",
                "method" => "POST",
                "content" => http_build_query($postData)
            ]
        ];

        $context = stream_context_create($options);

        file_get_contents($url, false, $context);

        echo json_encode([
            "success" => true,
            "message" => "Buyurtma yuborildi"
        ]);
    }
}