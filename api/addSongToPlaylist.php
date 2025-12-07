<?php
require_once "db.php"; // assumes $pdo is defined

header("Content-Type: application/json");

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$song_id = isset($data["song_id"]) ? (int)$data["song_id"] : null;
$playlist_id = isset($data["playlist_id"]) ? (int)$data["playlist_id"] : null;

if (!$song_id || !$playlist_id) {
  http_response_code(400);
  echo json_encode(["error" => "Missing song_id or playlist_id"]);
  exit;
}

try {
  // Check if already added
  $check = $pdo->prepare("SELECT id FROM playlist_songs WHERE song_id = ? AND playlist_id = ?");
  $check->execute([$song_id, $playlist_id]);

  if ($check->fetch()) {
    http_response_code(409);
    echo json_encode(["error" => "Song already in playlist"]);
    exit;
  }

  // Insert into playlist_songs
  $stmt = $pdo->prepare("INSERT INTO playlist_songs (song_id, playlist_id) VALUES (?, ?)");
  $stmt->execute([$song_id, $playlist_id]);

  echo json_encode(["success" => true]);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
?>