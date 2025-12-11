`<?php`
require_once "db.php"; // assumes $pdo is defined in db.php
header("Content-Type: application/json");

$playlist_id = $_GET["playlist_id"] ?? null;

try {
  if ($playlist_id) {
    $stmt = $pdo->prepare("
    SELECT s.*, a.name AS artist
    FROM songs s
    JOIN playlist_songs ps ON s.id = ps.song_id
    JOIN artists a ON s.artist_id = a.id
    WHERE ps.playlist_id = ?
  ");
    $stmt->execute([$playlist_id]);
  } else {
    $stmt = $pdo->query("
    SELECT s.*, a.name AS artist
    FROM songs s
    JOIN artists a ON s.artist_id = a.id
  ");
  }

  $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($songs);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
