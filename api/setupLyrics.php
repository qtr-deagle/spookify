<?php
require_once "db.php";

try {
  // Check if lyrics column exists
  $stmt = $pdo->query("SHOW COLUMNS FROM songs LIKE 'lyrics'");
  $columnExists = $stmt->rowCount() > 0;

  if (!$columnExists) {
    // Add lyrics column if it doesn't exist
    $pdo->exec("ALTER TABLE songs ADD COLUMN lyrics LONGTEXT NULL");
    echo json_encode([
      "status" => "success",
      "message" => "Lyrics column added to songs table"
    ]);
  } else {
    echo json_encode([
      "status" => "info",
      "message" => "Lyrics column already exists"
    ]);
  }
} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode([
    "status" => "error",
    "message" => "Database error: " . $e->getMessage()
  ]);
}
?>
