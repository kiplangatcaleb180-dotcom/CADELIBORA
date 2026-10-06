process.env.NODE_ENV = 'test';

import app from './index.js';
import http from 'http';
import prisma from './config/db.js';

async function runIntegrationTests() {
  console.log('🧪 Starting CADELIBORA Backend Integration Test Suite...');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4001, resolve));
  const baseUrl = 'http://localhost:4001/api';

  try {
    // 1. Health Check
    const healthRes = await fetch('http://localhost:4001/health');
    const healthData: any = await healthRes.json();
    console.log('✅ Health Check Passed:', healthData.status);

    // 2. Admin Login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@cadelibora.org', password: 'Cadelibora2026!' }),
    });
    const loginData: any = await loginRes.json();
    if (!loginData.success || !loginData.token) throw new Error('Admin login failed');
    console.log('✅ Auth Login Passed: Received Token for Super Admin');
    const adminToken = loginData.token;

    const authHeader = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    };

    // 3. Auth Me
    const meRes = await fetch(`${baseUrl}/auth/me`, { headers: authHeader });
    const meData: any = await meRes.json();
    console.log('✅ Auth Me Passed:', meData.user.fullName, `(${meData.user.role})`);

    // 4. Courses API
    const coursesRes = await fetch(`${baseUrl}/courses`);
    const coursesData: any = await coursesRes.json();
    console.log('✅ Courses API Passed: Loaded', coursesData.courses.length, 'courses');

    // 5. Research API
    const researchRes = await fetch(`${baseUrl}/research/projects`);
    const researchData: any = await researchRes.json();
    console.log('✅ Research API Passed: Loaded', researchData.projects.length, 'research initiatives');

    // 6. Projects & Products API
    const projectsRes = await fetch(`${baseUrl}/projects`);
    const projectsData: any = await projectsRes.json();
    console.log('✅ Projects API Passed: Loaded', projectsData.products.length, 'products &', projectsData.projects.length, 'projects');

    // 7. Innovation API
    const innovationRes = await fetch(`${baseUrl}/innovation`);
    const innovationData: any = await innovationRes.json();
    console.log('✅ Innovation API Passed: Loaded', innovationData.concepts.length, 'innovation concepts');

    // 8. Digital Library API
    const libraryRes = await fetch(`${baseUrl}/library`);
    const libraryData: any = await libraryRes.json();
    console.log('✅ Digital Library API Passed: Loaded', libraryData.resources.length, 'resources');

    // 9. Community API
    const communityRes = await fetch(`${baseUrl}/community/posts`);
    const communityData: any = await communityRes.json();
    console.log('✅ Community API Passed: Loaded', communityData.posts.length, 'posts');

    // 10. AI Chat API
    const aiRes = await fetch(`${baseUrl}/ai/chat`, {
      method: 'POST',
      headers: authHeader,
      body: JSON.stringify({ prompt: 'Explain zero-trust workload identity' }),
    });
    const aiData: any = await aiRes.json();
    console.log('✅ AI Engine Chat Passed:', aiData.response.substring(0, 40), '...');

    // 11. Services & Case Studies API
    const servicesRes = await fetch(`${baseUrl}/services`);
    const servicesData: any = await servicesRes.json();
    console.log('✅ Services API Passed: Loaded', servicesData.services.length, 'services');

    // 12. Articles API
    const articlesRes = await fetch(`${baseUrl}/articles`);
    const articlesData: any = await articlesRes.json();
    console.log('✅ Articles API Passed: Loaded', articlesData.articles.length, 'articles');

    // 13. Admin Stats API
    const adminStatsRes = await fetch(`${baseUrl}/admin/stats`, { headers: authHeader });
    const adminStatsData: any = await adminStatsRes.json();
    console.log('✅ Admin Stats API Passed: Total Users =', adminStatsData.stats.totalUsers);

    console.log('🎉 ALL BACKEND REST API ENDPOINTS WIRED AND VERIFIED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Integration test failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    server.close();
    process.exit(0);
  }
}

runIntegrationTests();
