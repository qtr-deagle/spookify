<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$song_id = $data['song_id'];
$playlist_id = $data['playlist_id'];

// Remove song from playlist
$stmt = $pdo->prepare("DELETE FROM playlist_songs WHERE song_id = ? AND playlist_id = ?");
$stmt->execute([$song_id, $playlist_id]);

echo json_encode(["success" => true]);
?>
