# ProjectHub - Multi-tenant Project Management

A modern project management system with organization-based data isolation, task boards, and team collaboration features.

## Features

- **Multi-tenant Organizations**: Create and manage multiple organizations with isolated data
- **Project Management**: Organize work into projects with status tracking and due dates
- **Task Boards**: Kanban-style task boards with drag-and-drop functionality
- **Task Management**: Create, update, and delete tasks with assignees and due dates
- **Comments**: Add comments to tasks for team collaboration
- **Project Statistics**: View completion rates and task statistics

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **GraphQL Client**: Apollo Client
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: Apollo Client cache
- **Notifications**: Sonner (toast notifications)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd pm-frontend

# Install dependencies
npm install
```

### Environment Setup

The application connects to a GraphQL backend. The default endpoint is configured in `src/lib/apollo-client.ts`:

```
https://pm-backend-django-graphql.onrender.com/graphql
```
