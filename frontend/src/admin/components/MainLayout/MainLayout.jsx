import { useState } from "react";
import Cabecalho from "../Cabecalho/Cabecalho";
import NavBarLateral from "../NavBarLateral/NavBarLateral";
<<<<<<< HEAD
import Breadcrumbs from "../../../common/components/Breadcrumbs/Breadcrumbs";
=======
import BreadCrumbs from "../../../common/components/Breadcrumbs/Breadcrumbs.jsx"; ///workspaces/tropa-livresca/frontend/src/common/components/Breadcrumbs/Breadcrumbs.jsx
>>>>>>> a7825ecd3a4cab7be9e33501a65b4c6af6b52e93
import { useLoginAdmin } from "../../../common/features/autenticacao/hooks/useLoginAdmin";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { signoutAdmin } = useLoginAdmin();

  return (
    <>
      <Cabecalho
        aoAbrirMenu={() => setMenuAberto(!menuAberto)}
        signoutAdmin={signoutAdmin}
      />

      <NavBarLateral
        aberto={menuAberto}
        aoFechar={() => setMenuAberto(false)}
      />

      <main className={styles.conteudo}><BreadCrumbs/>{children}</main>
    </>
  );
}
