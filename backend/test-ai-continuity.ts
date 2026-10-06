async function main() {
  const baseUrl = 'http://localhost:5000/api';

  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@cadelibora.org',
      password: 'Cadelibora2026!',
    }),
  });

  const loginData: any = await login.json();

  if (!login.ok || !loginData.token) {
    throw new Error(`Login failed: HTTP ${login.status}`);
  }

  const token = loginData.token;

  console.log('LOGIN: PASS');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const first = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt: 'What course is currently available at CADELIBORA?',
    }),
  });

  const firstData: any = await first.json();

  console.log(`FIRST CHAT: HTTP ${first.status}`);

  if (!first.ok || !firstData.success) {
    console.log('FIRST CHAT ERROR:', firstData);
    return;
  }

  const conversationId = firstData.conversationId;

  console.log(`CONVERSATION ID: ${conversationId}`);
  console.log(`FIRST RESPONSE: ${String(firstData.response).substring(0, 300)}...`);

  const second = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      conversationId,
      prompt: 'What category does that course belong to?',
    }),
  });

  const secondData: any = await second.json();

  console.log(`SECOND CHAT: HTTP ${second.status}`);
  console.log('SECOND RESPONSE:', secondData);

  if (!second.ok || !secondData.success) {
    return;
  }

  const conversationResponse = await fetch(
    `${baseUrl}/ai/conversations/${conversationId}`,
    { headers }
  );

  const conversationData: any = await conversationResponse.json();

  console.log(
    `RETRIEVE CONVERSATION: HTTP ${conversationResponse.status}`
  );

  const messages = conversationData.conversation?.messages || [];

  console.log(`MESSAGE COUNT: ${messages.length}`);

  messages.forEach((message: any, index: number) => {
    console.log(
      `${index + 1}. ${message.role}: ${String(message.content).substring(0, 160)}`
    );
  });
}

main().catch((error) => {
  console.error('TEST ERROR:', error);
  process.exitCode = 1;
});
