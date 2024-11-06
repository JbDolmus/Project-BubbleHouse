import { createSlice } from "@reduxjs/toolkit";
import {
    getBills,
    getBill,
    getBillCompleted,
    getBillPaid,
    addBill,
    editBill,
    editBillCompleted,
    editBillPaid,
    deleteBill,
    cleanAlertBill
} from "../thunks/billThunks.js";

const billSlice = createSlice({
    name: "bill",
    initialState: {
        bill: null,
        bills: [],
        billsCompleted: [],
        billsPaid: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {
        incrementQuantity: (state, action) => {
            const { billId, productId } = action.payload;

            const bill = state.bills.find((bill) => bill.id === billId);

            if (bill) {

                const invoiceProduct = bill.invoiceProducts.find((p) => p.id === productId);
                const invoiceRecipe = bill.invoiceRecipes.find((r) => r.id === productId);

                if (invoiceProduct) {

                    invoiceProduct.amount += 1;

                    const price = parseFloat(invoiceProduct.product.price);
                    invoiceProduct.subtotal = (price * invoiceProduct.amount).toFixed(2);
                    invoiceProduct.discount = (invoiceProduct.subtotal * (invoiceProduct.product.tax / 100)).toFixed(2);
                    invoiceProduct.total = (parseFloat(invoiceProduct.subtotal) - parseFloat(invoiceProduct.discount)).toFixed(2);
                } else if (invoiceRecipe) {

                    invoiceRecipe.amount += 1;

                    invoiceRecipe.subtotal = (invoiceRecipe.recipe.total_price * invoiceRecipe.amount).toFixed(2);
                    invoiceRecipe.discount = (invoiceRecipe.recipe.total_discount * invoiceRecipe.amount).toFixed(2);
                    invoiceRecipe.total = (invoiceRecipe.subtotal - invoiceRecipe.discount).toFixed(2);
                }

                bill.subtotal = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.subtotal), 0
                ).toFixed(2);
                bill.discount = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.discount), 0
                ).toFixed(2);
                bill.total = (bill.subtotal - bill.discount).toFixed(2);
            }
        },

        decrementQuantity: (state, action) => {
            const { billId, productId } = action.payload;

            const bill = state.bills.find((bill) => bill.id === billId);

            if (bill) {
                const invoiceProduct = bill.invoiceProducts.find((p) => p.id === productId);
                const invoiceRecipe = bill.invoiceRecipes.find((r) => r.id === productId);

                if (invoiceProduct && invoiceProduct.amount > 1) {

                    invoiceProduct.amount -= 1;

                    const price = parseFloat(invoiceProduct.product.price);
                    invoiceProduct.subtotal = (price * invoiceProduct.amount).toFixed(2);
                    invoiceProduct.discount = (invoiceProduct.subtotal * (invoiceProduct.product.tax / 100)).toFixed(2);
                    invoiceProduct.total = (parseFloat(invoiceProduct.subtotal) - parseFloat(invoiceProduct.discount)).toFixed(2);
                } else if (invoiceRecipe && invoiceRecipe.amount > 1) {

                    invoiceRecipe.amount -= 1;

                    invoiceRecipe.subtotal = (invoiceRecipe.recipe.total_price * invoiceRecipe.amount).toFixed(2);
                    invoiceRecipe.discount = (invoiceRecipe.recipe.total_discount * invoiceRecipe.amount).toFixed(2);
                    invoiceRecipe.total = (invoiceRecipe.subtotal - invoiceRecipe.discount).toFixed(2);
                }

                bill.subtotal = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.subtotal), 0
                ).toFixed(2);
                bill.discount = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.discount), 0
                ).toFixed(2);
                bill.total = (bill.subtotal - bill.discount).toFixed(2);
            }
        },


        incrementTax: (state, action) => {
            const { billId, productId } = action.payload;

            const bill = state.bills.find((bill) => bill.id === billId);

            if (bill) {
                const invoiceProduct = bill.invoiceProducts.find((product) => product.id === productId);

                if (invoiceProduct && invoiceProduct.product.tax < 100) {
                    invoiceProduct.product.tax += 1;

                    const price = parseFloat(invoiceProduct.product.price);
                    invoiceProduct.subtotal = (price * invoiceProduct.amount).toFixed(2);
                    invoiceProduct.discount = (invoiceProduct.subtotal * (invoiceProduct.product.tax / 100)).toFixed(2);
                    invoiceProduct.total = (parseFloat(invoiceProduct.subtotal) - parseFloat(invoiceProduct.discount)).toFixed(2);

                    bill.subtotal = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                        (sum, item) => sum + parseFloat(item.subtotal), 0
                    ).toFixed(2);
                    bill.discount = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                        (sum, item) => sum + parseFloat(item.discount), 0
                    ).toFixed(2);
                    bill.total = (bill.subtotal - bill.discount).toFixed(2);
                }
            }
        },

        decrementTax: (state, action) => {
            const { billId, productId } = action.payload;

            const bill = state.bills.find((bill) => bill.id === billId);

            if (bill) {
                const invoiceProduct = bill.invoiceProducts.find((product) => product.id === productId);

                if (invoiceProduct && invoiceProduct.product.tax > 0) {
                    invoiceProduct.product.tax -= 1;

                    const price = parseFloat(invoiceProduct.product.price);
                    invoiceProduct.subtotal = (price * invoiceProduct.amount).toFixed(2);
                    invoiceProduct.discount = (invoiceProduct.subtotal * (invoiceProduct.product.tax / 100)).toFixed(2);
                    invoiceProduct.total = (parseFloat(invoiceProduct.subtotal) - parseFloat(invoiceProduct.discount)).toFixed(2);

                    bill.subtotal = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                        (sum, item) => sum + parseFloat(item.subtotal), 0
                    ).toFixed(2);
                    bill.discount = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                        (sum, item) => sum + parseFloat(item.discount), 0
                    ).toFixed(2);
                    bill.total = (bill.subtotal - bill.discount).toFixed(2);
                }
            }
        },

        removeProductFromBill: (state, action) => {
            const { billId, productId } = action.payload;

            const bill = state.bills.find((bill) => bill.id === billId);

            if (bill) {

                bill.invoiceProducts = bill.invoiceProducts.filter((product) => product.id !== productId);
                bill.invoiceRecipes = bill.invoiceRecipes.filter((recipe) => recipe.id !== productId);

                bill.subtotal = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.subtotal), 0
                ).toFixed(2);
                bill.discount = [...bill.invoiceProducts, ...bill.invoiceRecipes].reduce(
                    (sum, item) => sum + parseFloat(item.discount), 0
                ).toFixed(2);
                bill.total = (bill.subtotal - parseFloat(bill.discount)).toFixed(2);
            }
        },


    },
    extraReducers: (builder) => {
        // Cargar facturas
        builder.addCase(getBills.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getBills.fulfilled, (state, action) => {
            //console.log(action.payload);
            if (action.payload) {
                state.loading = false;
                state.bills = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar los facturas!";
            }
            state.loading = false;
        });
        builder.addCase(getBills.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar los facturas!";
        });

        // Cargar facturas completadas
        builder.addCase(getBillCompleted.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getBillCompleted.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.billsCompleted = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las facturas completadas!";
            }
            state.loading = false;
        });
        builder.addCase(getBillCompleted.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las facturas completadas!";
        });
        // Cargar facturas pagadas
        builder.addCase(getBillPaid.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getBillPaid.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.billsPaid = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las facturas pagadas!";
            }
            state.loading = false;
        });
        builder.addCase(getBillPaid.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las facturas pagadas!";
        });

        //Obtener una factura
        builder.addCase(getBill.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getBill.fulfilled, (state, action) => {
            if (action.payload) {
                state.bill = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(getBill.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar la factura!";
        });

        //Agregar factura
        builder.addCase(addBill.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addBill.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Factura agregada exitosamente!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(addBill.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar la factura!";
        });

        // Editar Factura
        builder.addCase(editBill.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editBill.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Factura actualizada exitosamente!";
            } else {
                state.errorRedux = "Ocurrió un error al editar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(editBill.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar la factura!";
        });
        // Editar Factura Completada
        builder.addCase(editBillCompleted.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editBillCompleted.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Factura completada exitosamente!";
            } else {
                state.errorRedux = "Ocurrió un error al completar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(editBillCompleted.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al completar la factura!";
        });
        // Editar Factura Pagada
        builder.addCase(editBillPaid.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editBillPaid.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Factura pagada exitosamente!";
            } else {
                state.errorRedux = "Ocurrió un error al pagar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(editBillPaid.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al pagar la factura!";
        });

        // Eliminar factura
        builder.addCase(deleteBill.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteBill.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Factura eliminada con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar la factura!";
            }
            state.loading = false;
        });
        builder.addCase(deleteBill.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar la factura!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertBill.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertBill.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertBill.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export const { incrementQuantity, decrementQuantity, incrementTax, decrementTax, removeProductFromBill } = billSlice.actions;

export default billSlice.reducer;
