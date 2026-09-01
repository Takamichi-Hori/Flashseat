import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const { id = "" } = useParams();

useEffect(() => {
    getEvent(id).then(setEvent);
}, [id]);

const [ quantity, setQuantity ] = useState(1);

async function reserveTickets() {

    const token = await getToken();

    await reserve(
        id,
        quantity,
        token!
    );
}