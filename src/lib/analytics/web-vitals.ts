---
// src/lib/analytics/web-vitals.ts
// Core Web Vitals Real-User Monitoring (RUM)
// Uses web-vitals library to track LCP, CLS, INP, FCP, TTFB
// Reports to console in dev, ready for analytics endpoint in production

type MetricName = 'LCP' | 'CLS' | 'INP' | 'FCP' | 'TTFB';
type MetricRating = 'good' | 'needs-improvement' | 'poor';

interface WebVitalMetric {
  name: MetricName;
  value: number;
  rating: MetricRating;
  delta: number;
  id: string;
  navigationType: string;
}

const THRESHOLDS: Record<MetricName, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: MetricName, value: number): MetricRating {
  const t = THRESHOLDS[name];
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: WebVitalMetric) {
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
  // Ready to send to analytics endpoint:
  // navigator.sendBeacon('/api/analytics/vitals', JSON.stringify(metric));
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Dynamic import — only loaded on client
  import('web-vitals').then(({ onLCP, onCLS, onINP, onFCP, onTTFB }) => {
    function handleMetric(metric: { name: string; value: number; delta: number; id: string; navigationType: string }) {
      const m: WebVitalMetric = {
        name: metric.name as MetricName,
        value: metric.value,
        rating: getRating(metric.name as MetricName, metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      sendToAnalytics(m);
    }

    onLCP(handleMetric);
    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);
  }).catch(() => {
    // web-vitals not available — graceful degradation
  });
}