import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'antd';
import { FaTrash } from 'react-icons/fa';
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { getBills, getBillPaid, editBill, editBillCompleted, editBillPaid, deleteBill, cleanAlertBill } from '@/redux/thunks/billThunks';
import { incrementQuantity, decrementQuantity, incrementTax, decrementTax, removeProductFromBill } from '@/redux/slices/billSlice';
import { formatDateOnly } from '@/utils/formatedDate';
import { SweetAlertQuestion, SweetAlertSuccess, SweetAlertError } from '@/assets/js/sweetAlert';

export default function OrderView() {

  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { bills, billsPaid, message } = useSelector((state) => state.bill);
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

  const handleRemoveProduct = (billId, invoiceProduct) => {
    SweetAlertQuestion(
      'Quitar del pedido',
      `¿Desea quitar el producto ${invoiceProduct.product.name} del pedido?`,
      () => {
        dispatch(removeProductFromBill({ billId, productId: invoiceProduct.id }));
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
      total: invoiceProduct.total
    }));

    dispatch(editBill({ id: billId, invoiceProducts: updatedInvoiceProducts, token }))
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
      <h1 className="text-4xl font-bold text-white my-1">Pedidos por {isCobro === 'Cobrar' ? 'Cobrar' : 'Preparar'}</h1>

      <div className="flex flex-col items-center justify-center w-full p-4 gap-4">
        {isCobro === 'Cobrar' ?

          <>
            {bills.length === 0 ? (
              <div className="flex justify-center w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg">
                <h1 className="text-xl font-bold text-gray-400 my-4">No hay pedidos por cobrar</h1>
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
                      <table className="w-full min-w-[700px] bg-white">
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
                                {invoiceProduct.product.name}
                              </td>
                              <td className="text-center px-4 py-2 space-x-2">
                                <button
                                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                                  onClick={() => handleDecrement(bill.id, invoiceProduct.id)}
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
                                  className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 rounded transition transform active:translate-y-1"
                                  onClick={() => handleDecrementTax(bill.id, invoiceProduct.id)}
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
                                    onClick={() => handleRemoveProduct(bill.id, invoiceProduct)}
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
            <div className="flex justify-center w-full max-w-4xl bg-white rounded-lg p-6 shadow-lg">
              <h1 className="text-xl font-bold text-gray-400 my-4">No hay pedidos por preparar</h1>
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
                            {invoiceProduct.product.name}
                          </td>
                          <td className="text-center px-4 py-2 space-x-2">
                            <span>{invoiceProduct.amount}</span>
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
                    disabled={bill.invoiceProducts.length === 0}
                    onClick={() => handleCompleteBill(bill.id)}
                  >
                    Completar Pedido
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
            )
          )
        }
      </div>

    </>
  )
}
