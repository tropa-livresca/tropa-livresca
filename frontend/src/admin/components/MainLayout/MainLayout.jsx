import { useState } from "react";
import Cabecalho from "../Cabecalho/Cabecalho";
import NavBarLateral from "../NavBarLateral/NavBarLateral";

import BreadCrumbs from "../../../common/components/Breadcrumbs/Breadcrumbs.jsx"; ///workspaces/tropa-livresca/frontend/src/common/components/Breadcrumbs/Breadcrumbs.jsx

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
