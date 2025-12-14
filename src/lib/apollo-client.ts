import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "https://pm-backend-django-graphql.onrender.com/graphql/",
  credentials: "include", // or 'same-origin' if same domain
  fetchOptions: {
    mode: "cors", // explicitly set CORS mode
  },
});

// Optional: Add authentication headers if needed
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage or wherever you store it
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink), // Use authLink.concat(httpLink) if using auth
  // link: httpLink, // Use this if no auth needed
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
