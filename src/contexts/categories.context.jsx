import { createContext, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      title
      items {
        id
        name
        imageUrl
        price
      }
    }
  }
`;
export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});
  useEffect(() => {
    if (data) {
      const collections = data.collections;
      const categoriesMap = collections.reduce((acc, collection) => {
        acc[collection.title.toLowerCase()] = collection.items;
        return acc;
      }, {});
      setCategoriesMap(categoriesMap);
    }
  }, [data]);

  const value = { categoriesMap, loading };
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
};
