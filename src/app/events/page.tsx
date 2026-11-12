import { redirect } from "next/navigation";

/** No hay listado en /events; redirige al panel principal. */
export default function EventsIndexPage() {
  redirect("/");
}
