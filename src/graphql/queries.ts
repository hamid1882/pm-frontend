import { gql } from "@apollo/client";

// Organization Queries
export const GET_ALL_ORGANIZATIONS = gql`
  query GetAllOrganizations {
    allOrganizations {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`;

// Project Queries
export const GET_PROJECTS = gql`
  query GetOrganizationProjects($organizationId: ID!) {
    organizationById(id: $organizationId) {
      id
      name
      projects {
        id
        name
        description
        status
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    projectById(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      organization {
        id
      }
    }
  }
`;

export const GET_PROJECT_STATS = gql`
  query GetProjectStats($projectId: ID!) {
    basicProjectStats(projectId: $projectId) {
      totalTasks
      completedTasks
      completionRate
    }
  }
`;

// Task Queries
export const GET_TASKS = gql`
  query GetTasks($id: ID!) {
    projectById(id: $id) {
      id
      description
      status
      createdAt
      tasks {
        id
        title
        status
        description
        assigneeEmail
        dueDate
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    taskById(id: $id) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
      project {
        id
      }
    }
  }
`;

// Task Comments Query
export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`;
