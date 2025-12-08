<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$song_id = $data['song_id'];
$from_playlist_id = $data['from_playlist_id'];
$to_playlist_id = $data['to_playlist_id'];

// Remove from old playlist
$stmt = $pdo->prepare("DELETE FROM playlist_songs WHERE song_id = ? AND playlist_id = ?");
$stmt->execute([$song_id, $from_playlist_id]);

// Add to new playlist
$stmt = $pdo->prepare("INSERT INTO playlist_songs (song_id, playlist_id) VALUES (?, ?)");
$stmt->execute([$song_id, $to_playlist_id]);

echo json_encode(["success" => true]);
?>