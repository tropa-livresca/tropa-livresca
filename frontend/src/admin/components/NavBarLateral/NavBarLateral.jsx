import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCog,
  BookOpen,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";
import styles from "./NavBarLateral.module.css";

const NAV_ITEMS = [
  { key: "geral",         label: "Painel Geral",        icon: LayoutDashboard },
  { key: "blog",          label: "Painel Blog",          icon: FileText },
  { key: "autores",       label: "Painel Autores",       icon: Users },
  { key: "funcionarios",  label: "Painel Funcionários",  icon: UserCog },
  { key: "livros",        label: "Painel Livros",        icon: BookOpen },
  { key: "notificacoes",  label: "Notificações",         icon: Bell },
  { key: "configuracoes", label: "Configurações",        icon: Settings },
];

const UNREAD = 3;

export default function NavBarLateral() {
  const [active, setActive] = useState(null);

  return (
    <aside className={styles.aside}>

      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <BookOpen />
        </div>
        <div>
          <p className={styles.logoTitle}>Editora</p>
          <p className={styles.logoSubtitle}>Painel Admin</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <span className={styles.navLabel}>Menu</span>

        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;

          return (
            <div key={key}>
              {key === "configuracoes" && <hr className={styles.divider} />}

              <button
                className={`${styles.navButton} ${isActive ? styles.active : ""}`}
                onClick={() => setActive(isActive ? null : key)}
              >
                <span className={styles.iconWrap}>
                  <Icon />
                  {key === "notificacoes" && UNREAD > 0 && (
                    <span className={styles.badge}>{UNREAD}</span>
                  )}
                </span>

                <span className={styles.navLabel2}>{label}</span>

                <ChevronRight className={styles.chevron} />
              </button>
            </div>
          );
        })}
      </nav>

      <div className={styles.user}>
        <div className={styles.avatar}>A</div>
        <div style={{ minWidth: 0 }}>
          <p className={styles.userName}>Admin Geral</p>
          <p className={styles.userEmail}>admin@editora.com.br</p>
        </div>
      </div>

    </aside>
  );
}
