async function initMocks() {
  if (typeof window === 'undefined') {
    // todo this was originally ./server
    const { server } = await import('./setupWorker')
    server.listen({ onUnhandledRequest: 'bypass' })
    console.log('Mocks server listening')
  } else {
    throw new Error('client side request, not done yet')
    const { worker } = await import('./browser')
    worker.start({ onUnhandledRequest: 'bypass' })
    console.log('Mocks server started')
  }
}

initMocks().then(() => console.log('Mocks initialized 🎉'))

export {}
