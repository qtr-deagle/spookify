<?php
require 'db.php'; // your PDO connection

$userId = $_GET['user_id']; // pass user_id from frontend
$stmt = $pdo->prepare("
  SELECT p.*, COUNT(ps.song_id) AS song_count
  FROM playlists p
  LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
  WHERE p.user_id = ?
  GROUP BY p.id
");
$stmt->execute([$user_id]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
