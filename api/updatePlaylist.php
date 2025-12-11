<?php
require 'db.php';

$playlist_id = $_POST['playlist_id'] ?? null;
$name = $_POST['name'] ?? null;

if (!$playlist_id || !$name) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE playlists SET name = ? WHERE id = ?");
$result = $stmt->execute([$name, $playlist_id]);

if ($result) {
    echo json_encode(["success" => true, "name" => $name]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update playlist"]);
}
?>
