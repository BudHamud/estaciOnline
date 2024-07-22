const TurnoCard = ({ turno }) => {
  const { fecha, horario, leccion, lugar, metodoPago, pagado, adicional, domicilio } = turno;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaFormateada = new Date(fecha).toLocaleDateString('es-ES', options);
  

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">{fechaFormateada} a las {horario}</h2>
      <p>Lección: {leccion}</p>
      <p>Lugar: {lugar}</p>
      { domicilio ? <p>Domicilio: {domicilio}</p> : '' }
      <p>Método de pago: {metodoPago}</p>
      <p>Pagado: {pagado ? 'Sí' : 'No'}</p>
      {adicional && <p>Adicional: {adicional}</p>}
    </div>
  );
};

export default TurnoCard;
