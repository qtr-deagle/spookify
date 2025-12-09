<?php
require_once "db.php";
header("Content-Type: application/json");

try {
  // Get all distinct genres from songs table
  $stmt = $pdo->query("
    SELECT DISTINCT genre
    FROM songs
    WHERE genre IS NOT NULL AND genre != ''
    ORDER BY genre ASC
  ");
  
  $genres = $stmt->fetchAll(PDO::FETCH_COLUMN);
  echo json_encode($genres);
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(["error" => $e->getMessage()]);
}
?>
