# AI Usage Declaration 🤖🌌

This project, **AstroManager**, was built in collaboration with AI coding assistants (using Gemini and Claude models). Below is a detailed declaration of how AI was utilized during the development lifecycle:

---

## 🛠️ Where AI Was Leveraged

### 1. Architectural Setup & Boilerplates
* Scaffolded the initial folder structures for both the Express/TypeScript backend and Vite/React/TypeScript frontend.
* Generated database schemas with strict TypeScript interfaces (`User`, `Client`, `Appointment`, `Consultation`, and `Payment`).

### 2. UI/UX Design & Theming (Cosmic Theme)
* Designed the premium CSS variables and glassmorphism elements inside the frontend stylesheets.
* Coded the sleek homepage landing experience (`HomePage.tsx`) and the dashboard portal templates.
* Constructed SVG layout geometries and custom gradients to achieve the glowing celestial layout.

### 3. Debugging & Performance Tuning
* **Mongoose Aggregation Bug:** Diagnosed why the dashboard revenue card was displaying `0` even when payments existed in the database (resolved by identifying that Mongoose's `$match` aggregation pipeline does not automatically cast string IDs to ObjectIds, and fixing it by explicitly casting the ID using `new mongoose.Types.ObjectId(userId)`).
* **Express Headers Bug:** Identified and corrected a runtime crash where the server attempted to set headers after they were sent, resolving it by restructuring the Express error handler middleware and the JWT validation controllers.

### 4. Integration of Google Gemini AI
* Wrote the service integration code for the `@google/generative-ai` package using `gemini-2.5-flash`.
* Designed prompts to convert raw, unstructured session notes into professional, concise 3-4 sentence summaries suitable for client distribution.
* Wrote graceful error handling to report key-validation errors on the client interface directly.

---

## 💡 AI Prompting & Workflows
* **Model Selection:** Gemini was utilized for rapid TypeScript code generation, compiler validation, and server orchestration, while Claude was leveraged during architectural planning and design reviews.
* **Code Quality Controls:** AI code review was used to enforce proper schema validation (Zod + React Hook Form), ensuring the code complies with strict typing and is free of formatting gaps.
