const { SecureContext, SecureSocket } = library('openssl', {})

const contexts = {}
let defaultContext

const setSecure = (sock, onSecure, currentContext = defaultContext) => {
  const secureClient = new SecureSocket()
  secureClient.onHost(hostname => {
    if (!hostname) return false
    const context = contexts[hostname]
    if (!context) return false
    if (context.hostname === currentContext.hostname) return context
    return context
  })
  secureClient.onError((code, message) => {
    print(`SSL Error (${code}): ${message}`)
    sock.close()
  })
  sock.start = () => secureClient.start()
  sock.write = len => secureClient.write(len)
  secureClient.setup(currentContext, sock)
  if (onSecure) secureClient.onSecure(onSecure)
}

const addContext = (hostname, opts = { isServer: true, certStore: './certs' }) => {
  const { isServer, certStore } = opts
  const secureContext = new SecureContext()
  if (isServer) {
    secureContext.setup(0, `${certStore}/${hostname}/cert.pem`, `${certStore}/${hostname}/privkey.pem`, `${certStore}/${hostname}/fullchain.pem`)
  } else {
    secureContext.setup(1)
  }
  if (!defaultContext) defaultContext = secureContext
  secureContext.hostname = hostname
  contexts[hostname] = secureContext
  return secureContext
}

const getContext = hostname => contexts[hostname]
const deleteContext = hostname => (delete contexts[hostname])

module.exports = { setSecure, addContext, getContext, deleteContext }
