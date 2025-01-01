import axios from "axios";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // Import react-hot-toast
import { backendUrl, currency } from "../App";


const List = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      console.log("Backend URL:", backendUrl + "/api/product/list");
      console.log(response.data); // Check the structure of the respons

      if (response.data && response.data.success && Array.isArray(response.data.products)) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message || "Unexpected response format.");
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      toast.error(err.message || "An error occurred while fetching the list.");
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + "/api/product/remove/", { id }, { headers: { token } });

      console.log(response.data); // Log the response for debugging

      if (response.data && response.data.success) {
        // Show success toast for product removal
        toast.success("Product removed successfully!");
        // Fetch the updated list after removing the product
        await fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove the product.");
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      toast.error(err.message || "An error occurred while removing the product.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-4 text-lg font-semibold">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b className="text-center">Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm" key={index}>
              <img className="w-12" src={item.images && item.images[0]} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency} {item.price}</p>
              <p onClick={() => removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg">X</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )}
      </div>
    </>
  );
};
List.propTypes = {
  token: PropTypes.string.isRequired,
};

export default List;