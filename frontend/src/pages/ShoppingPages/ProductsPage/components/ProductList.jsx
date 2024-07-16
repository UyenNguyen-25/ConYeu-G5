import { Link } from "react-router-dom";

const ProductList = ({ product }) => {
  const formatter = new Intl.NumberFormat("vi", {
    style: "currency",
    currency: "VND",
  });
  console.log("product list", product);
  return (
    <div className="grid grid-cols-4 gap-4 mt-4">
      {product?.map((item, index) => (
        <div key={index} className="bg-white shadow-2xl rounded-xl">
          <img
            className="w-2/3 m-auto my-8"
            src={item.product_img}
            alt={item.product_name}
          />
          <div className="px-6">
            <Link
              to={`/products/${item._id}`}
              className="font-semibold text-base"
            >
              {item.product_name}
            </Link>
            <div className="flex gap-3">
              <p className="font-bold my-4 text-base">
                {formatter.format(item.product_price)}
              </p>
              {
                item.product_price_discount > 0 && (
                  <p className="my-4 line-through text-xs">
                    {formatter.format(
                      Math.floor(
                        item.product_price / (1 - item.product_price_discount / 100)
                      )
                    )}
                  </p>
                )
              }

              <div className="flex flex-grow"></div>
              {
                item.product_price_discount > 0 && (
                  <p className="font-bold my-4 text-[#E44918]">
                    -{item.product_price_discount}%
                  </p>
                )
              }

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
