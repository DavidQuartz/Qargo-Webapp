import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { cartTotal, getCart } from "../../helpers/cartHelpers";
import ProductCard from "../../components/ProductCard/ProductCard";
import CheckOut from "../../components/CheckOut/CheckOut";
import "./cart-styles.scss";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [count, setCount] = useState(1);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setCartItems(getCart());
  }, [run]);

  const noItemsMessage = () => {
    return (
      <div>
        <h2>Your cart is empty</h2>
        <br />
        <Link to="/">Continue shopping</Link>
      </div>
    );
  };

  return (
    <div className="row cart-page">
      <div className="col-lg-8 col-md-8 col-xl-8">
        <div>
          <h1>
            Cart ({cartTotal()} {cartTotal() === 1 ? "item" : "items"})
          </h1>
        </div>
        <div>
          {cartItems.length > 0 ? (
            <Fragment>
              <ul className="cart-arrange">
                {cartItems.map((item, i) => (
                  <Fragment key={i}>
                    <ProductCard
                      product={item}
                      cart={true}
                      setRun={setRun}
                      run={run}
                    />
                  </Fragment>
                ))}
              </ul>
              <span>
                Placing an item in your shopping cart does not reserve that item
                or price. We only reserve stock for your order once payment is
                received.
              </span>
            </Fragment>
          ) : (
            noItemsMessage()
          )}
        </div>
      </div>
      <div className="col-lg-4 col-md-4 col-xl-4">
        <CheckOut products={cartItems} />
        Put in ahipping details, billing details and shipping
      </div>
    </div>
  );
};

export default CartPage;
