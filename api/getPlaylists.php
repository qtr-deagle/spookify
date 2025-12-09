<?php
require 'db.php';

header('Content-Type: application/json');

// Accept user_id from query string, defaulting to 1 for now (matches frontend fallback)
$userId = isset($_GET['user_id']) ? (int) $_GET['user_id'] : 1;

try {
  $stmt = $pdo->prepare("
    SELECT p.*, COUNT(ps.song_id) AS song_count
    FROM playlists p
    LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
    WHERE p.user_id = ?
    GROUP BY p.id
  ");
  $stmt->execute([$userId]);

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
