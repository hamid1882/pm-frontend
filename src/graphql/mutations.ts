import { gql } from "@apollo/client";

// Organization Mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization(
    $name: String!
    $slug: String!
    $contactEmail: String!
  ) {
    createOrganization(name: $name, slug: $slug, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
        createdAt
      }
    }
  }
`;

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationId: ID!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationId: $organizationId
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
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
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: ID!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
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
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
    }
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
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
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
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
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
    }
  }
`;

// Task Comment Mutations
export const ADD_TASK_COMMENT = gql`
  mutation AddTaskComment(
    $taskId: ID!
    $content: String!
    $authorEmail: String!
  ) {
    addTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
    }
  }
`;

export const DELETE_TASK_COMMENT = gql`
  mutation DeleteTaskComment($id: ID!) {
    deleteTaskComment(id: $id) {
      success
    }
  }
`;
