exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { url, body, title, priority, tags } = JSON.parse(event.body);

    const allowed = [
      'https://ntfy.sh/psv-calculateur-ouverture-2026',
      'https://ntfy.sh/psv-calculateur-risque-eleve-2026',
      'https://ntfy.sh/psv-calculateur-lead-2026'
    ];

    if (!allowed.includes(url)) {
      return { statusCode: 403, body: 'Forbidden' };
    }

    const response = await fetch(url, {
      method: 'POST',
      body: body,
      headers: {
        'Title': title,
        'Priority': priority,
        'Tags': tags
      }
    });

    return { statusCode: response.ok ? 200 : 502, body: response.ok ? 'OK' : 'ntfy error' };
  } catch (e) {
    return { statusCode: 500, body: 'Error: ' + e.message };
  }
};
