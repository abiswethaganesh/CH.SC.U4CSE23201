import React, { useState, useEffect, useMemo } from "react";

const DUMMY_DATA = [
  { _id: "ntf-01", category: "job", title: "Tech Mahindra off-campus drive link active", createdAt: "2026-05-05T10:00:00Z" },
  { _id: "ntf-02", category: "academic", title: "End semester exam schedule revised", createdAt: "2026-05-04T14:30:00Z" },
  { _id: "ntf-03", category: "activity", title: "Photography club meeting at 5 PM", createdAt: "2026-05-03T09:15:00Z" },
  { _id: "ntf-04", category: "job", title: "TCS Ninja interview details mailed", createdAt: "2026-05-01T11:00:00Z" },
  { _id: "ntf-05", category: "academic", title: "Assignment 3 deadline extended by 2 days", createdAt: "2026-04-28T16:45:00Z" },
  { _id: "ntf-06", category: "activity", title: "Annual sports meet registrations opening soon", createdAt: "2026-04-25T08:00:00Z" },
  { _id: "ntf-07", category: "job", title: "Wipro Elite selection list published", createdAt: "2026-04-20T13:20:00Z" },
  { _id: "ntf-08", category: "academic", title: "Lab manual submission reminder", createdAt: "2026-04-18T15:00:00Z" },
  { _id: "ntf-09", category: "job", title: "Cognizant GenC next round shortlist", createdAt: "2026-04-15T10:00:00Z" },
];

const categoryConfig = {
  job: { bg: "#e6f0fa", txt: "#4a5568", icon: "WK" },
  academic: { bg: "#eef7e9", txt: "#4a5568", icon: "ED" },
  activity: { bg: "#f7e9f4", txt: "#4a5568", icon: "EV" }
};

const getRelativeTime = (dateString) => {
  const diffInMs = new Date() - new Date(dateString);
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return new Date(dateString).toLocaleDateString();
};

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('all'); // can be 'all' or 'top'
  const [currentCat, setCurrentCat] = useState('all');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    fetch('/api/v1/user/notifications')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        if (mounted) {
          setNotifications(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.warn('API failed, falling back to local data', err);
        if (mounted) {
          setNotifications(DUMMY_DATA);
          setIsLoading(false);
        }
      });

    return () => { mounted = false; }
  }, []);

  const stats = useMemo(() => {
    const s = { total: notifications.length, job: 0, academic: 0, activity: 0 };
    notifications.forEach(n => {
      if (s[n.category] !== undefined) s[n.category]++;
    });
    return s;
  }, [notifications]);

  let displayList = notifications;
  if (currentCat !== 'all') {
    displayList = notifications.filter(n => n.category === currentCat);
  }

  displayList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const topPriorityList = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const pMap = { job: 3, academic: 2, activity: 1 };
      const pA = pMap[a.category] || 0;
      const pB = pMap[b.category] || 0;
      if (pB !== pA) return pB - pA;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 3);
  }, [notifications]);

  const itemsToRender = viewMode === 'top' ? topPriorityList : displayList;

  return (
    <div style={{
      padding: '24px',
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#fcfcfc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '15px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#111', fontSize: '24px' }}>
          Alerts Center <span style={{ fontSize: '14px', background: '#ddd', padding: '2px 8px', borderRadius: '12px', verticalAlign: 'middle', marginLeft: '8px' }}>{stats.total}</span>
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('all')}
            style={{ padding: '8px 16px', background: viewMode === 'all' ? '#111' : '#fff', color: viewMode === 'all' ? '#fff' : '#111', border: '1px solid #111', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            All Updates
          </button>
          <button
            onClick={() => setViewMode('top')}
            style={{ padding: '8px 16px', background: viewMode === 'top' ? '#111' : '#fff', color: viewMode === 'top' ? '#fff' : '#111', border: '1px solid #111', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            Top 3 Priority
          </button>
        </div>
      </header>

      {!isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '25px' }}>
          {Object.entries({ total: stats.total, job: stats.job, academic: stats.academic, activity: stats.activity }).map(([key, val]) => (
            <div key={key} style={{ flex: '1 1 120px', background: '#fff', border: '1px solid #eaeaea', borderRadius: '8px', padding: '15px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ textTransform: 'capitalize', color: '#666', fontSize: '13px', marginBottom: '5px' }}>{key}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#111' }}>{val}</div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'all' && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          {['all', 'job', 'academic', 'activity'].map(cat => (
            <button
              key={cat}
              onClick={() => setCurrentCat(cat)}
              style={{
                cursor: 'pointer',
                padding: '6px 14px',
                background: currentCat === cat ? '#eee' : 'transparent',
                border: currentCat === cat ? '1px solid #ccc' : '1px solid transparent',
                borderRadius: '20px',
                color: '#333',
                textTransform: 'capitalize',
                fontSize: '14px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
          Loading notifications...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {itemsToRender.length > 0 ? itemsToRender.map((item, index) => {
            const config = categoryConfig[item.category] || { bg: '#f0f0f0', txt: '#4a5568', icon: 'NT' };
            const isTop1 = viewMode === 'top' && index === 0;

            return (
              <div key={item._id} style={{ display: 'flex', padding: '16px', width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid #eaeaea', borderRadius: '10px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '20px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: config.bg, borderRadius: '8px', marginRight: '16px', flexShrink: 0 }}>
                  {config.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', background: config.bg, color: config.txt, padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {item.category}
                    </span>
                    {isTop1 && (
                      <span style={{ fontSize: '11px', background: '#fce8e8', color: '#742a2a', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                        Highest Priority
                      </span>
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#1a1a1a', fontWeight: '600' }}>
                    {item.title}
                  </h4>

                  <div style={{ fontSize: '13px', color: '#888' }}>
                    {getRelativeTime(item.createdAt)} • {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999', background: '#fff', borderRadius: '10px', border: '1px solid #eaeaea' }}>
              No notifications to display right now.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDashboard;
