<?php
require_once "db.php"; // assumes $conn is defined

$data = json_decode(file_get_contents("php://input"), true);

$song_id = $data["song_id"] ?? null;
$from_playlist_id = $data["from_playlist_id"] ?? null;
$to_playlist_id = $data["to_playlist_id"] ?? null;

if (!$song_id || !$from_playlist_id || !$to_playlist_id) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required parameters"]);
  exit;
}

// Step 1: Remove from current playlist
$delete = $conn->prepare("DELETE FROM playlist_songs WHERE song_id = ? AND playlist_id = ?");
$delete->bind_param("ii", $song_id, $from_playlist_id);
$delete->execute();

// Step 2: Add to new playlist
$insert = $conn->prepare("INSERT INTO playlist_songs (song_id, playlist_id) VALUES (?, ?)");
$insert->bind_param("ii", $song_id, $to_playlist_id);

if ($insert->execute()) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Failed to transfer song"]);
}
?>