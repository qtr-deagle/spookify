<?php
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$song_id = $data['song_id'] ?? null;
$lyrics = $data['lyrics'] ?? null;

if (!$song_id || !$lyrics) {
    http_response_code(400);
    echo json_encode(["error" => "Missing song_id or lyrics"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE songs SET lyrics = ? WHERE id = ?");
$result = $stmt->execute([$lyrics, $song_id]);

if ($result) {
    echo json_encode(["success" => true, "message" => "Lyrics updated successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update lyrics"]);
}
?>
