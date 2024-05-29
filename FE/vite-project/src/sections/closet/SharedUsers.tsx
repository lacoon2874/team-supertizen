import { useApi } from "@/hooks/useApi";

function SharedUsers({ handleDispatch }) {
  const { data, isLoading } = useApi("get", "users/family?includeSelf=false");

  const handleClick = (item) => {
    // const value = event.target.textContent;
    // console.log(value);
    handleDispatch("updateSharedUsers", item);
  };

  if (isLoading) return <p>loading..</p>;

  return (
    <ul className="category-dropdown">
      {data.map((item) => {
        return (
          <li key={item.userId} onClick={() => handleClick(item)}>
            {item.userName}
          </li>
        );
      })}
    </ul>
  );
}

export default SharedUsers;
