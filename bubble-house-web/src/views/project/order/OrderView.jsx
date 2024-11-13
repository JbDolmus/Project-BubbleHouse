import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { FaTrash } from 'react-icons/fa';
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { getBills, getBillPaid, editBill, editBillCompleted, editBillPaid, deleteBill, cleanAlertBill } from '@/redux/thunks/billThunks';
import { incrementQuantity, decrementQuantity, incrementTax, decrementTax, removeProductFromBill } from '@/redux/slices/billSlice';
import { formatDateOnly } from '@/utils/formatedDate';
import { SweetAlertQuestion, SweetAlertSuccess, SweetAlertError } from '@/assets/js/sweetAlert';
import Spinner from "@/components/Spinner";

export default function OrderView() {

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { bills, billsPaid, message, loading } = useSelector((state) => state.bill);
  const [isCobro, setIsCobro] = useState("Cobrar");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [amountPayments, setAmountPayments] = useState({});
  const [changesByBill, setChangesByBill] = useState({});

  const loadBills = () => {
    if (token) {
      dispatch(getBills(token));
      dispatch(getBillPaid(token));
    }
  };

  useEffect(() => {
    loadBills();
  }, [dispatch, token]);

  useEffect(() => {
    if (message === "Factura actualizada exitosamente!") {
      SweetAlertSuccess(message);
    }
  }, [message]);

  const handlePaymentChange = (billId, value) => {
    setAmountPayments((prev) => ({
      ...prev,
      [billId]: value,
    }));
  };

  const markBillAsChanged = (billId) => {
    setChangesByBill((prev) => ({
      ...prev,
      [billId]: true,
    }));
  };

  const handleIncrement = (billId, productId) => {
    dispatch(incrementQuantity({ billId, productId }));
    markBillAsChanged(billId);
  };

  const handleDecrement = (billId, productId) => {
    dispatch(decrementQuantity({ billId, productId }));
    markBillAsChanged(billId);
  };

  const handleIncrementTax = (billId, productId) => {
    dispatch(incrementTax({ billId, productId }));
    markBillAsChanged(billId);
  };

  const handleDecrementTax = (billId, productId) => {
    dispatch(decrementTax({ billId, productId }));
    markBillAsChanged(billId);
  };

  const handleRemoveProduct = (billId, nameProduct, productId) => {
    SweetAlertQuestion(
      'Quitar del pedido',
      `¿Desea quitar el producto ${nameProduct} del pedido?`,
      () => {
        dispatch(removeProductFromBill({ billId, productId }));
        markBillAsChanged(billId);
      },
      'Producto eliminado del pedido!'
    );
  };

  const handleApplyChanges = (billId) => {
    const bill = bills.find((bill) => bill.id === billId);

    const updatedInvoiceProducts = bill.invoiceProducts.map((invoiceProduct) => ({
      product: invoiceProduct.product.id,
      amount: invoiceProduct.amount,
      subtotal: invoiceProduct.subtotal,
      discount: invoiceProduct.discount,
      total: invoiceProduct.total,
      tax: invoiceProduct.product.tax,
    }));
    const updatedInvoiceRecipes = bill.invoiceRecipes.map((invoiceRecipe) => ({
      recipe: invoiceRecipe.recipe.id,
      amount: invoiceRecipe.amount,
      subtotal: invoiceRecipe.subtotal,
      discount: invoiceRecipe.discount,
      total: invoiceRecipe.total,
    }));

    dispatch(editBill({ id: billId, invoiceProducts: updatedInvoiceProducts, invoiceRecipes: updatedInvoiceRecipes, token }))
      .unwrap()
      .then(() => {
        loadBills();
        setChangesByBill((prev) => ({ ...prev, [billId]: false }));
        dispatch(cleanAlertBill());
      });
  };

  const handlePayBill = (bill) => {
    const amountPayment = amountPayments[bill.id] || 0;
    if (paymentMethod === "Efectivo" && parseFloat(amountPayment).toFixed(2) < bill.total) {
      SweetAlertError("Por favor ingrese un monto mayor al total de la compra!");
      setAmountPayments((prev) => ({ ...prev, [bill.id]: 0 }));
      return;
    }
    const finalMessage = paymentMethod === "Efectivo" ? `Su cambio es ₡${(amountPayment - bill.total).toFixed(2)}` : "Gracias por su compra!";
    SweetAlertQuestion(
      'Realizar cobro',
      '¿Desea realizar el cobro?',
      () => {
        dispatch(editBillPaid({ id: bill.id, isPaid: true, token }))
          .unwrap()
          .then(() => {
            loadBills();
            setChangesByBill((prev) => ({ ...prev, [bill.id]: false }));
            dispatch(cleanAlertBill());
          });
      },
      finalMessage
    );
  };

  const handleCompleteBill = (billId) => {
    SweetAlertQuestion(
      'Completar pedido',
      '¿Desea completar el pedido?',
      () => {
        dispatch(editBillCompleted({ id: billId, isCompleted: true, token }))
          .unwrap()
          .then(() => {
            loadBills();
            dispatch(cleanAlertBill());
          });
      },
      'Pedido completado!'
    )

  };

  const handleCancelOrder = (billId) => {
    const message = isCobro === 'Cobrar' ? "¡Todos los productos del pedido serán removidos!" : "¡No podrás revertir esta accion!";
    SweetAlertQuestion(
      'Cancelar pedido',
      '¿Desea cancelar el pedido? ' + message,
      () => {
        dispatch(deleteBill({ id: billId, token }))
          .unwrap()
          .then(() => {
            loadBills();
            setChangesByBill((prev) => ({
              ...prev,
              [billId]: false,
            }));
            dispatch(cleanAlertBill());
          });
      },
      'Pedido cancelado!'
    );
  };

  return (
    <>
      <NavBarPrincipal
        title={"Pedidos"}
      />
      {loading ?
        <Spinner />
        :
        <div className='felx flex-col items-center min-h-screen w-full'>
          <div className="bg-white px-4 py-2 w-full">
            <div className="flex justify-evenly gap-2 border border-gray-300 rounded-lg shadow-lg overflow-hidden">
              <button
                className={`w-full py-2 font-bold rounded-lg ${isCobro === 'Cobrar' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => setIsCobro('Cobrar')}
              >
                Cobrar
              </button>

              <button
                className={`w-full py-2 font-bold rounded-lg ${isCobro === 'Preparar' ? 'bg-black text-white' : 'bg-white text-black'}`}
                onClick={() => setIsCobro('Preparar')}
              >
                Preparar
              </button>
            </div>
          </div>
          <h1 className="text-4xl text-center font-bold text-white my-1">Pedidos por {isCobro === 'Cobrar' ? 'Cobrar' : 'Preparar'}</h1>

          <div className="flex flex-col items-center justify-center w-full p-4 gap-4">
            {isCobro === 'Cobrar' ?

              <>
                {bills.length === 0 ? (
                  <div className="mt-7 flex flex-col justify-center items-center w-full max-w-4xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-lg p-8 shadow-lg animate-bounce">
                    <h1 className="text-2xl font-semibold text-gray-500 mb-4">📦</h1>
                    <h1 className="text-2xl text-center font-bold text-gray-700">No hay pedidos por cobrar</h1>
                  </div>
                ) :
                  <>
                    <div className="w-full max-w-4xl">
                      <div className="bg-white flex justify-evenly gap-2 border border-gray-400 rounded-lg shadow-lg overflow-hidden">
                        <button
                          className={`w-full py-2 font-bold rounded-lg ${paymentMethod === 'Efectivo' ? 'bg-black text-white' : 'bg-white text-black'}`}
                          onClick={() => setPaymentMethod('Efectivo')}
                        >
                          Efectivo
                        </button>

                        <button
                          className={`w-full py-2 font-bold rounded-lg ${paymentMethod === 'Tarjeta' ? 'bg-black text-white' : 'bg-white text-black'}`}
                          onClick={() => setPaymentMethod('Tarjeta')}
                        >
                          Tarjeta
                        </button>
                      </div>
                    </div>

                    {bills.length > 0 && bills.map((bill) =>

                      <div key={bill.id} className="w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg relative">
                        <div className='flex justify-between items-center'>
                          <p className="text-xl font-bold text-gray-400 mb-4">Pedido número {bill.id}</p>
                          <p className="text-sm font-bold text-gray-400 mb-4">Fecha: {formatDateOnly(bill.created)}</p>
                        </div>
                        <h2 className='text-2xl text-gray-700 font-bold mb-2'>Factura</h2>
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[750px] bg-white">
                            <thead>
                              <tr className="bg-blue-200 text-left">
                                <th className="text-center px-4 py-2 text-gray-700">Producto</th>
                                <th className="text-center px-4 py-2 text-gray-700">Cantidad</th>
                                <th className="text-center px-4 py-2 text-gray-700">Precio</th>
                                <th className="text-center px-4 py-2 text-gray-700">Descuento (%)</th>
                                <th className="text-center px-4 py-2 text-gray-700">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bill.invoiceProducts && bill.invoiceProducts.map((invoiceProduct) => (
                                <tr key={invoiceProduct.id} className="border-t">
                                  <td className="px-4 py-2">
                                    <span className="font-semibold text-gray-700">{invoiceProduct.product.name}</span>
                                  </td>
                                  <td className="text-center px-4 py-2 space-x-2">
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                                      onClick={() => handleDecrement(bill.id, invoiceProduct.id)}
                                      disabled={invoiceProduct.amount < 2}
                                    >
                                      -
                                    </button>
                                    <span>{invoiceProduct.amount}</span>
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                                      onClick={() => handleIncrement(bill.id, invoiceProduct.id)}
                                    >
                                      +
                                    </button>
                                  </td>
                                  <td className="text-center px-4 py-2">
                                    ₡{invoiceProduct.product.price}
                                  </td>
                                  <td className="text-center px-4 py-2 space-x-2">
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                                      onClick={() => handleDecrementTax(bill.id, invoiceProduct.id)}
                                      disabled={invoiceProduct.product.tax < 1}
                                    >
                                      -
                                    </button>
                                    <span>{invoiceProduct.product.tax}%</span>
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                                      onClick={() => handleIncrementTax(bill.id, invoiceProduct.id)}
                                    >
                                      +
                                    </button>
                                  </td>
                                  <td className="text-center px-4 py-2">
                                    <Tooltip title="Eliminar producto" placement="right">
                                      <button
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded p-2 transition transform active:translate-y-1"
                                        onClick={() => handleRemoveProduct(bill.id, invoiceProduct.product.name, invoiceProduct.id)}
                                      >
                                        <FaTrash />
                                      </button>
                                    </Tooltip>
                                  </td>
                                </tr>
                              ))}
                              {bill.invoiceRecipes && bill.invoiceRecipes.map((invoiceRecipe) => (
                                <tr key={invoiceRecipe.id} className="border-t">
                                  <td className="px-4 py-2">
                                    <div className="flex flex-col space-y-2">
                                      <span className="font-semibold text-gray-700">{invoiceRecipe.recipe.name}</span>
                                      <ul className="mt-1">
                                        {invoiceRecipe.recipe.ingredients && invoiceRecipe.recipe.ingredients.map((ingredient) => (
                                          <li
                                            key={ingredient.id}
                                            className="text-gray-600 flex items-center space-x-2 mt-1"
                                          >
                                            <span className="bg-green-50 text-green-600 font-medium py-1 px-2 rounded-lg shadow-sm border border-green-200 text-sm">
                                              {ingredient.ingredient.ingredient_category.name}: {ingredient.ingredient.name}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </td>
                                  <td className="text-center px-4 py-2 space-x-2">
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                                      onClick={() => handleDecrement(bill.id, invoiceRecipe.id)}
                                      disabled={invoiceRecipe.amount < 2}
                                    >
                                      -
                                    </button>
                                    <span>{invoiceRecipe.amount}</span>
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                                      onClick={() => handleIncrement(bill.id, invoiceRecipe.id)}
                                    >
                                      +
                                    </button>
                                  </td>
                                  <td className="text-center px-4 py-2">
                                    ₡{invoiceRecipe.recipe.total_price - invoiceRecipe.recipe.total_discount}
                                  </td>
                                  <td className="text-center px-4 py-2 space-x-2">
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                                      disabled={true}
                                    >
                                      -
                                    </button>
                                    <span>0%</span>
                                    <button
                                      className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                                      disabled={true}
                                    >
                                      +
                                    </button>
                                  </td>
                                  <td className="text-center px-4 py-2">
                                    <Tooltip title="Eliminar producto" placement="right">
                                      <button
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded p-2 transition transform active:translate-y-1"
                                        onClick={() => handleRemoveProduct(bill.id, invoiceRecipe.recipe.name, invoiceRecipe.id)}
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
                              ₡{bill.total}
                            </div>
                          </div>
                          {paymentMethod === "Efectivo" && (
                            <div className="flex justify-start items-center gap-2 p-2 bg-gray-100 rounded-lg shadow-lg">
                              <div className="text-2xl font-bold text-gray-700">
                                Efectivo:
                              </div>
                              <div className="text-2xl font-light text-gray-600 mx-2">
                                <input
                                  className="w-36 p-1 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-300 shadow-sm"
                                  type="number"
                                  min="0"
                                  value={amountPayments[bill.id] || ''}
                                  onChange={(e) => handlePaymentChange(bill.id, e.target.value)}
                                  placeholder="₡0.00"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
                          <button
                            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                            disabled={bill.invoiceProducts.length === 0 || changesByBill[bill.id]}
                            onClick={() => handlePayBill(bill)}
                          >
                            Aceptar Pedido
                          </button>
                          <button
                            className='bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1'
                            disabled={!changesByBill[bill.id]}
                            onClick={() => handleApplyChanges(bill.id)}
                          >
                            Aplicar Cambios
                          </button>
                          <button
                            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                            disabled={bill.invoiceProducts.length === 0}
                            onClick={() => handleCancelOrder(bill.id)}
                          >
                            Cancelar Pedido
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                }
              </>
              :
              billsPaid.length === 0 ? (
                <div className="mt-7 flex flex-col justify-center items-center w-full max-w-4xl bg-gradient-to-r from-green-100 via-blue-100 to-yellow-100 rounded-lg p-8 shadow-lg animate-bounce">
                  <h1 className="text-2xl font-semibold text-gray-500 mb-4">⏳</h1>
                  <h1 className="text-2xl text-center font-bold text-gray-700">No hay pedidos por preparar</h1>
                </div>
              ) : (
                billsPaid.map((bill) =>
                  <div key={bill.id} className="w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg relative">
                    <div className='flex justify-between items-center'>
                      <p className="text-xl font-bold text-gray-400 mb-4">Pedido número {bill.id}</p>
                      <p className="text-sm font-bold text-gray-400 mb-4">Fecha: {formatDateOnly(bill.created)}</p>
                    </div>
                    <h2 className='text-2xl text-gray-700 font-bold mb-2'>Pedido</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[300px] bg-white">
                        <thead>
                          <tr className="bg-blue-200 text-left">
                            <th className="px-4 py-2 text-gray-700">Producto</th>
                            <th className="text-center px-4 py-2 text-gray-700">Cantidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bill.invoiceProducts && bill.invoiceProducts.map((invoiceProduct) => (
                            <tr key={invoiceProduct.id} className="border-t">
                              <td className="px-4 py-2">
                              <span className="font-semibold text-gray-700">{invoiceProduct.product.name}</span>
                              </td>
                              <td className="text-center px-4 py-2 space-x-2">
                                <span>{invoiceProduct.amount}</span>
                              </td>
                            </tr>
                          ))}
                          {bill.invoiceRecipes && bill.invoiceRecipes.map((invoiceRecipe) => (
                            <tr key={invoiceRecipe.id} className="border-t">
                              <td className="px-4 py-2">
                                <div className="flex flex-col space-y-2">
                                  <span className="font-semibold text-gray-700">{invoiceRecipe.recipe.name}</span>
                                  <ul className="mt-1">
                                    {invoiceRecipe.recipe.ingredients && invoiceRecipe.recipe.ingredients.map((ingredient) => (
                                      <li
                                        key={ingredient.id}
                                        className="text-gray-600 flex items-center space-x-2 mt-1"
                                      >
                                        <span className="bg-green-50 text-green-600 font-medium py-1 px-2 rounded-lg shadow-sm border border-green-200 text-sm">
                                          {ingredient.ingredient.ingredient_category.name}: {ingredient.ingredient.name}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </td>
                              <td className="text-center px-4 py-2 space-x-2">
                                <span>{invoiceRecipe.amount}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-8 flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
                      <button
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                        disabled={bill.invoiceProducts.length === 0 && bill.invoiceRecipes.length === 0}
                        onClick={() => handleCompleteBill(bill.id)}
                      >
                        Completar Pedido
                      </button>
                      <button
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:translate-y-1"
                        disabled={bill.invoiceProducts.length === 0 && bill.invoiceRecipes.length === 0}
                        onClick={() => handleCancelOrder(bill.id)}
                      >
                        Cancelar Pedido
                      </button>
                    </div>
                  </div>
                )
              )
            }
          </div>
        </div>
      }
    </>
  )
}
