<?php
require_once "db.php";
header("Content-Type: application/json");

$genre = $_GET["genre"] ?? null;

try {
  if (!$genre) {
    http_response_code(400);
    echo json_encode(["error" => "Genre is required"]);
    exit;
  }

  $stmt = $pdo->prepare("
    SELECT s.*, a.name AS artist
    FROM songs s
    JOIN artists a ON s.artist_id = a.id
    WHERE s.genre = ?
    LIMIT 10
  ");
  $stmt->execute([$genre]);
  
  $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);
  echo json_encode($songs);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
?>
