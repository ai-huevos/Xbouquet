# Mission 3 Learnings

## Core Takeaways
- **Client-Side CSV Parsing**: Using `papaparse` directly on the browser provides a massive UX benefit because we can immediately expose the headers to the user to map accurately to their database schema without doing expensive round-trips to the server.
- **Complex UI Flows**: Creating a guided multi-step UI flow (Upload -> Map -> Review) requires careful state management, but makes a complex backend feature (mass ingestion) feel trivial for the Supplier.
- **Zod Data Coercion**: The `z.coerce.number()` modifier is essential when parsing CSV string payloads to safely coerce prices and stock values directly from the Papaparse objects before running them strictly against the database types. 
- **Zod Issue Formatting**: Make sure to iterate over `parsed.error.issues` instead of `parsed.error.errors` when handling validation failures gracefully.

## Architectural Notes
- The addition of `papaparse` purely on the client sidesteps serverless function payload limits, enabling us to support parsing massive CSV files natively in the frontend, chunked if necessary.
