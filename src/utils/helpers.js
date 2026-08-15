export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_GROUP_INFO = {
  'A+':  { title: 'A Positive', donateTo: ['A+', 'AB+'], receiveFrom: ['A+', 'A-', 'O+', 'O-'], tag: 'Common' },
  'A-':  { title: 'A Negative', donateTo: ['A+', 'A-', 'AB+', 'AB-'], receiveFrom: ['A-', 'O-'], tag: 'Rare' },
  'B+':  { title: 'B Positive', donateTo: ['B+', 'AB+'], receiveFrom: ['B+', 'B-', 'O+', 'O-'], tag: 'Common' },
  'B-':  { title: 'B Negative', donateTo: ['B+', 'B-', 'AB+', 'AB-'], receiveFrom: ['B-', 'O-'], tag: 'Rare' },
  'AB+': { title: 'AB Positive', donateTo: ['AB+'], receiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], tag: 'Universal Recipient' },
  'AB-': { title: 'AB Negative', donateTo: ['AB+', 'AB-'], receiveFrom: ['A-', 'B-', 'AB-', 'O-'], tag: 'Very Rare' },
  'O+':  { title: 'O Positive', donateTo: ['O+', 'A+', 'B+', 'AB+'], receiveFrom: ['O+', 'O-'], tag: 'High Demand' },
  'O-':  { title: 'O Negative', donateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], receiveFrom: ['O-'], tag: 'Universal Donor' },
};

export const BLOOD_GROUP_COLORS = {
  'A+':  { bg: 'rgba(239, 68, 68, 0.08)',  text: '#c9184a', border: 'rgba(239, 68, 68, 0.25)',  badge: '#ff758f' },
  'A-':  { bg: 'rgba(249, 115, 22, 0.08)', text: '#ea580c', border: 'rgba(249, 115, 22, 0.25)', badge: '#ffb703' },
  'B+':  { bg: 'rgba(59, 130, 246, 0.08)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.25)', badge: '#60a5fa' },
  'B-':  { bg: 'rgba(99, 102, 241, 0.08)', text: '#4f46e5', border: 'rgba(99, 102, 241, 0.25)', badge: '#818cf8' },
  'AB+': { bg: 'rgba(168, 85, 247, 0.08)', text: '#9333ea', border: 'rgba(168, 85, 247, 0.25)', badge: '#c084fc' },
  'AB-': { bg: 'rgba(236, 72, 153, 0.08)', text: '#db2777', border: 'rgba(236, 72, 153, 0.25)', badge: '#f472b6' },
  'O+':  { bg: 'rgba(16, 185, 129, 0.08)', text: '#059669', border: 'rgba(16, 185, 129, 0.25)', badge: '#34d399' },
  'O-':  { bg: 'rgba(217, 4, 41, 0.12)',   text: '#d90429', border: 'rgba(217, 4, 41, 0.3)',    badge: '#ef233c' },
};

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch (_) { return dateStr; }
}

export function getDaysSinceDonation(dateStr) {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isDonorEligible(lastDonationDate) {
  const days = getDaysSinceDonation(lastDonationDate);
  if (days === null) return true;
  return days >= 90;
}
