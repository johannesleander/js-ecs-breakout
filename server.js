const server = Bun.serve({
    fetch(request) {
        // Serve index.html for root requests
        if (request.url.endsWith("/") || request.url.endsWith("/index.html")) {
            console.log(`200 OK: ${request.url}`);
            return new Response(Bun.file("./public/index.html"));
        }
        const url = new URL(request.url);
        const path = url.pathname.slice(1); // Remove leading '/'

        if (path.startsWith("node_modules")) {
            console.log(`200 OK: ${request.url}`);
            return new Response(Bun.file(path), {
                headers: { "Content-Type": "application/javascript" }
            })
        }

        if (path.endsWith(".js")) {
            console.log(`200 OK: ${request.url}`);
            return new Response(Bun.file('./public/' + path), {
                headers: { "Content-Type": "application/javascript" }
            })
        }

        if (path && Bun.file(path).size > 0) {
            console.log(`200 OK: ${request.url}`);
            return new Response(Bun.file('./public/' + path));
        }
        // Fallback: 404
        console.log(`404 Not Found: ${request.url}`);
        return new Response("Not found", { status: 404 });
    },
    port: 3000
});

console.log(`Server running at http://localhost:${server.port}`);