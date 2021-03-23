import styles from './MainArea.module.css';
import PageTabs from './PageTabs';

function MainArea() {
  return (
    <div className={styles.menuarea}>
      <PageTabs/>
    </div>
  );
}

export default MainArea;
