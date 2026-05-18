import { useState, useEffect } from "react";
import axios from "axios";
import { Modal } from "./Modal";
import { FormCierreDespacho } from "./FormCierreDespacho";

export const TableDespachos = () => {
  const [despachos, setDespachos] = useState([]);

  const despacho = async () => {
    await axios
      .get("http://148.116.111.3:8081/api/v1/despachos", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setDespachos(response.data);
      });
  };

  useEffect(() => {
    despacho();
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [despachoSeleccionado, setDespachoSeleccionado] = useState(null);

  const handleAbrirModal = (despacho) => {
    setDespachoSeleccionado(despacho);
    setOpenModal(true);
  };

  const handleEliminarDespacho = async (idDespacho) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este despacho?");

    if (!confirmar) {
      return;
    }

    try {
      await axios.delete(
        `http://148.116.111.3:8081/api/v1/despachos/${idDespacho}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      alert("Despacho eliminado correctamente");
      despacho();
    } catch (error) {
      console.error("Error al eliminar despacho:", error);
      alert("No se pudo eliminar el despacho");
    }
  };

  return (
    <>
      <section className="grid text-center grid-cols-12 mb-8">
        <div className="col-span-12 flex justify-center">
          <div className="col-span-10 p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-white h-full overflow-hidden">
            <table className="table-fixed">
              <thead>
                <tr className="py-10">
                  <th className="pr-10">Orden de despacho</th>
                  <th className="pr-10">Orden de compra</th>
                  <th className="pr-10">Dirección de entrega</th>
                  <th className="pr-10">Fecha despacho</th>
                  <th className="pr-10">Patente Camión</th>
                  <th className="pr-10">Estado</th>
                  <th className="pr-10">Intentos de entrega</th>
                  <th className="pr-10">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {despachos.map((despacho) => (
                  <tr key={despacho.idDespacho}>
                    <td className="pr-10 py-10 items-center">
                      {despacho.idDespacho}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.idCompra}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.direccionCompra}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.fechaDespacho}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.patenteCamion}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.despachado
                        ? "Despacho entregado"
                        : "Despacho pendiente"}
                    </td>
                    <td className="pr-10 py-10 items-center">
                      {despacho.intento}
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleAbrirModal(despacho)}
                          className="py-1 bg-orange-200 px-8 rounded-xl shadow-md hover:bg-orange-300/70 transition-all duration-300"
                        >
                          Modificar despacho
                        </button>

                        <button
                          onClick={() =>
                            handleEliminarDespacho(despacho.idDespacho)
                          }
                          className="py-1 bg-red-200 px-8 rounded-xl shadow-md hover:bg-red-300/70 transition-all duration-300"
                        >
                          Eliminar despacho
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        onClose={() => {
          setOpenModal(false);
        }}
        open={openModal}
      >
        {despachoSeleccionado && (
          <FormCierreDespacho
            despacho={despachoSeleccionado}
            onClose={() => {
              setOpenModal(false);
              despacho();
            }}
          />
        )}
      </Modal>
    </>
  );
};