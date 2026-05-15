import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getIssueSummary, loadPipelineData } from './pipelineData';
import styles from './DatanirnayaApp.module.css';

const Overview = lazy(() => import('./Overview'));
const IssueView = lazy(() => import('./IssueView'));

export default function DatanirnayaApp() {
  const [site, setSite] = useState('usa');
  const [activeDomain, setActiveDomain] = useState('overview');
  const [activeIssue, setActiveIssue] = useState('');
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState('');
  const issueSummary = useMemo(() => (dataReady ? getIssueSummary(site) : {}), [dataReady, site]);

  useEffect(() => {
    loadPipelineData()
      .then(() => setDataReady(true))
      .catch((error) => setDataError(error.message || 'Unable to load pipeline data.'));
  }, []);

  function handleSelect(domain, issue) {
    setActiveDomain(domain);
    setActiveIssue(issue);
  }
  function handleSiteChange(newSite) {
    setSite(newSite);
    setActiveDomain('overview');
    setActiveIssue('');
  }
  const showIssue = activeDomain !== 'overview' && activeIssue;
  return (
    <div className={styles.appShell}>
      <Topbar site={site} onSiteChange={handleSiteChange} />
      <div className={styles.body}>
        <Sidebar site={site} issueSummary={issueSummary} activeDomain={activeDomain} activeIssue={activeIssue} onSelect={handleSelect} />
        <main className={styles.main}>
          <div className={styles.mainInner}>
            {dataError ? (
              <div role="alert">{dataError}</div>
            ) : !dataReady ? (
              <div>Loading analytics data...</div>
            ) : (
              <Suspense fallback={<div>Loading view...</div>}>
                {showIssue ? (
                  <IssueView site={site} domain={activeDomain} issue={activeIssue} />
                ) : (
                  <Overview site={site} onSelect={handleSelect} />
                )}
              </Suspense>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
