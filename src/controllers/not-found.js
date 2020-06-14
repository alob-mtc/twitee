// the not found controller
export default async function notFound() {
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    body: { status: 'error', error: 'Not found.' },
    statusCode: 404,
  };
}
