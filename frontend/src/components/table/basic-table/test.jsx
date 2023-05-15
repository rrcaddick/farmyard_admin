import { Virtuoso } from "react-virtuoso";
import { generateUsers } from "./data";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

const Footer = ({ context: { loadMore, loading } }) => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button disabled={loading} onClick={loadMore}>
        {loading ? "Loading..." : "Press to load more"}
      </button>
    </div>
  );
};
export default function App() {
  const [users, setUsers] = useState(() => []);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(() => {
    setLoading(true);
    return setTimeout(() => {
      setUsers((users) => [...users, ...generateUsers(100, users.length)]);
      setLoading(() => false);
    }, 500);
  }, [setUsers, setLoading]);

  useEffect(() => {
    const timeout = loadMore();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Virtuoso
      context={{ loadMore, loading }}
      style={{ height: 300 }}
      data={users}
      itemContent={(index, user) => {
        return <div style={{ backgroundColor: user.bgColor }}>{user.name}</div>;
      }}
      components={{ Footer }}
    />
  );
}
