# EdgePay

> A minimalist, visually stunning application for creating and managing simple payment links on the Cloudflare Edge.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tchalimflorent/-app-Florent)

## About The Project

EdgePay is a visually stunning, minimalist web application designed for small businesses and individuals to effortlessly create and manage payment links. The application runs entirely on Cloudflare's edge network, ensuring lightning-fast performance.

The core experience is centered around a sleek dashboard where users can view a history of their generated payment links, see their status, and generate new ones. Creating a link is achieved through an elegant, slide-in panel, requiring only an amount and a description. The resulting public payment page is clean, professional, and focuses on a seamless payment experience for the recipient.

The entire application is designed with meticulous attention to detail, featuring smooth animations, a sophisticated color palette, and an intuitive, responsive layout.

## Key Features

*   **Dashboard View**: A central hub to view and manage all created payment links.
*   **Effortless Link Creation**: A simple, intuitive form to generate new payment links in seconds.
*   **Public Payment Page**: A clean, professional, and trustworthy page for recipients to complete payments.
*   **Edge-First Performance**: Built on Cloudflare Workers and Durable Objects for global, low-latency access.
*   **Modern & Responsive**: A beautiful, mobile-first design that looks great on all devices.
*   **Visually Polished**: Meticulous attention to UI/UX, including smooth animations and micro-interactions.

## Technology Stack

*   **Frontend**:
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn/ui](https://ui.shadcn.com/)
    *   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    *   [Framer Motion](https://www.framer.com/motion/) for animations
    *   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for form validation
*   **Backend**:
    *   [Hono](https://hono.dev/) on Cloudflare Workers
*   **Database**:
    *   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
*   **Language**:
    *   [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/edgepay.git
    cd edgepay
    ```
2.  Install dependencies:
    ```sh
    bun install
    ```

## Development

To run the application in development mode, which includes hot-reloading for both the frontend and the worker, use the following command:

```sh
bun dev
```

This will start:
*   The React frontend on `http://localhost:3000` (or the next available port).
*   The Hono backend worker, accessible for local API calls.

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Login to Wrangler**:
    If you haven't already, authenticate Wrangler with your Cloudflare account:
    ```sh
    wrangler login
    ```

2.  **Deploy the Application**:
    Run the deploy script. This will build the Vite application and deploy it along with the worker to your Cloudflare account.
    ```sh
    bun run deploy
    ```

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/tchalimflorent/-app-Florent)

## Project Structure

The project is organized into three main directories:

*   `src/`: Contains the entire React frontend application, including pages, components, hooks, and utility functions.
*   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes and Durable Object entity definitions.
*   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety.

## License

Distributed under the MIT License. See `LICENSE` for more information.