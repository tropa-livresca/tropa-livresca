import { Outlet } from "react-router-dom";
import Cabecalho from "../Cabecalho/Cabecalho";
import NavBarLateral from "../NavBarLateral/NavBarLateral";
import { useLoginAdmin } from "../../../common/features/autenticacao/hooks/useLoginAdmin";
import styles from "./MainLayout.module.css";

export default function MainLayout() {
  const { signoutAdmin } = useLoginAdmin();

  return (
    <div className={styles.layout}>
      <Cabecalho signoutAdmin={signoutAdmin} />

      <div className={styles.areaPrincipal}>
        <NavBarLateral />

        <main className={styles.conteudo}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}