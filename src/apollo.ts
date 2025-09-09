import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3300/graphql", // URL do seu BFF GraphQL (agora HTTP)
});

const authLink = setContext((_, { headers }) => {
  // Obtenha o token de autenticação do armazenamento local, se existir
  const token = localStorage.getItem("jwt_token");
  // Retorne os cabeçalhos para o contexto, para que httpLink possa lê-los
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
