import { clientOnly } from "@solidjs/start";

export default function LeafletMap(props) {
    const LeafletMapClientOnly = clientOnly(() => import("./LeafletMapClientOnly"));

    return (
        <LeafletMapClientOnly {...props} />
    );
}