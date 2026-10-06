import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CADELIBORA database seeding...');

  // 1. Password Hashing
  const defaultPasswordHash = await bcrypt.hash('Cadelibora2026!', 10);
  const superAdminPasswordHash = await bcrypt.hash('cade5213', 10);
  const adminPasswordHash = await bcrypt.hash('5213', 10);

  // 2. Users & Profiles
  const existingSuperAdmin = await prisma.user.findUnique({ where: { username: 'CADELIBORA' } });
  const superAdmin = existingSuperAdmin
    ? await prisma.user.update({
      where: { id: existingSuperAdmin.id },
      data: {
        passwordHash: superAdminPasswordHash,
        role: 'SUPER_ADMIN',
        isVerified: true,
        accountStatus: 'ACTIVE',
      },
    })
    : await prisma.user.upsert({
    where: { email: 'admin@cadelibora.org' },
    update: {
      username: 'CADELIBORA',
      passwordHash: superAdminPasswordHash,
      role: 'SUPER_ADMIN',
      isVerified: true,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'admin@cadelibora.org',
      username: 'CADELIBORA',
      passwordHash: superAdminPasswordHash,
      fullName: 'Dr. Sarah Vance',
      role: 'SUPER_ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      title: 'Founder & Chief Technology Officer',
      isVerified: true,
      profile: {
        create: {
          company: 'CADELIBORA Institute',
          location: 'San Francisco, CA & Zurich',
          website: 'https://cadelibora.org',
          github: 'https://github.com/cadelibora',
          bio: 'Visionary technologist, computer scientist, and AI research advocate leading CADELIBORA.',
          skillsJson: JSON.stringify(['AI System Architecture', 'Distributed Systems', 'Quantum Computing', 'Org Leadership']),
        },
      },
    },
  });

  const existingAdmin = await prisma.user.findUnique({ where: { username: 'CADE_ADMIN' } });
  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        passwordHash: adminPasswordHash,
        role: 'ADMIN',
        isVerified: true,
        accountStatus: 'ACTIVE',
      },
    });
  } else {
    await prisma.user.upsert({
    where: { email: 'cade.admin@cadelibora.org' },
    update: {
      username: 'CADE_ADMIN',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'cade.admin@cadelibora.org',
      username: 'CADE_ADMIN',
      passwordHash: adminPasswordHash,
      fullName: 'CADELIBORA Administrator',
      role: 'ADMIN',
      isVerified: true,
      profile: { create: { company: 'CADELIBORA', skillsJson: JSON.stringify([]) } },
    },
    });
  }

  const researcher = await prisma.user.upsert({
    where: { email: 'dr.elena@cadelibora.org' },
    update: {},
    create: {
      email: 'dr.elena@cadelibora.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Elena Rostova',
      role: 'RESEARCHER',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      title: 'Principal AI Scientist',
      isVerified: true,
      profile: {
        create: {
          company: 'CADELIBORA AI Research Lab',
          location: 'Zurich, Switzerland',
          bio: 'Pioneering neural reasoning architectures, post-transformer models, and AI alignment safety.',
          skillsJson: JSON.stringify(['Neural Architecture Search', 'Symbolic Reasoning', 'PyTorch', 'Rust']),
        },
      },
    },
  });

  const instructor = await prisma.user.upsert({
    where: { email: 'prof.marcus@cadelibora.org' },
    update: {},
    create: {
      email: 'prof.marcus@cadelibora.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Prof. Marcus Chen',
      role: 'INSTRUCTOR',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      title: 'Head of Software Engineering Academy',
      isVerified: true,
      profile: {
        create: {
          company: 'CADELIBORA Academy',
          location: 'Seattle, WA',
          bio: 'Passionate educator with 15+ years experience building cloud infrastructure and training engineers.',
          skillsJson: JSON.stringify(['TypeScript', 'Go', 'Kubernetes', 'System Design']),
        },
      },
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@cadelibora.org' },
    update: {},
    create: {
      email: 'student@cadelibora.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Alex Rivera',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      title: 'AI & Full-Stack Engineering Fellow',
      isVerified: true,
      profile: {
        create: {
          company: 'CADELIBORA Innovation Lab',
          location: 'Austin, TX',
          bio: 'Enthusiastic software developer learning advanced AI systems and building open-source projects.',
          skillsJson: JSON.stringify(['React', 'Node.js', 'Python', 'Tailwind CSS']),
        },
      },
    },
  });

  // 3. Courses & Lessons
  const course1 = await prisma.course.upsert({
    where: { slug: 'advanced-ai-architectures-llm-engineering' },
    update: {},
    create: {
      title: 'Advanced AI Architectures & LLM Engineering',
      slug: 'advanced-ai-architectures-llm-engineering',
      category: 'Artificial Intelligence',
      description: 'Master the design, fine-tuning, evaluation, and deployment of large language models and autonomous AI agent systems.',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      level: 'Advanced',
      duration: '16 hours',
      instructorId: instructor.id,
      lessons: {
        create: [
          { title: 'Introduction to Neural Attention & Transformer Math', order: 1, durationMinutes: 45, isFree: true, content: 'Deep dive into query, key, value matrices, multi-head attention, and positional encodings.' },
          { title: 'RLHF, DPO & Preference Alignment Techniques', order: 2, durationMinutes: 60, isFree: false, content: 'Understanding Direct Preference Optimization (DPO) and Reinforcement Learning from Human Feedback.' },
          { title: 'Autonomous Agentic Systems & Tool Use', order: 3, durationMinutes: 50, isFree: false, content: 'Building re-act loops, multi-agent orchestrations, and long-term memory vector storage.' },
          { title: 'LLM Quantization, Tensor Parallelism & Production Deployment', order: 4, durationMinutes: 75, isFree: false, content: 'Deploying high-throughput models with vLLM, TensorRT-LLM, and INT4/INT8 quantization.' },
        ],
      },
    },
  });

  const course2 = await prisma.course.upsert({
    where: { slug: 'cybersecurity-zero-trust-cloud-systems' },
    update: {},
    create: {
      title: 'Cybersecurity & Zero Trust Cloud Systems',
      slug: 'cybersecurity-zero-trust-cloud-systems',
      category: 'Cybersecurity',
      description: 'Learn modern defense-in-depth, identity perimeter architecture, micro-segmentation, and threat hunting in multi-cloud environments.',
      coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      level: 'Intermediate',
      duration: '12 hours',
      instructorId: instructor.id,
      lessons: {
        create: [
          { title: 'Principles of Zero Trust Architecture', order: 1, durationMinutes: 30, isFree: true, content: 'Never trust, always verify. Core paradigms of cloud security.' },
          { title: 'Identity, OAuth2, Mutual TLS & SPIFFE/SPIRE', order: 2, durationMinutes: 55, isFree: false, content: 'Cryptographic workload identity across Kubernetes clusters.' },
          { title: 'Real-Time Anomaly Detection & Cloud Threat Hunting', order: 3, durationMinutes: 40, isFree: false, content: 'Analyzing audit streams and security logs using automated detection rules.' },
        ],
      },
    },
  });

  // 4. Enrollments & Certificates
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course1.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course1.id,
      progress: 75,
      completed: false,
    },
  });

  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: student.id, courseId: course2.id } },
    update: {},
    create: {
      userId: student.id,
      courseId: course2.id,
      progress: 100,
      completed: true,
    },
  });

  await prisma.certificate.upsert({
    where: { certificateNumber: 'CAD-2026-CERT-8819' },
    update: {},
    create: {
      userId: student.id,
      courseId: course2.id,
      certificateNumber: 'CAD-2026-CERT-8819',
      issuedAt: new Date(),
    },
  });

  // 5. Research Projects & Publications
  const research1 = await prisma.researchProject.upsert({
    where: { slug: 'autonomous-neural-reasoners' },
    update: {},
    create: {
      title: 'Autonomous Neural Reasoners (ANR-X)',
      slug: 'autonomous-neural-reasoners',
      area: 'Artificial Intelligence & Cognitive Computing',
      description: 'Investigating hybrid symbolic-neural architectures capable of rigorous mathematical deduction and self-correcting logic.',
      status: 'Ongoing',
      leadResearcherId: researcher.id,
      startYear: 2024,
      endYear: 2027,
      tagsJson: JSON.stringify(['Neuro-Symbolic', 'Formal Verification', 'Reasoning LLMs']),
      publications: {
        create: [
          {
            title: 'Neuro-Symbolic Integration for Zero-Shot Mathematical Proofs',
            abstract: 'We introduce a dual-process neural reasoning framework that combines probabilistic language models with automated theorem provers.',
            authors: 'Dr. Elena Rostova, Dr. Sarah Vance',
            journal: 'Journal of Artificial Intelligence & Computing',
            year: 2025,
            doi: '10.1016/j.aico.2025.04.012',
          },
        ],
      },
    },
  });

  // 6. Products & Projects
  await prisma.product.upsert({
    where: { slug: 'cadelibora-ai-studio' },
    update: {},
    create: {
      title: 'CADELIBORA AI Studio',
      slug: 'cadelibora-ai-studio',
      tagline: 'Enterprise Neural Orchestration & Agent Workbench',
      description: 'Unified platform for building, benchmarking, monitoring, and deploying autonomous AI agents with strict security guardrails.',
      category: 'Developer Platform',
      version: '2.4.0',
      status: 'GA',
      demoUrl: 'https://ai.cadelibora.org',
      docsUrl: 'https://docs.cadelibora.org/ai-studio',
    },
  });

  await prisma.project.upsert({
    where: { slug: 'neural-mesh-engine' },
    update: {},
    create: {
      title: 'NeuralMesh Distributed Compute Engine',
      slug: 'neural-mesh-engine',
      description: 'High-performance open-source runtime for distributing multi-billion parameter inference across edge nodes.',
      category: 'Open Source',
      status: 'Active',
      techStackJson: JSON.stringify(['Rust', 'C++', 'CUDA', 'gRPC']),
      repoUrl: 'https://github.com/cadelibora/neural-mesh',
      featured: true,
    },
  });

  // 7. Articles & News
  await prisma.article.upsert({
    where: { slug: 'cadelibora-unveils-next-gen-ai-research-institute' },
    update: {},
    create: {
      title: 'CADELIBORA Unveils Next-Gen AI Research Institute & Open Platform',
      slug: 'cadelibora-unveils-next-gen-ai-research-institute',
      summary: 'Empowering global researchers, developers, and learners with open research models, interactive AI tools, and enterprise education.',
      content: 'Today CADELIBORA announces its expanded ecosystem combining cutting-edge AI research, digital education, open source projects, and enterprise security consulting...',
      category: 'Announcements',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      isPublished: true,
      authorId: superAdmin.id,
    },
  });

  // 8. Library Resources
  await prisma.libraryResource.upsert({
    where: { id: 'lib-001' },
    update: {},
    create: {
      id: 'lib-001',
      title: 'CADELIBORA Architecture Spec: Post-Quantum Cryptographic Resilience',
      resourceType: 'Whitepaper',
      author: 'CADELIBORA Cyber Security Division',
      category: 'Cybersecurity',
      description: 'Complete technical reference manual on lattice-based cryptography and migration paths for financial and enterprise systems.',
      tagsJson: JSON.stringify(['Quantum', 'Cryptography', 'Security']),
    },
  });

  // 9. Services & Case Studies
  await prisma.service.upsert({
    where: { slug: 'enterprise-ai-transformation' },
    update: {},
    create: {
      name: 'Enterprise AI & Agentic Systems Transformation',
      slug: 'enterprise-ai-transformation',
      icon: 'Cpu',
      shortDesc: 'Custom AI agent deployment, fine-tuning, and neural infrastructure setup.',
      fullDesc: 'We partner with organizations to build proprietary AI pipelines, secure vector search databases, and custom workflow automation with enterprise compliance.',
      featuresJson: JSON.stringify(['Custom LLM Fine-Tuning', 'Private Vector RAG', 'Guardrails & Audit Logs', 'High-Throughput Inference']),
    },
  });

  await prisma.caseStudy.upsert({
    where: { id: 'cs-001' },
    update: {},
    create: {
      id: 'cs-001',
      title: 'Modernizing Global FinTech Infrastructure with Zero Trust & AI',
      clientName: 'Global Banking Consortium',
      industry: 'Financial Technology',
      challenge: 'Legacy core systems required real-time fraud detection without compromising user latency or compliance.',
      solution: 'Deployed CADELIBORA NeuralMesh on edge clusters alongside automated Zero Trust identity verification.',
      resultsJson: JSON.stringify(['99.999% System Uptime', '12ms Latency Reduction', '98.4% Fraud Threat Prevention']),
      coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    },
  });

  // 10. Community Posts & Comments
  const post1 = await prisma.communityPost.create({
    data: {
      authorId: student.id,
      title: 'What are the best strategies for evaluating RAG retrieval accuracy?',
      content: 'I am building a document QA system using CADELIBORA AI Studio. What metrics (e.g., Hit Rate, MRR, ROUGE) give the most reliable evaluation?',
      category: 'AI',
      likesCount: 14,
      comments: {
        create: [
          {
            authorId: researcher.id,
            content: 'I recommend combining Context Recall with LLM-as-a-Judge semantic scoring for complex technical queries.',
          },
        ],
      },
    },
  });

  // 11. System Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INIT',
      entity: 'Database',
      detailsJson: JSON.stringify({ status: 'CADELIBORA Seed Complete', version: '1.0.0' }),
    },
  });

  console.log('✅ CADELIBORA Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error Seeding Database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
