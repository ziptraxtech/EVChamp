import { Helmet } from 'react-helmet-async';
import './marketplace.css';
import Toolkit from './Toolkit';
import Footer from '../../Footer';

/**
 * EV Marketplace page — the EV-Buyer "Decision Toolkit" ported into EVChamp.
 * The `.ev-marketplace` wrapper scopes all toolkit styling so it cannot leak
 * into the rest of the site.
 */
export default function EVMarketplace() {
  return (
    <>
    <div className="ev-marketplace">
      <Helmet>
        <title>EV Marketplace | Find, Afford & Compare Electric Cars in India — EVChamp</title>
        <meta
          name="description"
          content="Match an EV to your life, check affordability, run the real-world numbers and plan the range across 16 Indian EVs — then book a free doorstep test drive."
        />
      </Helmet>
      <Toolkit />
    </div>
    <Footer />
    </>
  );
}
