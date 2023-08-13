export function ping(req, res) {
  res.json({ success: true, data: 'pong' });
}
