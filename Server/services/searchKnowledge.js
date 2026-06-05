import Rule from '../models/Rule.js';
import Notice from '../models/Notice.js';
import SocietyInfo from '../models/SocietyInfo.js';

export const searchKnowledgeBase = async (question) => {
  const query = question.toLowerCase();

  // 1. Search SocietyInfo First
  const societyInfos = await SocietyInfo.find();
  for (const info of societyInfos) {
    if ((query.includes('gym') && info.gymLocation) || (query.includes('where') && query.includes('gym'))) {
      if (info.gymLocation) return { source: '🏢 Society Information', title: 'Gym Location', answer: info.gymLocation };
    }
    if ((query.includes('office') || query.includes('manager')) && info.officeLocation) {
      return { source: '🏢 Society Information', title: 'Office Location & Timing', answer: `Office is located at ${info.officeLocation}. Timings: ${info.officeTiming}` };
    }
    if ((query.includes('emergency') || query.includes('help') || query.includes('police') || query.includes('ambulance')) && info.emergencyNumber) {
      return { source: '🏢 Society Information', title: 'Emergency Contact', answer: `Emergency Number: ${info.emergencyNumber}` };
    }
    if ((query.includes('clubhouse') || query.includes('club')) && info.clubhouseLocation) {
      return { source: '🏢 Society Information', title: 'Clubhouse Location', answer: info.clubhouseLocation };
    }
    if (query.includes('security') || query.includes('gate')) {
      if (info.securityDesk) return { source: '🏢 Society Information', title: 'Security Desk', answer: info.securityDesk };
    }
    if (query.includes('address') || query.includes('location')) {
      if (info.address) return { source: '🏢 Society Information', title: 'Society Address', answer: info.address };
    }
  }

  // 2. Search Rules
  const activeRules = await Rule.find({
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: new Date() } }
    ]
  });

  const matchedRules = activeRules.filter(r => {
    if (r.title.toLowerCase().includes(query) || r.category.toLowerCase().includes(query)) return true;
    if (r.keywords && r.keywords.some(k => query.includes(k.toLowerCase()))) return true;
    
    // Check if any major word from query is in the rule title or description
    const words = query.split(' ').filter(w => w.length > 3);
    for (const w of words) {
      if (r.title.toLowerCase().includes(w) || r.description.toLowerCase().includes(w) || r.category.toLowerCase().includes(w)) {
        return true;
      }
    }
    return false;
  });

  if (matchedRules.length > 0) {
    // Return the best match (first one)
    const rule = matchedRules[0];
    return {
      source: '📘 Society Rule',
      title: rule.title,
      answer: rule.description
    };
  }

  // 3. Search Notices
  const activeNotices = await Notice.find({
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ createdAt: -1 });

  const matchedNotices = activeNotices.filter(n => {
    if (query.includes('latest notice') || query.includes('recent notice')) return true; // Special case

    if (n.title.toLowerCase().includes(query)) return true;
    if (n.keywords && n.keywords.some(k => query.includes(k.toLowerCase()))) return true;
    
    const words = query.split(' ').filter(w => w.length > 3);
    for (const w of words) {
      if (n.title.toLowerCase().includes(w) || n.content.toLowerCase().includes(w)) {
        return true;
      }
    }
    return false;
  });

  if (matchedNotices.length > 0) {
    const notice = matchedNotices[0];
    return {
      source: '📢 Notice',
      title: notice.title,
      answer: notice.content
    };
  }

  // If nothing found in internal DB
  return null;
};
