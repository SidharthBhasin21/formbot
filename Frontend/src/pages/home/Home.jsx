import { Link } from 'react-router-dom';
import styles from './Home.module.css'


const Home = () => {
  return (
    <>
        <nav className={styles.navbar}>
        <div className={styles.logo}>
          <img src="/logo.png" height={35} alt="logo" />
          FormBot
        </div>
        <div className={styles.action}>
          <Link to="/login"><button className={styles.btnLogin}>Sign in</button></Link>
          <Link to="/register"><button>Create a FormBot</button></Link>
        </div>
      </nav>

      <section className={styles.hero}>
            <div className={styles.vector}>
                <h1>Build advanced chatbots visually</h1>
                <p>Typebot gives you powerful blocks to create unique chat experiences. Embed them anywhere on your web/mobile apps and start collecting results like magic.</p>
                <Link to="/register"><button>Create a FormBot for free</button></Link>
                <img className={styles.triangle} src="/images/triangle1.png"alt="triangle" />
                <img className={styles.semiCircle} src="/images/semi3d.png" alt="semi-circle" />
            </div>
            <img src="images/heroImg.png" alt="banner" />
        </section>

        <footer className={styles.footer}>
            <div className={styles.div}>
                Made with ❤️ by <br />
                <a href="#">@cuvette</a>
            </div>
            <div className={styles.div}>
              
                <li><a href="#" >Status</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">Documentation</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">Roadmap</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">Pricing</a></li>
            </div>
            <div className={styles.div}>
                <li><a href="#">Discord</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">GitHub repository</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">Twitter</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">LinkedIn</a><img className={styles.icon} src="/icons/arrow-square.png" alt="arrow-square icon" /></li>
                <li><a href="#">OSS Friends</a></li>
            </div>
            <div className={styles.div}>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
            </div>
        </footer>

    </>
  )
}

export default Home