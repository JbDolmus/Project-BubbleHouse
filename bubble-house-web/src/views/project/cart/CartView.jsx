import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import NavBarSecondary from '@/layouts/NavBarSecondary';
import { FaTrash, FaClock } from 'react-icons/fa';
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from '@/redux/slices/cartSlice';
import { resetTimer } from '@/redux/slices/timerSlice';
import { addBill, cleanAlertBill } from '@/redux/thunks/billThunks';
import { SweetAlertQuestion, SweetAlertInfo } from '@/assets/js/sweetAlert';


export default function CartView() {

  const dispatch = useDispatch();
  const { products } = useSelector(state => state.cart);
  const { value: timer, isCounting } = useSelector((state) => state.timer);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timer >= 1800) {
      dispatch(clearCart());
      dispatch(resetTimer());
    }
    if (timer === 1740) {
      SweetAlertInfo('Te queda un minuto para completar tu pedido.');
    }
  }, [timer, dispatch]);

  const calculatePriceWithTax = (price, tax) => {
    const discount = price * (tax / 100);
    return (price - discount).toFixed(2);
  };

  const totalOrder = products.reduce((total, product) => {
    const priceWithTax = calculatePriceWithTax(parseFloat(product.price), product.tax);
    return total + (priceWithTax * product.quantity);
  }, 0).toFixed(2)

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const removeProduct = (product) => {
    SweetAlertQuestion(
      'Quitar del carrito',
      `¿Desea quitar el producto ${product.name} del carrito?`,
      () => {
        dispatch(removeFromCart(product.id))
        if (products.length <= 1) {
          dispatch(resetTimer());
        }
      },
      'Producto eliminado del carrito!'
    );
  };

  const makeOrder = () => {
    const invoiceProducts = products.map(product => {
      const subtotal = parseFloat(product.price) * product.quantity;
      const discount = subtotal * (product.tax / 100);
      const total = subtotal - discount;

      return {
        product: product.id,
        amount: product.quantity,
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        total: total.toFixed(2)
      };
    });

    SweetAlertQuestion(
      'Realizar pedido',
      '¿Desea realizar el pedido?',
      () => {
        dispatch(addBill({ invoiceProducts }))
          .unwrap()
          .then(() => {
            dispatch(clearCart());
            dispatch(resetTimer());
            dispatch(cleanAlertBill());
          });
      },
      'Gracias por su compra! Dentro de poco se efectuará el cobro.'
    );
  };


  const cancelOrder = () => {
    SweetAlertQuestion(
      'Cancelar pedido',
      '¿Desea cancelar el pedido? ¡Todos los productos del carrito seran removidos!',
      () => {
        dispatch(clearCart());
        dispatch(resetTimer());
      },
      'Pedido cancelado!'
    )

  };
  const progressPercentage = ((timer / 1800) * 100);

  return (
    <>
      <NavBarSecondary title="Carrito de compras" />
      <div className="flex flex-col items-center justify-center w-full p-4">
        <div className="w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg relative">

          {isCounting && (
            <div className="absolute top-16 right-6 flex items-center">
              <div className="relative w-12 h-12">
                <CircularProgressbar
                  value={progressPercentage}
                  styles={buildStyles({
                    textColor: 'transparent',
                    pathColor: timer >= 1740 ? '#f56565' : '#4a5568',
                    trailColor: '#e2e8f0',
                  })}
                />
                <FaClock className="absolute inset-0 m-auto text-gray-700 text-xl" />
              </div>
              <span className="ml-4 text-xl text-gray-700">{formatTime(1800 - timer)}</span>
            </div>
          )}

          <h1 className="text-xl font-bold text-gray-400 mb-4">Carrito de compras</h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pedido</h2>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] bg-white">
              <thead>
                <tr className="bg-blue-200 text-left">
                  <th className="text-center px-4 py-2 text-gray-700">Producto</th>
                  <th className="text-center px-4 py-2 text-gray-700">Cantidad</th>
                  <th className="text-center px-4 py-2 text-gray-700">Precio</th>
                  <th className="text-center px-4 py-2 text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {/* Iterar sobre los productos */}
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-2">
                      {product.name}
                    </td>
                    <td className="text-center px-4 py-2 space-x-2">
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                        onClick={() => handleDecrement(product.id)}
                      >
                        -
                      </button>
                      <span>{product.quantity}</span>
                      <button
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                        onClick={() => handleIncrement(product.id)}
                      >
                        +
                      </button>
                    </td>
                    <td className="text-center px-4 py-2">
                      ₡{calculatePriceWithTax(parseFloat(product.price), product.tax)}
                    </td>
                    <td className="text-center px-4 py-2">
                      <Tooltip title="Eliminar producto" placement="right">
                        <button
                          className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded p-2 transition transform active:translate-y-1"
                          onClick={() => removeProduct(product)}
                        >
                          <FaTrash />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resumen del pedido */}
          <div className="mt-6">
            <div className="flex justify-start items-center">
              <div className="text-2xl font-bold text-gray-500">
                Total:
              </div>
              {/* Calcular el total */}
              <div className="text-2xl font-light text-gray-600 mx-1">
                ₡{totalOrder}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
            <button
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
              disabled={products.length === 0}
              onClick={() => makeOrder()}
            >
              Realizar Pedido
            </button>
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
              disabled={products.length === 0}
              onClick={() => cancelOrder()}
            >
              Cancelar Pedido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
