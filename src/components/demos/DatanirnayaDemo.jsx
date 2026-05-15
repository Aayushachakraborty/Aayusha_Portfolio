import './datanirnaya/datanirnaya-globals.css';
import DatanirnayaApp from './datanirnaya/DatanirnayaApp';

export default function DatanirnayaDemo() {
  return (
    <div
      className="dn-scope"
      style={{
        height: '680px',
        overflow: 'hidden',
        borderRadius: '6px',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
      }}
    >
      <DatanirnayaApp />
    </div>
  );
}
