export default function handler(req, res) {
  res.writeHead(302, { Location: "/index.html" });
  res.end();
}
