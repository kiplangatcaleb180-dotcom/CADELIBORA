import prisma from '../config/db.js';

export async function recordMetric(metricName: string, metricValue: number) {
  return await prisma.systemMetric.create({
    data: { metricName, metricValue },
  });
}
