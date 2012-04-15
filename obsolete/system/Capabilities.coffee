R_CHROME = /(chrome)[ \/]([\w.]+)/
R_SAFARI = /(safari)[ \/]([\w.]+)/
R_WEBKIT = /(webkit)[ \/]([\w.]+)/
R_OPERA = /(opera)(?:.*version)?[ \/]([\w.]+)/
R_MSIE = /(msie) ([\w.]+)/
R_MOZILLA = /(mozilla)(?:.*? rv:([\w.]+))?/

ua = window.navigator.userAgent.toLowerCase()
browserInfo = R_CHROME.exec(ua) or R_SAFARI.exec(ua) or R_WEBKIT.exec(ua) or R_OPERA.exec(ua) or R_MSIE.exec(ua) or (ua.indexOf('compatible') is -1 and R_MOZILLA.exec(ua)) or []
browser = browserInfo[1] or ''
version = browserInfo[2] or '0'
versions = (Number(v) for v in version.split('.'))

class Capabilities

  browser:
    name    : browser
    version : version
    versions: versions
    is      : browser: true

  supports:
    smoothing: not (browser is 'msie' and versions[9] <= 7)
    VML      : browser is 'msie' and versions[0] <= 8 and document.namespace.add?()?
    touch    : document.createTouch?()?
    canvas   : window.HTMLCanvasElement?
